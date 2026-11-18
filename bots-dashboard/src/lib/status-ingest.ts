import { partitionNeeds } from "@/lib/done-items";
import { createId } from "@/lib/ids";
import { toBotRecord, type StatusInput } from "@/lib/schemas";
import { getStore, type BotStore } from "@/lib/storage";

export const ingestStatuses = async (
  store: BotStore,
  inputs: StatusInput[],
  now = new Date().toISOString(),
): Promise<number> => {
  const done = await store.listDone();
  const reopenKeys: { botId: string; itemId: string }[] = [];
  const bots = inputs.map((input) => {
    const partitioned = partitionNeeds(input.botId, input.needsOrel ?? [], done);
    for (const itemId of partitioned.reopenIds) reopenKeys.push({ botId: input.botId, itemId });
    return toBotRecord(
      {
        ...input,
        needsOrel: partitioned.items.map((item) => ({
          id: item.id,
          title: item.title,
          detail: item.detail,
          link: item.link,
          kind: item.kind,
        })),
      },
      now,
    );
  });
  await store.forgetDone(reopenKeys);
  for (const bot of bots) {
    await store.upsertBot(bot);
  }
  await store.appendEvents(
    bots.map((bot) => ({
      id: createId("evt"),
      botId: bot.botId,
      name: bot.name,
      status: bot.status,
      summary: bot.summary,
      at: bot.updatedAt,
    })),
  );
  return bots.length;
};

export const saveStatuses = async (inputs: StatusInput[]): Promise<number> => ingestStatuses(getStore(), inputs);
