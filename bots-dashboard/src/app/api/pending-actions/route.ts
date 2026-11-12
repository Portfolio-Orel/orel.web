import { NextResponse, type NextRequest } from "next/server";
import { ensureRequest, failureMessage, json, logFailure, requireIngest } from "@/lib/http";
import { getStore } from "@/lib/storage";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireIngest(request);
  if (denied) return denied;
  try {
    const actions = await getStore().listActions();
    const pending = actions
      .filter((action) => action.status !== "handled")
      .map((action) => ({
        id: action.id,
        botId: action.botId,
        type: action.type,
        itemId: action.itemId ?? null,
        text: action.text ?? null,
        status: action.status,
        createdAt: action.createdAt,
      }));
    return json({ actions: pending });
  } catch (error) {
    logFailure("pending actions", error);
    return json({ error: failureMessage(error, "Could not load actions.") }, 500);
  }
};
