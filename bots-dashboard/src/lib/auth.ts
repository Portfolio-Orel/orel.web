import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "botdash_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionPayload = {
  u: string;
  exp: number;
};

export const safeEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    timingSafeEqual(leftBuffer, Buffer.alloc(leftBuffer.length));
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
};

const sign = (body: string, secret: string): string =>
  createHmac("sha256", secret).update(body).digest("base64url");

export const createSessionToken = (username: string, secret: string, now = Date.now()): string => {
  const payload: SessionPayload = {
    u: username,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
};

export const readSession = (
  token: string | undefined,
  secret: string,
  now = Date.now(),
): SessionPayload | null => {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  if (!body || signature === undefined) return null;
  const expected = sign(body, secret);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof payload.u !== "string" || payload.u.length === 0) return null;
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) return null;
    if (payload.exp <= now) return null;
    return { u: payload.u, exp: payload.exp };
  } catch {
    return null;
  }
};

export const isActiveSession = (token: string | undefined, now = Date.now()): boolean => {
  const secret = process.env.BOTDASH_SESSION_SECRET;
  const username = process.env.BOTDASH_USERNAME;
  if (!secret || !username) return false;
  const session = readSession(token, secret, now);
  if (!session) return false;
  return safeEqual(session.u, username);
};

export const credentialsMatch = (
  username: string,
  password: string,
  expectedUsername: string,
  expectedPassword: string,
): boolean => {
  const usernameMatches = safeEqual(username, expectedUsername);
  const passwordMatches = safeEqual(password, expectedPassword);
  return usernameMatches && passwordMatches;
};

export const bearerMatches = (header: string | null, expected: string | undefined): boolean => {
  const candidate = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  if (!expected) {
    safeEqual(candidate, "missing-token");
    return false;
  }
  return safeEqual(candidate, expected);
};

export const isSecureRequest = (request: {
  headers: Headers;
  nextUrl?: { protocol: string };
}): boolean => {
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwarded) return forwarded === "https";
  return request.nextUrl?.protocol === "https:";
};

export const normalizePathname = (pathname: string, basePath = "/admin"): string => {
  let path = pathname || "/";
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    path = path.slice(basePath.length) || "/";
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
};
