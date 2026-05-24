/**
 * Server-only Firestore reads using the Firebase Admin SDK.
 *
 * Use these in Next.js Server Components / the root layout instead of the
 * client SDK equivalents from services.ts / navServices.ts.  The client SDK
 * uses gRPC streaming which produces "GRPC error has no .code" noise when run
 * server-side; the Admin SDK uses a plain HTTP transport that avoids this.
 */

import { getAdminDb } from "./adminConfig.server";
import { COLLECTIONS, DOCUMENT_IDS } from "./constants";
import { DEFAULT_NAV_ITEMS, type NavItem } from "./navServices";
import type { SiteSettings } from "./types";

export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db
    .collection(COLLECTIONS.SETTINGS)
    .doc(DOCUMENT_IDS.SITE_SETTINGS)
    .get();
  if (!snap.exists) return null;
  return snap.data() as SiteSettings;
}

export async function getNavConfigServer(): Promise<NavItem[]> {
  const db = getAdminDb();
  if (!db) return DEFAULT_NAV_ITEMS;
  try {
    const snap = await db
      .collection(COLLECTIONS.SETTINGS)
      .doc(DOCUMENT_IDS.NAVIGATION)
      .get();
    if (snap.exists) {
      const items = (snap.data()?.items ?? []) as NavItem[];
      if (items.length > 0) {
        return items.sort((a, b) => a.sortOrder - b.sortOrder);
      }
    }
  } catch (err) {
    console.error("[serverServices] getNavConfigServer error:", err);
  }
  return DEFAULT_NAV_ITEMS;
}
