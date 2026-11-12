import { createId } from "@/lib/ids";
import { toBotRecord, type StatusInput } from "@/lib/schemas";
import { getStore } from "@/lib/storage";

export const saveStatuses = async (inputs: StatusInput[]): Promise<number> => {
  const store = getStore();
  const now = new Date().toISOString();
  const bots = inputs.map((input) => toBotRecord(input, now));
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
