/**
 * getDefaultDb — server-side Firestore instance resolver.
 *
 * Used by server-only content helpers (publicContent.ts, publicPagesContent.ts)
 * and API routes that run outside the React component tree and therefore cannot
 * use useTenantFirebase().
 *
 * Resolution order:
 *  1. In production (FIREBASE_MASTER_* set): the caller should obtain `db` by
 *     resolving the tenant from the master DB and calling getOrInitTenantApp().
 *     These callers should be migrated to accept `db` as a parameter over time.
 *  2. Fallback: initialise a client SDK Firestore instance from the
 *     NEXT_PUBLIC_FIREBASE_* env vars already present in .env. This keeps the
 *     dev server working before the master DB infrastructure exists.
 *
 * This file is intentionally NOT marked "server-only" because publicContent.ts
 * is also imported by API routes that run in the Node.js runtime, not RSC.
 */

import { getOrInitTenantApp } from "./clientApp";
import type { Firestore } from "firebase/firestore";

let _db: Firestore | null = null;

/** True when a real projectId is available — false during `next build` in CI. */
export function isDbAvailable(): boolean {
  return !!(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "");
}

export function getDefaultDb(): Firestore {
  if (_db) return _db;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";

  if (!projectId) {
    // During `next build` in CI, Firebase env vars are intentionally absent.
    // Return a no-op stub so that service functions (which all have their own
    // try/catch) fail gracefully and static pages render with empty data
    // rather than crashing the build.
    // At runtime the real db comes from TenantFirebaseContext (client) or the
    // master DB lookup in layout.tsx (server) — getDefaultDb is never the
    // live path in production.
    return {} as Firestore;
  }

  const config = {
    apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? "",
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "",
    projectId,
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "",
  };

  _db = getOrInitTenantApp(config).db;
  return _db;
}
