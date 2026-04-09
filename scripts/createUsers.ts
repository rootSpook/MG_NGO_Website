/**
 * @deprecated — use scripts/bootstrap.ts instead.
 * This script is kept for reference only.
 *
 * Firebase User Seeding Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Prerequisites:
 *   1. Download your service account key from Firebase Console:
 *      Project Settings → Service Accounts → Generate New Private Key
 *   2. Save the downloaded file as `serviceAccountKey.json` in the project root
 *   3. Make sure serviceAccountKey.json is listed in .gitignore (it already is)
 *
 * Run with:
 *   npx tsx scripts/createUsers.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join } from "path";

const keyPath = join(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();
const db = getFirestore();

interface UserSeed {
  email: string;
  password: string;
  role: "admin" | "editor";
  displayName: string;
}

const users: UserSeed[] = [
  {
    email: "admin@mgfoundation.org",
    password: "Admin123!",
    role: "admin",
    displayName: "Admin",
  },
  {
    email: "editor@mgfoundation.org",
    password: "Editor123!",
    role: "editor",
    displayName: "Editor",
  },
];

async function createUser(user: UserSeed): Promise<void> {
  // Create Auth account (skip if it already exists)
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(user.email);
    uid = existing.uid;
    console.log(`[SKIP] Auth account already exists: ${user.email} (${uid})`);
  } catch {
    const record = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
    });
    uid = record.uid;
    console.log(`[CREATE] Auth account created: ${user.email} (${uid})`);
  }

  // Write staff document (upsert — safe to re-run)
  const docRef = db.collection("staff").doc(uid);
  const snapshot = await docRef.get();

  if (snapshot.exists) {
    console.log(`[SKIP] Firestore staff document already exists for: ${user.email}`);
    return;
  }

  await docRef.set({
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    isActive: true,
    lastLoginAt: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`[CREATE] Firestore staff document created: staff/${uid}`);
}

async function main(): Promise<void> {
  console.log("Starting user seed...\n");
  for (const user of users) {
    await createUser(user);
  }
  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
