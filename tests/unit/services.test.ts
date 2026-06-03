import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted() runs before module hoisting so these refs are safe to use in vi.mock().
const { addDocMock, collectionMock, serverTimestampMock } = vi.hoisted(() => ({
  addDocMock: vi.fn(),
  collectionMock: vi.fn((_db: unknown, name: string) => ({ __collection: name })),
  serverTimestampMock: vi.fn(() => ({ __sentinel: "server" })),
}));

vi.mock("firebase/firestore", () => ({
  addDoc: addDocMock,
  collection: collectionMock,
  serverTimestamp: serverTimestampMock,
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  updateDoc: vi.fn(),
}));

import { submitContactMessage, submitVolunteerApplication } from "@/lib/firebase/services";

beforeEach(() => {
  addDocMock.mockReset();
  addDocMock.mockResolvedValue({ id: "doc-123" });
  collectionMock.mockClear();
  serverTimestampMock.mockClear();
});

// ── submitContactMessage ──────────────────────────────────────────────────────

describe("submitContactMessage", () => {
  const input = {
    senderName: "Ali Veli",
    senderEmail: "ali@example.com",
    subject: "Test",
    messageBody: "Hello there, this is a test message.",
  };

  it("writes to contactMessages collection", async () => {
    await submitContactMessage(input);
    expect(collectionMock).toHaveBeenCalledWith(
      expect.anything(),
      "contactMessages"
    );
  });

  it("returns the new doc id", async () => {
    const id = await submitContactMessage(input);
    expect(id).toBe("doc-123");
  });

  it("sets status to 'new'", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.status).toBe("new");
  });

  it("sets handledBy and handledAt to null", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.handledBy).toBeNull();
    expect(payload.handledAt).toBeNull();
  });

  it("sets deletedAt to null", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
  });

  it("passes senderName, senderEmail, subject, messageBody through", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.senderName).toBe("Ali Veli");
    expect(payload.senderEmail).toBe("ali@example.com");
    expect(payload.subject).toBe("Test");
    expect(payload.messageBody).toBe("Hello there, this is a test message.");
  });

  it("defaults senderPhone to null when omitted", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.senderPhone).toBeNull();
  });

  it("keeps senderPhone string when provided", async () => {
    await submitContactMessage({ ...input, senderPhone: "+90 555 000 00 00" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.senderPhone).toBe("+90 555 000 00 00");
  });

  it("uses serverTimestamp for createdAt and updatedAt", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("sets userAgent from navigator (happy-dom provides one)", async () => {
    await submitContactMessage(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(typeof payload.userAgent).toBe("string");
  });
});

// ── submitVolunteerApplication ────────────────────────────────────────────────

describe("submitVolunteerApplication", () => {
  const input = {
    fullName: "Ayşe Kaya",
    email: "ayse@example.com",
    motivation: "I want to help the community.",
  };

  it("writes to volunteerApplications collection", async () => {
    await submitVolunteerApplication(input);
    expect(collectionMock).toHaveBeenCalledWith(
      expect.anything(),
      "volunteerApplications"
    );
  });

  it("returns the new doc id", async () => {
    const id = await submitVolunteerApplication(input);
    expect(id).toBe("doc-123");
  });

  it("sets status to 'new'", async () => {
    await submitVolunteerApplication(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.status).toBe("new");
  });

  it("defaults phone and city to null when omitted", async () => {
    await submitVolunteerApplication(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.phone).toBeNull();
    expect(payload.city).toBeNull();
  });

  it("passes fullName, email, motivation through", async () => {
    await submitVolunteerApplication(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.fullName).toBe("Ayşe Kaya");
    expect(payload.email).toBe("ayse@example.com");
    expect(payload.motivation).toBe("I want to help the community.");
  });

  it("uses serverTimestamp for createdAt", async () => {
    await submitVolunteerApplication(input);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdAt).toEqual({ __sentinel: "server" });
  });
});
