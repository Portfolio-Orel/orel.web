import { NextResponse, type NextRequest } from "next/server";
import { ensureRequest, failureMessage, invalid, json, logFailure, readBody, requireIngest } from "@/lib/http";
import { ackSchema } from "@/lib/schemas";
import { getStore } from "@/lib/storage";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireIngest(request);
  if (denied) return denied;

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = ackSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  try {
    const store = getStore();
    const existing = (await store.listActions()).find((action) => action.id === parsed.data.id);
    if (!existing) return json({ error: "Action not found." }, 404);
    if (existing.status === "handled") return json({ action: existing });

    const action = await store.updateAction(parsed.data.id, {
      status: "handled",
      handledAt: new Date().toISOString(),
      resultNote: parsed.data.result,
    });
    if (!action) return json({ error: "Action not found." }, 404);
    return json({ action });
  } catch (error) {
    logFailure("ack", error);
    return json({ error: failureMessage(error, "Could not acknowledge that action.") }, 500);
  }
};
