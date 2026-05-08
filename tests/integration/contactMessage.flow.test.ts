import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
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
    await ctx.firestore()
      .collection("staff")
      .doc(EDITOR_UID)
      .set({ role: "editor", isActive: true, email: "editor@test.com" });
  });
});

describe("contactMessage flow", () => {
  const validPayload = {
    senderName: "Ziyaretçi",
    senderEmail: "visitor@test.com",
    subject: "Soru",
    messageBody: "Bu bir test mesajıdır.",
    status: "new",
    handledBy: null,
    handledAt: null,
    internalNotes: null,
    ipAddress: null,
    userAgent: null,
    deletedAt: null,
  };

  it("unauthenticated visitor can create a contactMessage with allowed fields", async () => {
    const db = env.unauthenticatedContext().firestore();
    const ref = await assertSucceeds(addDoc(collection(db, "contactMessages"), validPayload));
    expect(ref.id).toBeTruthy();
  });

  it("unauthenticated visitor cannot read its own message back", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contactMessages").add(validPayload);
      docId = ref.id;
    });
    const db = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "contactMessages", docId!)));
  });

  it("editor can read a contactMessage written by a visitor", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contactMessages").add(validPayload);
      docId = ref.id;
    });
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    const snap = await assertSucceeds(getDoc(doc(editorDb, "contactMessages", docId!)));
    expect(snap.exists()).toBe(true);
  });

  it("unauthenticated cannot create a message with a non-new status", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "contactMessages"), { ...validPayload, status: "resolved" })
    );
  });

  it("editor can transition status to inProgress", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contactMessages").add(validPayload);
      docId = ref.id;
    });
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertSucceeds(
      updateDoc(doc(editorDb, "contactMessages", docId!), {
        status: "inProgress",
        handledBy: EDITOR_UID,
      })
    );
  });

  it("unauthenticated visitor cannot update a message", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contactMessages").add(validPayload);
      docId = ref.id;
    });
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      updateDoc(doc(db, "contactMessages", docId!), {
        status: "inProgress",
      })
    );
  });

  it("editor cannot update immutable fields (messageBody, senderEmail)", async () => {
    let docId: string;
    await env.withSecurityRulesDisabled(async (ctx) => {
      const ref = await ctx.firestore().collection("contactMessages").add(validPayload);
      docId = ref.id;
    });
    const editorDb = env.authenticatedContext(EDITOR_UID).firestore();
    await assertFails(
      updateDoc(doc(editorDb, "contactMessages", docId!), {
        messageBody: "I modified caller's original message!",
      })
    );
  });

  it("unauthenticated visitor fails if sending unallowed keys", async () => {
    const db = env.unauthenticatedContext().firestore();
    await assertFails(
      addDoc(collection(db, "contactMessages"), { ...validPayload, unexpectedKey: "hacker" })
    );
  });
});
