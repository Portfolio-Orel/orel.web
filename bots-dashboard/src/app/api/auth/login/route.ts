import { NextResponse, type NextRequest } from "next/server";
import {
  createSessionToken,
  credentialsMatch,
  isSecureRequest,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { ensureRequest, json, clientIp, readBody } from "@/lib/http";
import { loginSchema } from "@/lib/schemas";
import {
  clearFailures,
  LOGIN_FAILURE_DELAY_MS,
  rateLimitStatus,
  recordFailure,
  wait,
} from "@/lib/rate-limit";

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  await ensureRequest();
  const ip = clientIp(request);
  const limit = rateLimitStatus(ip);
  if (limit.limited) {
    await wait(LOGIN_FAILURE_DELAY_MS);
    return json({ error: "Too many attempts. Try again later." }, 429);
  }

  const body = await readBody(request);
  if (body instanceof NextResponse) return body;
  const parsed = loginSchema.safeParse(body);
  const username = process.env.BOTDASH_USERNAME ?? "";
  const password = process.env.BOTDASH_PASSWORD ?? "";
  const secret = process.env.BOTDASH_SESSION_SECRET ?? "";
  if (!username || !password || !secret) return json({ error: "Sign-in is not configured." }, 500);

  const submittedUser = parsed.success ? parsed.data.username : "";
  const submittedPass = parsed.success ? parsed.data.password : "";
  const matches = credentialsMatch(submittedUser, submittedPass, username, password);
  if (!parsed.success || !matches) {
    recordFailure(ip);
    await wait(LOGIN_FAILURE_DELAY_MS);
    return json({ error: "Those credentials didn't match." }, 401);
  }

  clearFailures(ip);
  const response = json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(username, secret), {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
};
