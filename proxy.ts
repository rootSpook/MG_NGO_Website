import { type NextRequest, NextResponse } from "next/server";

/**
 * Edge Proxy — tenant domain stamping
 *
 * This proxy is intentionally thin. It runs on every request in the Edge
 * Runtime, which prohibits Node.js APIs and the Firebase Admin SDK.
 *
 * Responsibility: extract the incoming hostname and forward it as
 * `x-tenant-domain` so that downstream Server Components and API routes can
 * look up the tenant record without re-parsing the Host header themselves.
 *
 * The actual tenant database lookup (masterDb.ts → getTenantByDomain) happens
 * in RootLayout (a Server Component) and in /api/tenant/config — both run in
 * the Node.js runtime where the Admin SDK is available.
 */
export function proxy(request: NextRequest): NextResponse {
  const host = request.headers.get("host") ?? "";
  // Strip the port so "localhost:3000" normalises to "localhost"
  const domain = host.split(":")[0].toLowerCase();

  const response = NextResponse.next();
  response.headers.set("x-tenant-domain", domain);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - Next.js internals (_next/static, _next/image)
     *  - Public static files (favicon.ico, robots.txt, site manifest, etc.)
     *
     * Keeping the matcher narrow prevents middleware from running on thousands
     * of static asset requests, which would add latency for no benefit.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)).*)",
  ],
};
