import { NextResponse, type NextRequest } from "next/server";
import { ensureRequest, failureMessage, invalid, json, logFailure, readBody, requireIngest } from "@/lib/http";
import { statusSchema } from "@/lib/schemas";
import { saveStatuses } from "@/lib/status-ingest";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireIngest(request);
  if (denied) return denied;

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return invalid(parsed.error);

  try {
    await saveStatuses([parsed.data]);
    return json({ ok: true });
  } catch (error) {
    logFailure("status", error);
    return json({ error: failureMessage(error, "Could not save status.") }, 500);
  }
};
