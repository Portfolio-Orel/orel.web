import { NextResponse, type NextRequest } from "next/server";
import { doneRecordFrom } from "@/lib/done-items";
import { createId } from "@/lib/ids";
import { ensureRequest, failureMessage, invalid, json, logFailure, readBody, requireSession } from "@/lib/http";
import { actionSchema, type ActionInput } from "@/lib/schemas";
import { getStore, type BotStore } from "@/lib/storage";
import type { ActionRecord, NeedsOrelItem } from "@/lib/types";
import { deliverAction } from "@/lib/webhook";

type PreparedDone =
  | { item: NeedsOrelItem; record: ReturnType<typeof doneRecordFrom> }
  | { alreadyDone: true }
  | NextResponse
  | null;

const prepareDone = async (store: BotStore, input: ActionInput): Promise<PreparedDone> => {
  if (input.type !== "done") return null;
  const itemId = input.itemId;
  if (!itemId) return json({ error: "itemId is required" }, 400);

  const bot = (await store.listBots()).find((entry) => entry.botId === input.botId);
  const item = bot?.needsOrel.find((entry) => entry.id === itemId);
  if (item) return { item, record: doneRecordFrom(input.botId, item, new Date().toISOString()) };

  const existing = (await store.listDone()).find(
    (row) => row.status === "done" && row.botId === input.botId && row.id === itemId,
  );
  if (existing) return { alreadyDone: true };
  return json({ error: "That item is not open." }, 404);
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireSession(request);
  if (denied) return denied;

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  try {
    const store = getStore();
    const prepared = await prepareDone(store, parsed.data);
    if (prepared instanceof NextResponse) return prepared;
    if (prepared && "alreadyDone" in prepared) return json({ alreadyDone: true });

    if (prepared) await store.markDone(prepared.record);

    const action: ActionRecord = {
      id: createId("act"),
      botId: parsed.data.botId,
      type: parsed.data.type,
      itemId: parsed.data.itemId,
      text: parsed.data.text,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await store.appendAction(action);
    const delivery = await deliverAction(action, prepared?.item);
    if (delivery.delivered) {
      action.status = "delivered";
      action.deliveredAt = new Date().toISOString();
      await store.updateAction(action.id, {
        status: "delivered",
        deliveredAt: action.deliveredAt,
      });
    } else if (delivery.error) {
      action.deliveryError = delivery.error;
      await store.updateAction(action.id, { deliveryError: delivery.error });
    }
    return json({ action });
  } catch (error) {
    logFailure("action", error);
    return json({ error: failureMessage(error, "Could not save that action.") }, 500);
  }
};
