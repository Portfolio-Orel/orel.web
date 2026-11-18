import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { FileDriver } from "@/lib/storage/file-driver";
import {
  ACTION_LIMIT,
  boundActions,
  boundEvents,
  EVENT_LIMIT,
  EVENTS_PATH,
  JsonBotStore,
  PreconditionError,
  type JsonDriver,
} from "@/lib/storage/store";
import type { ActionRecord, BotRecord, HistoryEvent } from "@/lib/types";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

const bot = (id: string): BotRecord => ({
  botId: id,
  name: id,
  status: "idle",
  summary: "Example summary.",
  needsOrel: [],
  links: [],
  updatedAt: "2026-11-12T08:00:00.000Z",
});

const event = (index: number): HistoryEvent => ({
  id: `evt-${index}`,
  botId: "jarvis",
  name: "Jarvis",
  status: "working",
  summary: `Example event ${index}`,
  at: new Date(index * 1000).toISOString(),
});

const action = (index: number, status: ActionRecord["status"]): ActionRecord => ({
  id: `act-${index}`,
  botId: "jarvis",
  type: "message",
  text: `Example ${index}`,
  status,
  createdAt: new Date(index * 1000).toISOString(),
});

describe("storage", () => {
  it("keeps the newest events and does not drop open actions", () => {
    const events = boundEvents(Array.from({ length: EVENT_LIMIT + 5 }, (_, index) => event(index)));
    expect(events).toHaveLength(EVENT_LIMIT);
    expect(events[0]?.id).toBe("evt-5");
    expect(events.at(-1)?.id).toBe(`evt-${EVENT_LIMIT + 4}`);

    const actions = [
      ...Array.from({ length: 3 }, (_, index) => action(index, "pending")),
      ...Array.from({ length: ACTION_LIMIT + 10 }, (_, index) => action(index + 3, "handled")),
    ];
    const kept = boundActions(actions);
    expect(kept.filter((item) => item.status === "pending")).toHaveLength(3);
    expect(kept).toHaveLength(ACTION_LIMIT);
  });

  it("round-trips bots, a bounded event log, and an action update on disk", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "botdash-"));
    directories.push(root);
    const store = new JsonBotStore(new FileDriver(root));
    await store.upsertBot({
      ...bot("jarvis"),
      name: "Jarvis",
      needsOrel: [{ id: "memo", title: "Send it?", kind: "approval" }],
      links: [{ label: "Draft", url: "https://example.com/draft" }],
    });
    await store.appendEvents([event(1), event(2)]);
    const saved = await store.appendAction(action(1, "pending"));
    const updated = await store.updateAction(saved.id, {
      status: "handled",
      handledAt: "2026-11-12T09:00:00.000Z",
      resultNote: "Sent.",
    });

    expect((await store.listBots()).map((item) => item.botId)).toEqual(["jarvis"]);
    expect(await store.listEvents()).toHaveLength(2);
    expect(updated?.status).toBe("handled");
    expect(updated?.resultNote).toBe("Sent.");
    expect(await store.updateAction("missing", { status: "handled" })).toBeNull();
  });

  it("stores a done row, hides that item, and restores it on reopen", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "botdash-"));
    directories.push(root);
    const store = new JsonBotStore(new FileDriver(root));
    await store.upsertBot({
      ...bot("jarvis"),
      needsOrel: [
        { id: "memo", title: "Send it?", detail: "Ready.", link: "https://example.com/memo", kind: "approval" },
        { id: "note", title: "Read this", kind: "fyi" },
      ],
    });
    await store.markDone({
      id: "memo",
      botId: "jarvis",
      title: "Send it?",
      detail: "Ready.",
      link: "https://example.com/memo",
      kind: "approval",
      status: "done",
      done_at: "2026-11-18T06:00:00.000Z",
      done_by: "orel",
    });

    expect((await store.listBots())[0]?.needsOrel.map((item) => item.id)).toEqual(["note"]);
    expect(await store.listDone()).toMatchObject([
      { id: "memo", botId: "jarvis", status: "done", done_by: "orel", done_at: "2026-11-18T06:00:00.000Z" },
    ]);

    const restored = await store.reopenDone("jarvis", "memo");
    expect(restored?.title).toBe("Send it?");
    expect((await store.listBots())[0]?.needsOrel.map((item) => item.id)).toEqual(["memo", "note"]);
    expect(await store.listDone()).toEqual([]);
    expect(await store.reopenDone("jarvis", "memo")).toBeNull();
  });

  it("leaves an unreadable events log in place and still stores bots", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "botdash-"));
    directories.push(root);
    await mkdir(path.join(root, "events"), { recursive: true });
    await mkdir(path.join(root, "bots"), { recursive: true });
    const logPath = path.join(root, "events", "log.json");
    const brokenBot = path.join(root, "bots", "jarvis.json");
    await writeFile(logPath, "{not json", "utf8");
    await writeFile(brokenBot, "{not json", "utf8");
    await writeFile(path.join(root, "bots", "search.json"), JSON.stringify(bot("search")), "utf8");

    const store = new JsonBotStore(new FileDriver(root));
    await store.upsertBot(bot("ada"));
    await store.appendEvents([event(1)]);

    expect(await readFile(logPath, "utf8")).toBe("{not json");
    expect(await readFile(brokenBot, "utf8")).toBe("{not json");
    expect(await store.listEvents()).toEqual([]);
    expect((await store.listBots()).map((item) => item.botId)).toEqual(["ada", "search"]);
  });

  it("saves the merged event log when every conditional write is rejected", async () => {
    const docs = new Map<string, unknown>();
    docs.set(EVENTS_PATH, [event(1)]);
    const writes: { pathname: string; tag?: string }[] = [];
    const driver: JsonDriver = {
      read: async (pathname) => {
        const value = docs.get(pathname);
        return value === undefined ? null : { value, tag: "stale" };
      },
      write: async (pathname, value, tag) => {
        writes.push({ pathname, tag });
        if (tag) throw new PreconditionError();
        docs.set(pathname, value);
      },
      list: async () => [...docs.keys()],
    };

    await new JsonBotStore(driver).appendEvents([event(2)]);

    expect(writes.filter((write) => write.tag)).toHaveLength(6);
    expect(writes.at(-1)).toEqual({ pathname: EVENTS_PATH, tag: undefined });
    const saved = docs.get(EVENTS_PATH);
    expect(Array.isArray(saved) ? saved.map((item) => (item as HistoryEvent).id) : []).toEqual([
      "evt-1",
      "evt-2",
    ]);
  });
});
