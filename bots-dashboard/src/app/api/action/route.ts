import { NextResponse, type NextRequest } from "next/server";
import { createId } from "@/lib/ids";
import { ensureRequest, failureMessage, invalid, json, logFailure, readBody, requireSession } from "@/lib/http";
import { actionSchema } from "@/lib/schemas";
import { getStore } from "@/lib/storage";
import type { ActionRecord } from "@/lib/types";
import { deliverAction } from "@/lib/webhook";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireSession(request);
  if (denied) return denied;

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  const action: ActionRecord = {
    id: createId("act"),
    botId: parsed.data.botId,
    type: parsed.data.type,
    itemId: parsed.data.itemId,
    text: parsed.data.text,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    const store = getStore();
    await store.appendAction(action);
    const delivery = await deliverAction(action);
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
