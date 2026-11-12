import { afterEach, describe, expect, it } from "vitest";
import {
  bearerMatches,
  createSessionToken,
  credentialsMatch,
  isActiveSession,
  isSecureRequest,
  normalizePathname,
  readSession,
  safeEqual,
} from "@/lib/auth";
import { rateLimitStatus, recordFailure, resetRateLimits } from "@/lib/rate-limit";

const secret = "test-session-secret";

afterEach(() => {
  delete process.env.BOTDASH_SESSION_SECRET;
  delete process.env.BOTDASH_USERNAME;
  resetRateLimits();
});

describe("auth", () => {
  it("compares equal strings and rejects different lengths", () => {
    expect(safeEqual("floor", "floor")).toBe(true);
    expect(safeEqual("floor", "floors")).toBe(false);
    expect(safeEqual("floor", "flour")).toBe(false);
  });

  it("checks both username and password", () => {
    expect(credentialsMatch("orel", "secret", "orel", "secret")).toBe(true);
    expect(credentialsMatch("orel", "nope", "orel", "secret")).toBe(false);
    expect(credentialsMatch("other", "secret", "orel", "secret")).toBe(false);
  });

  it("signs a session and rejects tampering, the wrong secret, and expiry", () => {
    const now = 1_700_000_000_000;
    const token = createSessionToken("orel", secret, now);
    expect(readSession(token, secret, now + 1000)).toEqual({
      u: "orel",
      exp: now + 30 * 24 * 60 * 60 * 1000,
    });
    expect(readSession(token, "other-secret", now + 1000)).toBeNull();
    expect(readSession(`${token}x`, secret, now + 1000)).toBeNull();
    const [body, signature] = token.split(".");
    expect(readSession(`${body}.${signature?.slice(0, -1)}a`, secret, now + 1000)).toBeNull();
    expect(readSession(token, secret, now + 31 * 24 * 60 * 60 * 1000)).toBeNull();
    expect(readSession("not-a-token", secret, now)).toBeNull();
  });

  it("accepts a session only when it matches the configured username", () => {
    process.env.BOTDASH_SESSION_SECRET = secret;
    process.env.BOTDASH_USERNAME = "orel";
    const token = createSessionToken("orel", secret);
    expect(isActiveSession(token)).toBe(true);
    process.env.BOTDASH_USERNAME = "someone-else";
    expect(isActiveSession(token)).toBe(false);
    expect(isActiveSession(undefined)).toBe(false);
  });

  it("compares bearer tokens in constant time and ignores a missing scheme", () => {
    expect(bearerMatches("Bearer ingest-token", "ingest-token")).toBe(true);
    expect(bearerMatches("Bearer wrong", "ingest-token")).toBe(false);
    expect(bearerMatches("ingest-token", "ingest-token")).toBe(false);
    expect(bearerMatches("Bearer ingest-token", undefined)).toBe(false);
    expect(bearerMatches(null, "ingest-token")).toBe(false);
  });

  it("strips the admin base path without eating similar prefixes", () => {
    expect(normalizePathname("/admin/bots")).toBe("/bots");
    expect(normalizePathname("/admin")).toBe("/");
    expect(normalizePathname("/admin/api/status/batch/")).toBe("/api/status/batch");
    expect(normalizePathname("/bots")).toBe("/bots");
    expect(normalizePathname("/administration")).toBe("/administration");
  });

  it("marks the session cookie secure only on https", () => {
    const https = new Headers({ "x-forwarded-proto": "https" });
    const http = new Headers({ "x-forwarded-proto": "http" });
    expect(isSecureRequest({ headers: https })).toBe(true);
    expect(isSecureRequest({ headers: http, nextUrl: { protocol: "https:" } })).toBe(false);
    expect(isSecureRequest({ headers: new Headers(), nextUrl: { protocol: "https:" } })).toBe(true);
  });

  it("locks a login key after repeated failures", () => {
    const now = 1_000;
    expect(rateLimitStatus("login:1", now).limited).toBe(false);
    for (let attempt = 0; attempt < 8; attempt += 1) recordFailure("login:1", now);
    const limited = rateLimitStatus("login:1", now + 10);
    expect(limited.limited).toBe(true);
    expect(limited.retryAfter).toBeGreaterThan(0);
    expect(rateLimitStatus("login:1", now + 16 * 60 * 1000).limited).toBe(false);
  });
});
