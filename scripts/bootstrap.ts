/**
 * Firebase Bootstrap Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Fully initializes a fresh Firebase project in one command.
 * Runs all setup steps in sequence:
 *   Step 1 — Create Auth accounts + staff Firestore documents
 *   Step 2 — Create settings/site document
 *   Step 3 — Seed starter collections (categories, tags, contentItems, events)
 *
 * Prerequisites:
 *   1. Download your service account key from Firebase Console:
 *      Project Settings → Service Accounts → Generate New Private Key
 *   2. Save the downloaded file as `serviceAccountKey.json` in the project root
 *
 * Run with:
 *   npx tsx scripts/bootstrap.ts
 *
 * The script is idempotent — safe to run multiple times on the same project.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join } from "path";

const keyPath = join(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const auth = getAuth();
const db = getFirestore();

// ── Shared helper ─────────────────────────────────────────────────────────────

async function upsertIfMissing(
  collection: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const ref = db.collection(collection).doc(docId);
  const snap = await ref.get();
  if (snap.exists) {
    console.log(`  [SKIP]   ${collection}/${docId}`);
    return;
  }
  await ref.set(data);
  console.log(`  [CREATE] ${collection}/${docId}`);
}

// ── Step 1: Staff accounts ────────────────────────────────────────────────────

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

async function createStaffAccount(user: UserSeed): Promise<string> {
  let uid: string;
  try {
    const existing = await auth.getUserByEmail(user.email);
    uid = existing.uid;
    console.log(`  [SKIP]   Auth account already exists: ${user.email} (${uid})`);
  } catch {
    const record = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
    });
    uid = record.uid;
    console.log(`  [CREATE] Auth account created: ${user.email} (${uid})`);
  }

  const docRef = db.collection("staff").doc(uid);
  const snapshot = await docRef.get();
  if (snapshot.exists) {
    console.log(`  [SKIP]   staff/${uid} already exists`);
  } else {
    await docRef.set({
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      isActive: true,
      lastLoginAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`  [CREATE] staff/${uid}`);
  }

  return uid;
}

async function stepCreateStaffAccounts(): Promise<string> {
  console.log("\n=== Step 1: Creating staff accounts ===\n");
  let adminUid = "";
  for (const user of users) {
    const uid = await createStaffAccount(user);
    if (user.role === "admin") adminUid = uid;
  }
  return adminUid;
}

// ── Step 2: Settings document ─────────────────────────────────────────────────

async function stepSeedSettings(): Promise<void> {
  console.log("\n=== Step 2: Creating settings/site document ===\n");
  await upsertIfMissing("settings", "site", {
    ngoName: "Miyastenia Gravis Vakfı",
    ngoLegalName: "Miyastenia Gravis Hastaları ve Yakınları Yardımlaşma Vakfı",
    websiteUrl: null,
    contactEmail: "info@mgfoundation.org",
    contactPhone: null,
    addressText: null,
    logoAssetRef: null,
    primaryColor: null,
    secondaryColor: null,
    defaultSeoTitle: "Miyastenia Gravis Vakfı",
    defaultSeoDescription:
      "Miyastenia Gravis hastalığı hakkında bilgi, etkinlikler ve destek",
    defaultOgImageAssetRef: null,
    donationProviders: [],
    donationRedirectUrls: {},
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

// ── Step 3: Starter collections ───────────────────────────────────────────────

async function stepSeedCollections(adminUid: string): Promise<void> {
  console.log("\n=== Step 3: Seeding starter collections ===\n");

  await upsertIfMissing("categories", "genel", {
    name: "Genel",
    slug: "genel",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await upsertIfMissing("tags", "mg", {
    name: "MG",
    slug: "mg",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const adminRef = db.collection("staff").doc(adminUid);

  await upsertIfMissing("contentItems", "anasayfa", {
    type: "page",
    status: "draft",
    title: "Anasayfa",
    slug: "anasayfa",
    bodyMarkdown: "",
    deletedAt: null,
    createdBy: adminRef,
    updatedBy: adminRef,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const startsAt = Timestamp.fromDate(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  await upsertIfMissing("events", "ornek-etkinlik", {
    title: "Örnek Etkinlik",
    slug: "ornek-etkinlik",
    status: "draft",
    startsAt,
    deletedAt: null,
    createdBy: adminRef,
    updatedBy: adminRef,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("Firebase Bootstrap");
  console.log("══════════════════");

  const adminUid = await stepCreateStaffAccounts();
  await stepSeedSettings();
  await stepSeedCollections(adminUid);

  console.log("\n══════════════════");
  console.log("Bootstrap complete.");
  console.log(
    "\nIMPORTANT: Change the default passwords before going to production."
  );
  console.log(
    "  Firebase Console → Authentication → Users"
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("\nBootstrap failed:", err);
  process.exit(1);
});
