import { NextRequest, NextResponse } from "next/server";

/**
 * Posthog reverse proxy configuration.
 * @see https://posthog.com/docs/advanced/proxy/nextjs
 */
export function middleware(request: NextRequest) {
  let url = request.nextUrl.clone();
  const hostname = url.pathname.startsWith("/ingest/static/")
    ? "us-assets.i.posthog.com"
    : "us.i.posthog.com";
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("host", hostname);

  url.protocol = "https";
  url.hostname = hostname;
  url.port = "443";
  url.pathname = url.pathname.replace(/^\/ingest/, "");

  return NextResponse.rewrite(url, {
    headers: requestHeaders,
  });
}

export const config = {
  matcher: "/ingest/:path*",
};
