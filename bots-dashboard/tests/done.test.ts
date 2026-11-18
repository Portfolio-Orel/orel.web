import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { partitionNeeds, visibleNeeds, withoutDoneItems } from "@/lib/done-items";
import { actionPhrase } from "@/lib/format";
import { statusSchema, type StatusInput } from "@/lib/schemas";
import { ingestStatuses } from "@/lib/status-ingest";
import { FileDriver } from "@/lib/storage/file-driver";
import { JsonBotStore } from "@/lib/storage/store";
import type { ActionRecord, BotRecord, DoneRecord, NeedsOrelItem } from "@/lib/types";
import { webhookPayload } from "@/lib/webhook";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

const memo: NeedsOrelItem = {
  id: "memo",
  title: "Send the Tuesday memo?",
  detail: "It is ready.",
  link: "https://example.com/memo",
  kind: "approval",
};

const status = (botId: string, needs: Array<NeedsOrelItem & { reopen?: boolean }>): StatusInput =>
  statusSchema.parse({
    botId,
    name: botId,
    status: "waiting_on_orel",
    summary: "Waiting.",
    needsOrel: needs,
    updatedAt: "2026-11-18T06:00:00.000Z",
  });

const doneRow = (botId: string, item: NeedsOrelItem): DoneRecord => ({
  id: item.id,
  botId,
  title: item.title,
  detail: item.detail,
  link: item.link,
  kind: item.kind,
  status: "done",
  done_at: "2026-11-18T06:00:00.000Z",
  done_by: "orel",
});

const action = (type: ActionRecord["type"]): ActionRecord => ({
  id: "act-1",
  botId: "jarvis",
  type,
  itemId: "memo",
  status: "pending",
  createdAt: "2026-11-18T06:05:00.000Z",
});

describe("sticky done", () => {
  it("drops a done item id on re-push and revives it only with reopen", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "botdash-done-"));
    directories.push(root);
    const store = new JsonBotStore(new FileDriver(root));
    const open = status("jarvis", [memo, { id: "note", title: "Read this", kind: "fyi" }]);

    await ingestStatuses(store, [open, status("notes-bob", [{ ...memo, id: "memo", title: "Bob's memo" }])]);
    await store.markDone(doneRow("jarvis", memo));

    await ingestStatuses(store, [open, status("notes-bob", [{ ...memo, title: "Bob's memo" }])]);

    const bots = await store.listBots();
    const jarvis = bots.find((bot) => bot.botId === "jarvis");
    const bob = bots.find((bot) => bot.botId === "notes-bob");
    expect(jarvis?.needsOrel.map((item) => item.id)).toEqual(["note"]);
    expect(bob?.needsOrel.map((item) => item.id)).toEqual(["memo"]);
    expect(withoutDoneItems(bots, await store.listDone()).find((bot) => bot.botId === "jarvis")?.needsOrel).toEqual(
      jarvis?.needsOrel,
    );

    await ingestStatuses(store, [status("jarvis", [{ ...memo, reopen: true }, { id: "note", title: "Read this", kind: "fyi" }])]);
    expect((await store.listBots()).find((bot) => bot.botId === "jarvis")?.needsOrel.map((item) => item.id)).toEqual([
      "memo",
      "note",
    ]);
    expect(await store.listDone()).toEqual([]);
  });

  it("hides a dismissed card and counts a restored one", () => {
    const bots: BotRecord[] = [
      {
        botId: "jarvis",
        name: "Jarvis",
        status: "waiting_on_orel",
        summary: "Waiting.",
        needsOrel: [memo],
        links: [],
        updatedAt: "2026-11-18T06:00:00.000Z",
      },
    ];
    expect(visibleNeeds(bots, ["jarvis:memo"])[0]?.needsOrel).toEqual([]);
    expect(visibleNeeds(bots, [], { "jarvis:memo": memo })[0]?.needsOrel).toEqual([memo]);
    expect(partitionNeeds("jarvis", [memo], [doneRow("jarvis", memo)]).items).toEqual([]);
    expect(partitionNeeds("other", [memo], [doneRow("jarvis", memo)]).items.map((item) => item.id)).toEqual(["memo"]);
  });
});

describe("done action", () => {
  it("describes the activity line and the done webhook", () => {
    expect(actionPhrase(action("done"))).toBe("Done by Orel");
    expect(webhookPayload(action("approve"))).toEqual({
      id: "act-1",
      botId: "jarvis",
      type: "approve",
      itemId: "memo",
      text: null,
      createdAt: "2026-11-18T06:05:00.000Z",
    });
    expect(webhookPayload(action("done"), { title: memo.title, link: memo.link })).toEqual({
      id: "act-1",
      botId: "jarvis",
      type: "done",
      action: "done",
      itemId: "memo",
      title: "Send the Tuesday memo?",
      link: "https://example.com/memo",
      text: null,
      createdAt: "2026-11-18T06:05:00.000Z",
    });
    expect(webhookPayload(action("done"), { title: memo.title }).link).toBeNull();
  });
});
