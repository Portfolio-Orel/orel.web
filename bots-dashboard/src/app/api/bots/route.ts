import { NextResponse, type NextRequest } from "next/server";
import { ensureRequest, failureMessage, json, logFailure, requireSession } from "@/lib/http";
import { getStore } from "@/lib/storage";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireSession(request);
  if (denied) return denied;
  try {
    const store = getStore();
    const [bots, events, actions] = await Promise.all([
      store.listBots(),
      store.listEvents(),
      store.listActions(),
    ]);
    return json({ bots, events, actions, serverTime: new Date().toISOString() });
  } catch (error) {
    logFailure("bots read", error);
    return json({ error: failureMessage(error, "Could not load the floor.") }, 500);
  }
};
