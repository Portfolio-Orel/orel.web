import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { FileDriver } from "@/lib/storage/file-driver";
import { ACTION_LIMIT, boundActions, boundEvents, EVENT_LIMIT, JsonBotStore } from "@/lib/storage/store";
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
});
