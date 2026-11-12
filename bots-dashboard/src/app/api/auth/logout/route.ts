import { NextResponse, type NextRequest } from "next/server";
import { isSecureRequest, SESSION_COOKIE } from "@/lib/auth";
import { ensureRequest, json, requireSession } from "@/lib/http";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const denied = requireSession(request);
  if (denied) return denied;
  const response = json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/admin",
    maxAge: 0,
  });
  return response;
};
