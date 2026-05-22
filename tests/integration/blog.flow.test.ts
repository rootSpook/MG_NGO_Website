import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
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
  });
});

const draftPayload = (editorUid: string) => ({
  type: "post",
  status: "draft",
  title: "Test Blog",
  slug: "test-blog",
  excerpt: "A test post",
  bodyMarkdown: "## Hello",
  bodyHtml: null,
  featured: false,
  deletedAt: null,
  publishedAt: null,
  createdBy: editorUid,
  updatedBy: editorUid,
  categoryId: null,
  tagIds: [],
});

describe("blog CRUD flow", () => {
  it("editor creates a draft blog with proper uid stamps", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    const ref = await assertSucceeds(
      addDoc(collection(editorDb, "contentItems"), draftPayload(EDITOR_UID))
    );
    expect(ref.id).toBeTruthy();
  });

  it("editor can publish a draft blog", async () => {
    let docId: string;
    // Seed with compat API to avoid _freezeSettings error.
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contentItems").add(draftPayload(EDITOR_UID));
      docId = ref.id;
    });
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertSucceeds(
      updateDoc(doc(editorDb, "contentItems", docId!), {
        status: "published",
        publishedAt: new Date(),
        updatedBy: EDITOR_UID,
      })
    );
  });

  it("unauthenticated visitor can read a published blog", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contentItems").add({
        ...draftPayload(EDITOR_UID),
        status: "published",
        publishedAt: new Date(),
      });
      docId = ref.id;
    });
    const unauth = env.unauthenticatedContext().firestore();
    const snap = await assertSucceeds(getDoc(doc(unauth, "contentItems", docId!)));
    expect(snap.data()?.status).toBe("published");
  });

  it("unauthenticated visitor cannot read a draft blog", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contentItems").add(draftPayload(EDITOR_UID));
      docId = ref.id;
    });
    const unauth = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(unauth, "contentItems", docId!)));
  });

  it("public query returns only published, non-deleted items", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      // published + not deleted → should appear
      await db.collection("contentItems").add({
        ...draftPayload(EDITOR_UID),
        status: "published",
        publishedAt: new Date(),
      });
      // draft → filtered by where clause
      await db.collection("contentItems").add(draftPayload(EDITOR_UID));
      // published + deleted → filtered by where clause
      await db.collection("contentItems").add({
        ...draftPayload(EDITOR_UID),
        status: "published",
        publishedAt: new Date(),
        deletedAt: new Date(),
      });
    });
    const unauth = env.unauthenticatedContext().firestore();
    const q = query(
      collection(unauth, "contentItems"),
      where("status", "==", "published"),
      where("deletedAt", "==", null)
    );
    const snap = await assertSucceeds(getDocs(q));
    expect(snap.docs).toHaveLength(1);
  });

  it("editor cannot impersonate another uid in createdBy", async () => {
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(
      addDoc(collection(editorDb, "contentItems"), draftPayload("someone-else-uid"))
    );
  });

  it("editor soft-deletes a blog; public no longer sees it in published query", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contentItems").add({
        ...draftPayload(EDITOR_UID),
        status: "published",
        publishedAt: new Date(),
      });
      docId = ref.id;
    });
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertSucceeds(
      updateDoc(doc(editorDb, "contentItems", docId!), {
        deletedAt: new Date(),
        updatedBy: EDITOR_UID,
      })
    );
    const unauth = env.unauthenticatedContext().firestore();
    const q = query(
      collection(unauth, "contentItems"),
      where("status", "==", "published"),
      where("deletedAt", "==", null)
    );
    const snap = await getDocs(q);
    expect(snap.docs).toHaveLength(0);
  });
});
