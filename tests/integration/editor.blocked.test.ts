import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import {
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { assertFails } from "@firebase/rules-unit-testing";
import { newEnv, EDITOR_UID, ADMIN_UID } from "./helpers/emulator";
import type { RulesTestEnvironment } from "@firebase/rules-unit-testing";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await newEnv();
});
afterAll(async () => {
  await env.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
  // Use compat API inside withSecurityRulesDisabled — ctx.firestore() is a v8 compat instance.
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await db.collection("staff").doc(EDITOR_UID).set({ role: "editor", isActive: true });
    await db.collection("staff").doc(ADMIN_UID).set({ role: "admin", isActive: true });
    await db.collection("donations").doc("seed-donation").set({ amount: 100, currency: "TRY" });
    await db.collection("auditLogs").doc("seed-log").set({ action: "seed" });
    await db.collection("mediaAssets").doc("seed-media").set({
      kind: "image", visibility: "public", deletedAt: null,
    });
  });
});

describe("editor blocked from admin-only operations", () => {
  it("cannot read donations", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(getDoc(doc(editorDb, "donations", "seed-donation")));
  });

  it("cannot write to donations", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(
      setDoc(doc(editorDb, "donations", "new-donation"), { amount: 50, currency: "TRY" })
    );
  });

  // auditLogs: editors CAN create (intentional — they generate audit entries),
  // but they CANNOT read them (admin-only read, per firestore.rules L220).
  it("cannot read auditLogs", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(getDoc(doc(editorDb, "auditLogs", "seed-log")));
  });

  it("cannot write to settings/site", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(
      setDoc(doc(editorDb, "settings", "site"), { ngoName: "hacked" })
    );
  });

  it("cannot delete a mediaAsset", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(deleteDoc(doc(editorDb, "mediaAssets", "seed-media")));
  });
});
