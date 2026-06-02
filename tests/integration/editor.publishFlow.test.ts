import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { assertSucceeds } from "@firebase/rules-unit-testing";
import { newEnv, EDITOR_UID, ADMIN_UID } from "./helpers/emulator";
import type { RulesTestEnvironment } from "@firebase/rules-unit-testing";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await newEnv("publish-flow");
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
  });
});

type FirestoreDb = ReturnType<ReturnType<RulesTestEnvironment["unauthenticatedContext"]>["firestore"]>;

async function queryPublished(db: FirestoreDb) {
  return getDocs(
    query(
      collection(db, "contentItems"),
      where("status", "==", "published"),
      where("deletedAt", "==", null)
    )
  );
}

describe("end-to-end editor publish flow", () => {
  it("editor creates draft → admin publishes → public reads the post", async () => {
    // Step 1: Editor creates draft
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    const ref = await assertSucceeds(
      addDoc(collection(editorDb, "contentItems"), {
        type: "post",
        status: "draft",
        title: "E2E Test Post",
        slug: "e2e-test-post",
        excerpt: "Test",
        bodyMarkdown: "# Hello",
        bodyHtml: null,
        featured: false,
        deletedAt: null,
        publishedAt: null,
        createdBy: EDITOR_UID,
        updatedBy: EDITOR_UID,
        categoryId: null,
        tagIds: [],
      })
    );
    const docId = ref.id;

    // Step 2: Admin publishes
    const adminDb = env.authenticatedContext(ADMIN_UID).firestore();
    await assertSucceeds(
      updateDoc(doc(adminDb, "contentItems", docId), {
        status: "published",
        publishedAt: new Date(),
        updatedBy: ADMIN_UID,
      })
    );

    // Step 3: Public reads — should find the post
    const unauthDb = env.unauthenticatedContext().firestore();
    const snap = await assertSucceeds(queryPublished(unauthDb));
    expect(snap.docs).toHaveLength(1);
    expect(snap.docs[0].id).toBe(docId);
    expect(snap.docs[0].data().status).toBe("published");
  });

  it("editor creates → soft-deletes → post no longer visible to public", async () => {
    // Step 1: Seed a published post using compat API
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contentItems").add({
        type: "post",
        status: "published",
        title: "Soon Deleted",
        slug: "soon-deleted",
        excerpt: "",
        bodyMarkdown: "",
        bodyHtml: null,
        featured: false,
        deletedAt: null,
        publishedAt: new Date(),
        createdBy: EDITOR_UID,
        updatedBy: EDITOR_UID,
        categoryId: null,
        tagIds: [],
      });
      docId = ref.id;
    });

    // Step 2: Editor soft-deletes it
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertSucceeds(
      updateDoc(doc(editorDb, "contentItems", docId!), {
        deletedAt: new Date(),
        updatedBy: EDITOR_UID,
      })
    );

    // Step 3: Public no longer finds it
    const unauthDb = env.unauthenticatedContext().firestore();
    const snap = await assertSucceeds(queryPublished(unauthDb));
    expect(snap.docs).toHaveLength(0);
  });
});
