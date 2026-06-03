/**
 * autoSeed.server.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Idempotent Firestore seeder that runs once on server startup via
 * instrumentation.ts. Uses the Firebase Admin SDK (serviceAccountKey.json).
 *
 * Logic per document:
 *   - If the document already exists → skip (never overwrite live data)
 *   - If the document is missing     → create it from seedData.ts
 *
 * This means adding a new item to seedData.ts will seed it on the next
 * server start without touching existing documents.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import {
  seedSettings,
  seedCategories,
  seedTags,
  seedPages,
  seedBlogPosts,
  seedReports,
  seedEvents,
  seedMediaAssets,
  seedCampaigns,
  seedAnnouncements,
} from "./seedData";

// ── Admin SDK init ────────────────────────────────────────────────────────────

function getAdminDb() {
  if (!getApps().length) {
    const keyPath = join(process.cwd(), "serviceAccountKey.json");
    if (!existsSync(keyPath)) {
      console.warn(
        "[autoSeed] serviceAccountKey.json not found — skipping seed."
      );
      return null;
    }
    const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

// ── Helper ────────────────────────────────────────────────────────────────────

async function upsertIfMissing(
  db: FirebaseFirestore.Firestore,
  col: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const ref = db.collection(col).doc(id);
  const snap = await ref.get();
  if (snap.exists) {
    console.log(`  [SKIP]   ${col}/${id}`);
    return;
  }
  await ref.set({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`  [CREATE] ${col}/${id}`);
}

// ── Seed functions ────────────────────────────────────────────────────────────

async function seedSettingsDoc(db: FirebaseFirestore.Firestore) {
  await upsertIfMissing(db, "settings", "site", seedSettings);
}

async function seedCategoriesDocs(db: FirebaseFirestore.Firestore) {
  for (const cat of seedCategories) {
    const { id, ...data } = cat;
    await upsertIfMissing(db, "categories", id, data);
  }
}

async function seedTagsDocs(db: FirebaseFirestore.Firestore) {
  for (const tag of seedTags) {
    const { id, ...data } = tag;
    await upsertIfMissing(db, "tags", id, data);
  }
}

async function seedContentItemsDocs(db: FirebaseFirestore.Firestore) {
  // Pages
  for (const page of seedPages) {
    const { id, publishedAt: _unused, ...rest } = page as typeof page & { publishedAt?: unknown };
    await upsertIfMissing(db, "contentItems", id, {
      ...rest,
      publishedAt: FieldValue.serverTimestamp(),
      archivedAt: null,
      deletedAt: null,
      authorName: null,
      pages: null,
      format: null,
      coverImageUrl: null,
      coverAssetRef: null,
      ogImageAssetRef: null,
      attachmentAssetRefs: [],
      tagRefs: [],
      tagIds: [],
      categoryRef: null,
      seoTitle: null,
      seoDescription: null,
      canonicalUrl: null,
      bodyHtml: null,
      sortOrder: null,
      createdBy: null,
      updatedBy: null,
    });
  }

  // Blog posts
  for (const post of seedBlogPosts) {
    const { id, publishedAt, coverImageUrl, ...rest } = post;
    await upsertIfMissing(db, "contentItems", id, {
      ...rest,
      coverImageUrl: coverImageUrl ?? null,
      publishedAt: publishedAt
        ? Timestamp.fromDate(new Date(publishedAt))
        : null,
      archivedAt: null,
      deletedAt: null,
      pages: null,
      format: null,
      pageData: null,
      coverAssetRef: null,
      ogImageAssetRef: null,
      attachmentAssetRefs: [],
      tagRefs: [],
      tagIds: [],
      categoryRef: null,
      seoTitle: null,
      seoDescription: null,
      canonicalUrl: null,
      bodyHtml: null,
      sortOrder: null,
      createdBy: null,
      updatedBy: null,
    });
  }

  // Reports
  for (const report of seedReports) {
    const { id, publishedAt, ...rest } = report;
    await upsertIfMissing(db, "contentItems", id, {
      ...rest,
      publishedAt: Timestamp.fromDate(new Date(publishedAt)),
      archivedAt: null,
      deletedAt: null,
      pageData: null,
      coverImageUrl: null,
      coverAssetRef: null,
      ogImageAssetRef: null,
      attachmentAssetRefs: [],
      tagRefs: [],
      tagIds: [],
      categoryRef: null,
      seoTitle: null,
      seoDescription: null,
      canonicalUrl: null,
      bodyHtml: null,
      sortOrder: null,
      authorName: null,
      featured: false,
      createdBy: null,
      updatedBy: null,
    });
  }
}

async function seedEventsDocs(db: FirebaseFirestore.Firestore) {
  for (const ev of seedEvents) {
    const { id, startsAt, endsAt, ...rest } = ev;
    await upsertIfMissing(db, "events", id, {
      ...rest,
      startsAt: Timestamp.fromDate(new Date(startsAt)),
      endsAt: endsAt ? Timestamp.fromDate(new Date(endsAt)) : null,
      description: null,
      locationAddress: null,
      coverAssetRef: null,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    });
  }
}

async function seedMediaAssetsDocs(db: FirebaseFirestore.Firestore) {
  for (const asset of seedMediaAssets) {
    const { id, ...data } = asset;
    await upsertIfMissing(db, "mediaAssets", id, {
      ...data,
      deletedAt: null,
      uploadedBy: null,
    });
  }
}

async function seedCampaignsDocs(db: FirebaseFirestore.Firestore) {
  for (const campaign of seedCampaigns) {
    const { id, ...data } = campaign;
    await upsertIfMissing(db, "campaigns", id, {
      ...data,
      createdBy: null,
      updatedBy: null,
      archivedAt: null,
    });
  }
}

async function seedAnnouncementsDocs(db: FirebaseFirestore.Firestore) {
  for (const ann of seedAnnouncements) {
    const { id, publishedAt, ...rest } = ann;
    await upsertIfMissing(db, "announcements", id, {
      ...rest,
      publishedAt: Timestamp.fromDate(new Date(publishedAt)),
    });
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function runAutoSeed(): Promise<void> {
  const db = getAdminDb();
  if (!db) return;

  console.log("\n[autoSeed] Starting Firestore seed check...\n");

  try {
    await seedSettingsDoc(db);
    await seedCategoriesDocs(db);
    await seedTagsDocs(db);
    await seedContentItemsDocs(db);
    await seedEventsDocs(db);
    await seedMediaAssetsDocs(db);
    await seedCampaignsDocs(db);
    await seedAnnouncementsDocs(db);

    console.log("\n[autoSeed] Seed check complete.\n");
  } catch (err) {
    console.error("[autoSeed] Error during seed:", err);
  }
}
