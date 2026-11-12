import { NextResponse, type NextRequest } from "next/server";
import { ensureRequest, failureMessage, invalid, json, logFailure, readBody, requireIngest } from "@/lib/http";
import { batchSchema } from "@/lib/schemas";
import { saveStatuses } from "@/lib/status-ingest";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireIngest(request);
  if (denied) return denied;

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = batchSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  try {
    const count = await saveStatuses(parsed.data.bots);
    return json({ ok: true, count });
  } catch (error) {
    logFailure("status batch", error);
    return json({ error: failureMessage(error, "Could not save statuses.") }, 500);
  }
};
