/**
 * masterDb.ts — server-only
 *
 * Connects to the "master" Firebase project that stores one TenantRecord per
 * NGO. This file MUST NOT be imported by any client component or file that
 * could end up in the browser bundle. The Next.js bundler enforces this via
 * the "server-only" package — importing from a client context throws a build-
 * time error.
 *
 * Credentials required (all server-only, no NEXT_PUBLIC_ prefix):
 *   FIREBASE_MASTER_PROJECT_ID
 *   FIREBASE_MASTER_CLIENT_EMAIL
 *   FIREBASE_MASTER_PRIVATE_KEY
 */
import "server-only";

import { initializeApp, cert, getApps, getApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { TenantFirebaseConfig } from "@/lib/firebase/clientApp";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TenantRecord {
  tenantId: string;
  /**
   * The client-safe Firebase config for this tenant's own Firebase project.
   * These values are public by design (they appear in every Firebase web app),
   * but are NOT baked into the build — they are fetched at request time.
   */
  firebaseConfig: TenantFirebaseConfig;
  /** CSS custom-property overrides: { "--primary": "#c00", ... } */
  theme?: Record<string, string>;
  orgName?: string;
  /** All hostnames that resolve to this tenant (primary + custom domains). */
  domains: string[];
}

// ── Admin App singleton ───────────────────────────────────────────────────────

function getMasterAdminApp(): App {
  const name = "master";
  try {
    return getApp(name);
  } catch {
    const projectId   = process.env.FIREBASE_MASTER_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_MASTER_CLIENT_EMAIL;
    const privateKey  = process.env.FIREBASE_MASTER_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "[masterDb] Missing required env vars: FIREBASE_MASTER_PROJECT_ID, " +
        "FIREBASE_MASTER_CLIENT_EMAIL, FIREBASE_MASTER_PRIVATE_KEY. " +
        "Add them to your .env.local file for local development."
      );
    }

    return initializeApp(
      {
        credential: cert({
          projectId,
          clientEmail,
          // Hosting platforms (Vercel, GitHub Actions) encode newlines as \n in secrets
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      },
      name,
    );
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Looks up the tenant whose `domains` array contains the given hostname.
 * Returns null if no matching tenant is found (renders a 404 in layout.tsx).
 *
 * Results are cached by Next.js unstable_cache at the call-site (layout.tsx
 * and the /api/tenant/config route) so this function itself stays cache-free
 * and straightforward to test.
 */
export async function getTenantByDomain(domain: string): Promise<TenantRecord | null> {
  const app = getMasterAdminApp();
  const db  = getFirestore(app);

  const snap = await db
    .collection("tenants")
    .where("domains", "array-contains", domain)
    .limit(1)
    .get();

  if (snap.empty) return null;

  return snap.docs[0].data() as TenantRecord;
}

/**
 * Looks up a tenant by its unique tenantId (used by admin provisioning flows).
 */
export async function getTenantById(tenantId: string): Promise<TenantRecord | null> {
  const app = getMasterAdminApp();
  const db  = getFirestore(app);

  const snap = await db.collection("tenants").doc(tenantId).get();
  if (!snap.exists) return null;
  return snap.data() as TenantRecord;
}

/**
 * Verifies that the given app is running inside the expected master admin app.
 * Exported for use in getApps() guards within the same server process.
 */
export function isMasterAppInitialized(): boolean {
  return getApps().some((a) => a.name === "master");
}
