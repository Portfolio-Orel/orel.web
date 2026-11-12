import { NextResponse, type NextRequest } from "next/server";
import { isActiveSession, normalizePathname, SESSION_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = new Set([
  "/login",
  "/robots.txt",
  "/api/auth/login",
  "/api/status",
  "/api/status/batch",
  "/api/pending-actions",
  "/api/actions/ack",
]);

const ALLOWED_FORWARDED_HOSTS = new Set(["www.orelzilberman.com", "orelzilberman.com", "localhost", "127.0.0.1"]);

const originFor = (request: NextRequest): string => {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  const hostname = forwardedHost?.split(":")[0] ?? "";
  if (forwardedHost && (ALLOWED_FORWARDED_HOSTS.has(hostname) || hostname.endsWith(".orelzilberman.com"))) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return request.nextUrl.origin;
};

const redirectTo = (request: NextRequest, pathname: string): NextResponse => {
  const response = NextResponse.redirect(new URL(pathname, originFor(request)), 307);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export const proxy = (request: NextRequest): NextResponse => {
  const pathname = normalizePathname(request.nextUrl.pathname, request.nextUrl.basePath || "/admin");
  const signedIn = isActiveSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/login" && signedIn) return redirectTo(request, "/admin/bots");
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();
  if (signedIn) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  }

  return redirectTo(request, "/admin/login");
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
