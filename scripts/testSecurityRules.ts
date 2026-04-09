/**
 * Firestore Security Rules Test Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests all Firestore Security Rules using the Firebase Local Emulator Suite.
 * The Admin SDK bypasses security rules entirely, so the emulator + client SDK
 * is the only way to test them accurately.
 *
 * Prerequisites:
 *   1. Install Java (required by the emulator)
 *   2. npx firebase emulators:start --only firestore
 *   3. (In a second terminal) npx tsx scripts/testSecurityRules.ts
 *
 * See docs/SECURITY_RULES_TEST.md for full setup instructions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { join } from "path";

// ── Constants ─────────────────────────────────────────────────────────────────

const PROJECT_ID = "ngo-mg-website-47a1a";
const ADMIN_UID = "test-admin-uid";
const EDITOR_UID = "test-editor-uid";
const STRANGER_UID = "test-stranger-uid"; // authenticated but not in staff

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(
  label: string,
  expectation: "pass" | "fail",
  fn: () => Promise<unknown>
): Promise<void> {
  try {
    if (expectation === "pass") {
      await assertSucceeds(fn());
    } else {
      await assertFails(fn());
    }
    console.log(`  ✅ PASS  ${label}`);
    passed++;
  } catch {
    console.log(`  ❌ FAIL  ${label}`);
    failed++;
    failures.push(label);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const rulesPath = join(process.cwd(), "firestore.rules");
  const rules = readFileSync(rulesPath, "utf-8");

  const testEnv: RulesTestEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8080,
    },
  });

  // ── Seed test data (bypass rules) ───────────────────────────────────────────
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();

    await setDoc(doc(db, "staff", ADMIN_UID), { role: "admin", isActive: true });
    await setDoc(doc(db, "staff", EDITOR_UID), { role: "editor", isActive: true });

    await setDoc(doc(db, "settings", "site"), {
      ngoName: "Test NGO",
      updatedAt: new Date(),
    });

    await setDoc(doc(db, "contentItems", "published-item"), {
      status: "published",
      deletedAt: null,
      type: "post",
      title: "Published Post",
    });

    await setDoc(doc(db, "contentItems", "draft-item"), {
      status: "draft",
      deletedAt: null,
      type: "post",
      title: "Draft Post",
    });

    await setDoc(doc(db, "categories", "test-category"), {
      name: "Test",
      slug: "test",
    });

    await setDoc(doc(db, "tags", "test-tag"), {
      name: "Test Tag",
      slug: "test-tag",
    });

    await setDoc(doc(db, "events", "published-event"), {
      status: "published",
      title: "Published Event",
    });

    await setDoc(doc(db, "events", "draft-event"), {
      status: "draft",
      title: "Draft Event",
    });

    await setDoc(doc(db, "mediaAssets", "public-asset"), {
      visibility: "public",
      deletedAt: null,
    });

    await setDoc(doc(db, "contactMessages", "test-message"), {
      senderName: "Test",
      senderEmail: "test@test.com",
      subject: "Test",
      messageBody: "Test body",
      status: "new",
    });

    await setDoc(doc(db, "donations", "test-donation"), {
      amount: 100,
      status: "succeeded",
    });

    await setDoc(doc(db, "auditLogs", "test-log"), {
      action: "test",
    });
  });

  const unauthed = testEnv.unauthenticatedContext();
  const admin = testEnv.authenticatedContext(ADMIN_UID);
  const editor = testEnv.authenticatedContext(EDITOR_UID);

  // ── Public visitor tests ────────────────────────────────────────────────────
  console.log("\n── Public visitor (unauthenticated) ────────────────────────────\n");

  await test("CAN read settings/site", "pass", () =>
    getDoc(doc(unauthed.firestore(), "settings", "site"))
  );

  await test("CAN read a published contentItem", "pass", () =>
    getDoc(doc(unauthed.firestore(), "contentItems", "published-item"))
  );

  await test("CAN read categories", "pass", () =>
    getDoc(doc(unauthed.firestore(), "categories", "test-category"))
  );

  await test("CAN read tags", "pass", () =>
    getDoc(doc(unauthed.firestore(), "tags", "test-tag"))
  );

  await test("CAN read a published event", "pass", () =>
    getDoc(doc(unauthed.firestore(), "events", "published-event"))
  );

  await test("CAN create a contactMessage with allowed fields only", "pass", () =>
    addDoc(collection(unauthed.firestore(), "contactMessages"), {
      senderName: "Visitor",
      senderEmail: "visitor@example.com",
      subject: "Hello",
      messageBody: "Test message",
    })
  );

  await test("CANNOT read staff collection", "fail", () =>
    getDoc(doc(unauthed.firestore(), "staff", ADMIN_UID))
  );

  await test("CANNOT read contactMessages", "fail", () =>
    getDocs(query(collection(unauthed.firestore(), "contactMessages")))
  );

  await test("CANNOT read a draft contentItem", "fail", () =>
    getDoc(doc(unauthed.firestore(), "contentItems", "draft-item"))
  );

  await test("CANNOT write to settings/site", "fail", () =>
    setDoc(doc(unauthed.firestore(), "settings", "site"), { ngoName: "Hacked" })
  );

  await test("CANNOT write to contentItems", "fail", () =>
    setDoc(doc(unauthed.firestore(), "contentItems", "malicious"), { title: "X" })
  );

  await test("CANNOT read donations", "fail", () =>
    getDoc(doc(unauthed.firestore(), "donations", "test-donation"))
  );

  await test("CANNOT read auditLogs", "fail", () =>
    getDoc(doc(unauthed.firestore(), "auditLogs", "test-log"))
  );

  await test("CANNOT create contactMessage with forbidden fields", "fail", () =>
    addDoc(collection(unauthed.firestore(), "contactMessages"), {
      senderName: "Visitor",
      senderEmail: "visitor@example.com",
      subject: "Hello",
      messageBody: "Test message",
      status: "resolved", // forbidden field
    })
  );

  // ── Editor tests ────────────────────────────────────────────────────────────
  console.log("\n── Editor ──────────────────────────────────────────────────────\n");

  await test("CAN read a draft contentItem", "pass", () =>
    getDoc(doc(editor.firestore(), "contentItems", "draft-item"))
  );

  await test("CAN create a contentItem (with own uid stamps)", "pass", () =>
    setDoc(doc(editor.firestore(), "contentItems", "editor-created"), {
      type: "post",
      status: "draft",
      title: "Editor Post",
      createdBy: EDITOR_UID,
      updatedBy: EDITOR_UID,
      deletedAt: null,
    })
  );

  await test("CAN update a contentItem (with own uid stamp)", "pass", () =>
    updateDoc(doc(editor.firestore(), "contentItems", "editor-created"), {
      title: "Updated Title",
      updatedBy: EDITOR_UID,
    })
  );

  await test("CAN read contactMessages", "pass", () =>
    getDoc(doc(editor.firestore(), "contactMessages", "test-message"))
  );

  await test("CAN update contactMessage workflow fields", "pass", () =>
    updateDoc(doc(editor.firestore(), "contactMessages", "test-message"), {
      status: "inProgress",
      handledAt: new Date(),
      handledBy: EDITOR_UID,
      internalNotes: "Following up",
    })
  );

  await test("CANNOT write to settings/site", "fail", () =>
    setDoc(doc(editor.firestore(), "settings", "site"), { ngoName: "Edited" })
  );

  await test("CANNOT write to staff documents", "fail", () =>
    setDoc(doc(editor.firestore(), "staff", EDITOR_UID), { role: "admin" })
  );

  await test("CANNOT delete a mediaAsset", "fail", () =>
    deleteDoc(doc(editor.firestore(), "mediaAssets", "public-asset"))
  );

  await test("CANNOT read donations", "fail", () =>
    getDoc(doc(editor.firestore(), "donations", "test-donation"))
  );

  await test("CANNOT create contentItem with another user's uid stamp", "fail", () =>
    setDoc(doc(editor.firestore(), "contentItems", "impersonated"), {
      type: "post",
      status: "draft",
      title: "Sneaky Post",
      createdBy: ADMIN_UID, // not editor's own uid
      updatedBy: ADMIN_UID,
    })
  );

  // ── Admin tests ─────────────────────────────────────────────────────────────
  console.log("\n── Admin ───────────────────────────────────────────────────────\n");

  await test("CAN read and write settings/site", "pass", () =>
    setDoc(doc(admin.firestore(), "settings", "site"), {
      ngoName: "Admin Updated NGO",
    })
  );

  await test("CAN read a draft contentItem", "pass", () =>
    getDoc(doc(admin.firestore(), "contentItems", "draft-item"))
  );

  await test("CAN write contentItems without uid restriction", "pass", () =>
    setDoc(doc(admin.firestore(), "contentItems", "admin-created"), {
      type: "page",
      status: "draft",
      title: "Admin Page",
      deletedAt: null,
    })
  );

  await test("CAN delete a contentItem", "pass", () =>
    deleteDoc(doc(admin.firestore(), "contentItems", "admin-created"))
  );

  await test("CAN read staff documents", "pass", () =>
    getDoc(doc(admin.firestore(), "staff", EDITOR_UID))
  );

  await test("CAN write staff documents", "pass", () =>
    updateDoc(doc(admin.firestore(), "staff", EDITOR_UID), {
      isActive: true,
    })
  );

  await test("CAN read contactMessages", "pass", () =>
    getDoc(doc(admin.firestore(), "contactMessages", "test-message"))
  );

  await test("CAN read donations", "pass", () =>
    getDoc(doc(admin.firestore(), "donations", "test-donation"))
  );

  await test("CAN read auditLogs", "pass", () =>
    getDoc(doc(admin.firestore(), "auditLogs", "test-log"))
  );

  await test("CAN delete a mediaAsset", "pass", () =>
    deleteDoc(doc(admin.firestore(), "mediaAssets", "public-asset"))
  );

  // ── Report ───────────────────────────────────────────────────────────────────
  console.log("\n════════════════════════════════════════════════════════════════");
  console.log(`  Results: ${passed} passed, ${failed} failed`);

  if (failures.length > 0) {
    console.log("\n  Failed tests:");
    failures.forEach((f) => console.log(`    ❌ ${f}`));
  }

  console.log("════════════════════════════════════════════════════════════════\n");

  await testEnv.cleanup();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Test runner error:", err.message ?? err);
  process.exit(1);
});
