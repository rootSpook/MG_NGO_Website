import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import {
  getDoc,
  getDocs,
  addDoc,
  doc,
  collection,
  query,
} from "firebase/firestore";
import { assertFails } from "@firebase/rules-unit-testing";
import { newEnv, EDITOR_UID } from "./helpers/emulator";
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
    await db.collection("volunteerApplications").doc("seed-app").set({
      fullName: "Test", email: "t@t.com", motivation: "test", status: "new",
    });
    await db.collection("contactMessages").doc("seed-msg").set({
      senderName: "Test", status: "new", deletedAt: null,
    });
    await db.collection("donations").doc("seed-don").set({ amount: 100 });
    await db.collection("auditLogs").doc("seed-log").set({ action: "seed" });
    // Draft content item for the "cannot read draft" test
    await db.collection("contentItems").doc("draft-1").set({
      type: "post", status: "draft", deletedAt: null, createdBy: EDITOR_UID,
    });
  });
});

describe("unauthenticated blocked from editor/admin collections", () => {
  it("cannot read staff documents", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "staff", EDITOR_UID)));
  });

  it("cannot read draft contentItems", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "contentItems", "draft-1")));
  });

  it("cannot create contentItems", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "contentItems"), {
        type: "post", status: "draft", deletedAt: null, createdBy: "nobody",
      })
    );
  });

  it("cannot read contactMessages list", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDocs(query(collection(db, "contactMessages"))));
  });

  it("cannot read donations", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "donations", "seed-don")));
  });

  it("cannot read auditLogs", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "auditLogs", "seed-log")));
  });

  it("cannot read volunteerApplications", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "volunteerApplications", "seed-app")));
  });

  it("cannot write to events", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "events"), { title: "hack", status: "published" })
    );
  });
});
