import { NextResponse, type NextRequest } from "next/server";
import { itemFromDone } from "@/lib/done-items";
import { ensureRequest, failureMessage, invalid, json, logFailure, readBody, requireSession } from "@/lib/http";
import { undoDoneSchema } from "@/lib/schemas";
import { getStore } from "@/lib/storage";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireSession(request);
  if (denied) return denied;

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = undoDoneSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  try {
    const record = await getStore().reopenDone(parsed.data.botId, parsed.data.itemId);
    if (!record) return json({ error: "That item is not done." }, 404);
    return json({ botId: parsed.data.botId, item: itemFromDone(record) });
  } catch (error) {
    logFailure("undo done", error);
    return json({ error: failureMessage(error, "Could not undo that.") }, 500);
  }
};
