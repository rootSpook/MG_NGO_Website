/**
 * Firebase Admin SDK initializer for server-side use in Next.js.
 *
 * Credentials are resolved in this order:
 *   1. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY env vars  (production / CI)
 *   2. serviceAccountKey.json file in the project root         (local dev)
 *
 * If neither is available, returns null — callers must handle that gracefully.
 *
 * The default Admin app is shared with autoSeed.server.ts so we never
 * initialise more than one Admin app per process.
 */

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

function initAdminApp() {
  // Reuse if already initialised (e.g. by autoSeed.server.ts on startup)
  if (getApps().length > 0) {
    return true;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // 1. Env-var credentials (production)
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    return true;
  }

  // 2. serviceAccountKey.json fallback (local dev)
  const keyPath = join(process.cwd(), "serviceAccountKey.json");
  if (existsSync(keyPath)) {
    const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));
    initializeApp({ credential: cert(serviceAccount) });
    return true;
  }

  return false;
}

export function getAdminDb(): FirebaseFirestore.Firestore | null {
  const ok = initAdminApp();
  return ok ? getFirestore() : null;
}
