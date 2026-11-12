import { storedActionSchema, storedBotSchema, storedEventSchema } from "@/lib/schemas";
import type { ActionPatch, ActionRecord, BotRecord, HistoryEvent } from "@/lib/types";

export const EVENT_LIMIT = 200;
export const ACTION_LIMIT = 200;

const SAFE_PATH = /^(bots|events|actions)\/[A-Za-z0-9][A-Za-z0-9_.-]{0,120}\.json$/;

export class PreconditionError extends Error {
  constructor() {
    super("Precondition failed");
    this.name = "PreconditionError";
  }
}

export const assertSafePath = (pathname: string): void => {
  if (!SAFE_PATH.test(pathname)) throw new Error("Unsafe path");
};

export const botPath = (botId: string): string => `bots/${botId}.json`;
export const EVENTS_PATH = "events/log.json";
export const ACTIONS_PATH = "actions/log.json";

export type StoredDocument = {
  value: unknown;
  tag?: string;
};

export interface JsonDriver {
  read(pathname: string): Promise<StoredDocument | null>;
  write(pathname: string, value: unknown, tag?: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

export interface BotStore {
  upsertBot(bot: BotRecord): Promise<void>;
  listBots(): Promise<BotRecord[]>;
  appendEvents(events: HistoryEvent[]): Promise<void>;
  listEvents(): Promise<HistoryEvent[]>;
  appendAction(action: ActionRecord): Promise<ActionRecord>;
  listActions(): Promise<ActionRecord[]>;
  updateAction(id: string, patch: ActionPatch): Promise<ActionRecord | null>;
}

const tails = new Map<string, Promise<void>>();

const withLock = async <T>(key: string, task: () => Promise<T>): Promise<T> => {
  const previous = tails.get(key) ?? Promise.resolve();
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const tail = previous.then(
    () => gate,
    () => gate,
  );
  tails.set(
    key,
    tail.then(
      () => undefined,
      () => undefined,
    ),
  );
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
};

export const boundEvents = (events: HistoryEvent[]): HistoryEvent[] => {
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
  return sorted.slice(-EVENT_LIMIT);
};

export const boundActions = (actions: ActionRecord[], pinId?: string): ActionRecord[] => {
  const sorted = [...actions].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
  const open = sorted.filter((action) => action.status !== "handled");
  const handled = sorted.filter((action) => action.status === "handled");
  const handledRoom = Math.max(ACTION_LIMIT - open.length, 0);
  const keptHandled = handled.slice(-handledRoom);
  const kept = new Set([...open, ...keptHandled].map((action) => action.id));
  if (pinId) kept.add(pinId);
  return sorted.filter((action) => kept.has(action.id));
};

const parseBot = (value: unknown): BotRecord | null => {
  const parsed = storedBotSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
};

const parseEvents = (value: unknown): HistoryEvent[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = storedEventSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
};

const parseActions = (value: unknown): ActionRecord[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const parsed = storedActionSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
};

export class JsonBotStore implements BotStore {
  constructor(private readonly driver: JsonDriver) {}

  private async updateDocument<T>(
    pathname: string,
    fallback: T,
    parse: (value: unknown) => T,
    mutate: (current: T) => T,
  ): Promise<T> {
    return withLock(pathname, async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const current = await this.driver.read(pathname);
        const base = current ? parse(current.value) : fallback;
        const next = mutate(base);
        try {
          await this.driver.write(pathname, next, current?.tag);
          return next;
        } catch (error) {
          if (error instanceof PreconditionError && attempt < 5) continue;
          throw error;
        }
      }
      throw new Error("Could not update stored document");
    });
  }

  async upsertBot(bot: BotRecord): Promise<void> {
    const pathname = botPath(bot.botId);
    assertSafePath(pathname);
    await this.driver.write(pathname, bot);
  }

  async listBots(): Promise<BotRecord[]> {
    const paths = await this.driver.list("bots/");
    const bots = await Promise.all(
      paths.filter((pathname) => SAFE_PATH.test(pathname)).map(async (pathname) => {
        const document = await this.driver.read(pathname);
        if (!document) return null;
        return parseBot(document.value);
      }),
    );
    return bots
      .filter((bot): bot is BotRecord => bot !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async appendEvents(events: HistoryEvent[]): Promise<void> {
    if (events.length === 0) return;
    await this.updateDocument(EVENTS_PATH, [] as HistoryEvent[], parseEvents, (current) =>
      boundEvents([...current, ...events]),
    );
  }

  async listEvents(): Promise<HistoryEvent[]> {
    const document = await this.driver.read(EVENTS_PATH);
    if (!document) return [];
    return parseEvents(document.value).sort((a, b) => b.at.localeCompare(a.at) || b.id.localeCompare(a.id));
  }

  async appendAction(action: ActionRecord): Promise<ActionRecord> {
    await this.updateDocument(ACTIONS_PATH, [] as ActionRecord[], parseActions, (current) =>
      boundActions([...current, action], action.id),
    );
    return action;
  }

  async listActions(): Promise<ActionRecord[]> {
    const document = await this.driver.read(ACTIONS_PATH);
    if (!document) return [];
    return parseActions(document.value).sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id),
    );
  }

  async updateAction(id: string, patch: ActionPatch): Promise<ActionRecord | null> {
    const found: { action: ActionRecord | null } = { action: null };
    await this.updateDocument(ACTIONS_PATH, [] as ActionRecord[], parseActions, (current) => {
      const index = current.findIndex((action) => action.id === id);
      const currentAction = current[index];
      if (!currentAction) return current;
      const next = current.slice();
      const patched = { ...currentAction, ...patch };
      next[index] = patched;
      found.action = patched;
      return boundActions(next, id);
    });
    return found.action;
  }
}
