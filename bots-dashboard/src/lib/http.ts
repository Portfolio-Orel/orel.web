import { connection, NextResponse, type NextRequest } from "next/server";
import { bearerMatches, isActiveSession, SESSION_COOKIE } from "@/lib/auth";
import { formatIssues } from "@/lib/schemas";
import type { ZodError } from "zod";

export const ensureRequest = async (): Promise<void> => {
  await connection();
};

export const json = (body: unknown, status = 200): NextResponse => {
  const response = NextResponse.json(body, { status });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
};

export const clientIp = (request: Request): string => {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last.slice(0, 64);
  }
  return "unknown";
};

export const requireSession = (request: NextRequest): NextResponse | null => {
  if (!process.env.BOTDASH_SESSION_SECRET || !process.env.BOTDASH_USERNAME) {
    return json({ error: "Sign-in is not configured." }, 500);
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!isActiveSession(token)) return json({ error: "Unauthorized" }, 401);
  return null;
};

export const requireIngest = (request: Request): NextResponse | null => {
  const expected = process.env.BOTDASH_INGEST_TOKEN;
  if (!expected) return json({ error: "Ingest is not configured." }, 500);
  if (!bearerMatches(request.headers.get("authorization"), expected)) {
    return json({ error: "Unauthorized" }, 401);
  }
  return null;
};

export const readBody = async (request: Request): Promise<unknown | NextResponse> => {
  try {
    return await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
};

export const invalid = (error: ZodError): NextResponse =>
  json({ error: "Invalid payload", issues: formatIssues(error) }, 400);

export const failureMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message.includes("not configured")) return "Storage is not configured.";
  return fallback;
};

export const logFailure = (scope: string, error: unknown): void => {
  const name = error instanceof Error ? error.name : "error";
  console.error(`${scope} failed`, name);
};
