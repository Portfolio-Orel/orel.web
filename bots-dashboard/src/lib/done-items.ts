import type { BotRecord, DoneRecord, NeedsOrelItem } from "@/lib/types";

export type IncomingNeed = NeedsOrelItem & { reopen?: boolean };

export const doneItemKey = (botId: string, itemId: string): string => `${botId}:${itemId}`;

export const isDoneFor = (done: DoneRecord[], botId: string, itemId: string): boolean =>
  done.some((row) => row.status === "done" && row.botId === botId && row.id === itemId);

/**
 * Sticky done, applied by both ingest routes.
 * A needsOrel item is dropped when a done row already exists for that botId + item id.
 * A later push cannot bring it back. `reopen: true` on that item is the only ingest
 * flag that deletes the row and keeps the item.
 */
export const partitionNeeds = (
  botId: string,
  items: IncomingNeed[],
  done: DoneRecord[],
): { items: NeedsOrelItem[]; reopenIds: string[] } => {
  const doneIds = new Set(done.filter((row) => row.status === "done" && row.botId === botId).map((row) => row.id));
  const kept: NeedsOrelItem[] = [];
  const reopenIds: string[] = [];

  for (const item of items) {
    const next: NeedsOrelItem = {
      id: item.id,
      title: item.title,
      detail: item.detail,
      link: item.link,
      kind: item.kind,
    };
    if (item.reopen === true) {
      reopenIds.push(item.id);
      kept.push(next);
      continue;
    }
    if (doneIds.has(item.id)) continue;
    kept.push(next);
  }

  return { items: kept, reopenIds };
};

export const withoutDoneItems = (bots: BotRecord[], done: DoneRecord[]): BotRecord[] =>
  bots.map((bot) => ({
    ...bot,
    needsOrel: bot.needsOrel.filter((item) => !isDoneFor(done, bot.botId, item.id)),
  }));

export const doneRecordFrom = (botId: string, item: NeedsOrelItem, doneAt: string): DoneRecord => ({
  id: item.id,
  botId,
  title: item.title,
  detail: item.detail,
  link: item.link,
  kind: item.kind,
  status: "done",
  done_at: doneAt,
  done_by: "orel",
});

export const itemFromDone = (row: DoneRecord): NeedsOrelItem => ({
  id: row.id,
  title: row.title,
  detail: row.detail,
  link: row.link,
  kind: row.kind,
});

export const visibleNeeds = (
  bots: BotRecord[],
  hiddenKeys: readonly string[],
  restored: Readonly<Record<string, NeedsOrelItem>> = {},
): BotRecord[] => {
  const hidden = new Set(hiddenKeys);
  return bots.map((bot) => {
    const extras = Object.entries(restored)
      .filter(([key, item]) => key === doneItemKey(bot.botId, item.id))
      .map(([, item]) => item)
      .filter((item) => !bot.needsOrel.some((entry) => entry.id === item.id));
    return {
      ...bot,
      needsOrel: [...extras, ...bot.needsOrel].filter((item) => !hidden.has(doneItemKey(bot.botId, item.id))),
    };
  });
};
