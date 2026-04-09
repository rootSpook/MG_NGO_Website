/**
 * @deprecated — use scripts/bootstrap.ts instead.
 * This script is kept for reference only.
 *
 * Firestore Collection Seed Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Prerequisites:
 *   1. serviceAccountKey.json must exist in the project root
 *      (Firebase Console → Project Settings → Service Accounts → Generate New Private Key)
 *   2. Run scripts/createUsers.ts first so the admin uid exists in Firestore
 *
 * Run with:
 *   npx tsx scripts/seedCollections.ts
 *
 * The script is idempotent — existing documents are skipped, not overwritten.
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

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getAdminUid(): Promise<string> {
  const user = await auth.getUserByEmail("admin@mgfoundation.org");
  return user.uid;
}

async function upsertIfMissing(
  collection: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const ref = db.collection(collection).doc(docId);
  const snap = await ref.get();
  if (snap.exists) {
    console.log(`[SKIP]   ${collection}/${docId}`);
    return;
  }
  await ref.set(data);
  console.log(`[CREATE] ${collection}/${docId}`);
}

// ── Seed functions ────────────────────────────────────────────────────────────

async function seedSettings(): Promise<void> {
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

async function seedCategories(): Promise<void> {
  await upsertIfMissing("categories", "genel", {
    name: "Genel",
    slug: "genel",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function seedTags(): Promise<void> {
  await upsertIfMissing("tags", "mg", {
    name: "MG",
    slug: "mg",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function seedContentItems(adminUid: string): Promise<void> {
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
}

async function seedEvents(adminUid: string): Promise<void> {
  const adminRef = db.collection("staff").doc(adminUid);
  // startsAt: 30 days from now
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
  console.log("Fetching admin uid...");
  const adminUid = await getAdminUid();
  console.log(`Admin uid: ${adminUid}\n`);

  console.log("Seeding collections...\n");
  await seedSettings();
  await seedCategories();
  await seedTags();
  await seedContentItems(adminUid);
  await seedEvents(adminUid);

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
