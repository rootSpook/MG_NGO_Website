import { type NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getTenantByDomain } from "@/lib/tenant/masterDb";

/**
 * GET /api/tenant/config
 *
 * Returns the client-safe configuration for the tenant that owns the
 * requesting domain. Used by the admin dashboard's "reload config" flow and
 * by any client-side code that needs to verify the current tenant without a
 * full page reload.
 *
 * What is returned:   tenantId, firebaseConfig (public values), theme, orgName
 * What is NOT returned: master database credentials, admin private keys,
 *                        service account details, or any NEXT_PUBLIC_ variables
 *                        that were used at build time (those no longer exist).
 *
 * Cache: 5 minutes per domain. Busted by the admin dashboard via
 *   revalidateTag("tenant-config:<domain>") after the admin saves new settings.
 */

function buildCachedLookup(domain: string) {
  return unstable_cache(
    () => getTenantByDomain(domain),
    [`tenant-config:${domain}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`tenant-config:${domain}`],
    },
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Prefer the header stamped by middleware (always present in production).
  // Fall back to the query param for direct API calls during local development.
  const domain =
    request.headers.get("x-tenant-domain") ??
    request.nextUrl.searchParams.get("domain") ??
    "";

  if (!domain) {
    return NextResponse.json(
      { error: "missing_domain", message: "x-tenant-domain header or ?domain= query param is required" },
      { status: 400 },
    );
  }

  const tenant = await buildCachedLookup(domain)();

  if (!tenant) {
    return NextResponse.json(
      { error: "unknown_tenant", message: `No tenant registered for domain: ${domain}` },
      { status: 404 },
    );
  }

  // Strict: only forward fields the browser legitimately needs.
  // The master DB record may contain admin credentials — never forward those.
  return NextResponse.json({
    tenantId:      tenant.tenantId,
    firebaseConfig: tenant.firebaseConfig,
    theme:         tenant.theme ?? {},
    orgName:       tenant.orgName ?? "",
  });
}
