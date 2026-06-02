import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Hoisted mock refs ────────────────────────────────────────────────────────
// vi.hoisted() executes before module hoisting so these refs are always safe to
// reference inside vi.mock() factory functions.

const {
  addDocMock,
  getDocMock,
  getDocsMock,
  collectionMock,
  docMock,
  queryMock,
  whereMock,
  orderByMock,
  serverTimestampMock,
} = vi.hoisted(() => ({
  addDocMock: vi.fn(),
  getDocMock: vi.fn(),
  getDocsMock: vi.fn(),
  collectionMock: vi.fn((_db: unknown, name: string) => ({ __collection: name })),
  docMock: vi.fn((_db: unknown, col: string, id: string) => ({ __doc: `${col}/${id}` })),
  queryMock: vi.fn((...args: unknown[]) => ({ __query: args })),
  whereMock: vi.fn((...args: unknown[]) => ({ __where: args })),
  orderByMock: vi.fn((...args: unknown[]) => ({ __orderBy: args })),
  serverTimestampMock: vi.fn(() => ({ __sentinel: "server" })),
}));

vi.mock("firebase/firestore", () => ({
  addDoc: addDocMock,
  getDoc: getDocMock,
  getDocs: getDocsMock,
  collection: collectionMock,
  doc: docMock,
  query: queryMock,
  where: whereMock,
  orderBy: orderByMock,
  serverTimestamp: serverTimestampMock,
}));

// ─── Imports after mocks ──────────────────────────────────────────────────────

import {
  getSiteSettings,
  getPublishedContentByType,
  getContentBySlug,
  getPublishedEvents,
  getCategories,
  getTags,
  getPublicMediaAssets,
  getActiveCampaigns,
  getPublicIbanEntries,
  getPublicSupporters,
  submitVolunteerApplication,
  submitContactMessage,
} from "@/lib/firebase/services";
import type { Firestore } from "firebase/firestore";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const mockDb = {} as Firestore;

/** Build a minimal Firestore QuerySnapshot. */
function makeSnap(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    docs: docs.map((d) => ({ id: d.id, data: () => d.data })),
    size: docs.length,
    empty: docs.length === 0,
  };
}

const emptySnap = { docs: [], size: 0, empty: true };

// ─── beforeEach teardown ──────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  addDocMock.mockResolvedValue({ id: "doc-123" });
  getDocsMock.mockResolvedValue(emptySnap);
  getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
  // Restore default collection mock behaviour after clearAllMocks resets the impl.
  collectionMock.mockImplementation((_db: unknown, name: string) => ({ __collection: name }));
  serverTimestampMock.mockReturnValue({ __sentinel: "server" });
});

// ═════════════════════════════════════════════════════════════════════════════
// getSiteSettings
// ═════════════════════════════════════════════════════════════════════════════

describe("getSiteSettings", () => {
  it("returns null when the settings document does not exist", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });

    const result = await getSiteSettings(mockDb);

    expect(result).toBeNull();
  });

  it("returns the site settings data when the document exists", async () => {
    const settings = {
      ngoName: "Helping Hands",
      ngoLegalName: "Helping Hands Foundation",
      contactEmail: "info@hh.org",
    };
    getDocMock.mockResolvedValue({ exists: () => true, data: () => settings });

    const result = await getSiteSettings(mockDb);

    expect(result).toEqual(settings);
  });

  it("reads from settings/site document path", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });

    await getSiteSettings(mockDb);

    expect(docMock).toHaveBeenCalledWith(mockDb, "settings", "site");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getPublishedContentByType
// ═════════════════════════════════════════════════════════════════════════════

describe("getPublishedContentByType", () => {
  it("returns an empty array when no documents match", async () => {
    const result = await getPublishedContentByType(mockDb, "post");
    expect(result).toEqual([]);
  });

  it("returns documents with id injected via fromDoc", async () => {
    const snap = makeSnap([
      { id: "ci-1", data: { title: "First Post", type: "post", status: "published" } },
      { id: "ci-2", data: { title: "Second Post", type: "post", status: "published" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublishedContentByType(mockDb, "post");

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("ci-1");
    expect(result[0].title).toBe("First Post");
    expect(result[1].id).toBe("ci-2");
  });

  it("queries contentItems collection with correct filters", async () => {
    await getPublishedContentByType(mockDb, "news");

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "contentItems");
    expect(whereMock).toHaveBeenCalledWith("type", "==", "news");
    expect(whereMock).toHaveBeenCalledWith("status", "==", "published");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
    expect(orderByMock).toHaveBeenCalledWith("publishedAt", "desc");
  });

  it("works for every supported content type", async () => {
    const types = ["post", "news", "faq", "policy", "page"] as const;
    for (const type of types) {
      vi.clearAllMocks();
      getDocsMock.mockResolvedValue(emptySnap);
      await getPublishedContentByType(mockDb, type);
      expect(whereMock).toHaveBeenCalledWith("type", "==", type);
    }
  });

  it("preserves all document fields alongside the injected id", async () => {
    const data = {
      title: "Policy Doc",
      type: "policy",
      status: "published",
      excerpt: "Summary",
      featured: true,
    };
    const snap = makeSnap([{ id: "doc-99", data }]);
    getDocsMock.mockResolvedValue(snap);

    const [item] = await getPublishedContentByType(mockDb, "policy");

    expect(item.id).toBe("doc-99");
    expect(item.title).toBe("Policy Doc");
    expect(item.featured).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getContentBySlug
// ═════════════════════════════════════════════════════════════════════════════

describe("getContentBySlug", () => {
  it("returns null when no document matches the slug", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    const result = await getContentBySlug(mockDb, "missing-slug");

    expect(result).toBeNull();
  });

  it("returns the first matching document with id injected", async () => {
    const snap = makeSnap([
      { id: "page-1", data: { slug: "about-us", title: "About Us", type: "page" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getContentBySlug(mockDb, "about-us");

    expect(result).not.toBeNull();
    expect(result!.id).toBe("page-1");
    expect(result!.slug).toBe("about-us");
    expect(result!.title).toBe("About Us");
  });

  it("queries contentItems with slug, published status, and non-deleted filter", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await getContentBySlug(mockDb, "my-slug");

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "contentItems");
    expect(whereMock).toHaveBeenCalledWith("slug", "==", "my-slug");
    expect(whereMock).toHaveBeenCalledWith("status", "==", "published");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
  });

  it("returns only the first document when multiple match", async () => {
    const snap = makeSnap([
      { id: "first", data: { slug: "dup", title: "First" } },
      { id: "second", data: { slug: "dup", title: "Second" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getContentBySlug(mockDb, "dup");

    expect(result!.id).toBe("first");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getPublishedEvents
// ═════════════════════════════════════════════════════════════════════════════

describe("getPublishedEvents", () => {
  it("returns an empty array when no published events exist", async () => {
    expect(await getPublishedEvents(mockDb)).toEqual([]);
  });

  it("returns events with id injected", async () => {
    const snap = makeSnap([
      { id: "ev-1", data: { title: "Annual Conference", status: "published" } },
      { id: "ev-2", data: { title: "Workshop", status: "published" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublishedEvents(mockDb);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("ev-1");
    expect(result[0].title).toBe("Annual Conference");
  });

  it("queries events collection filtered by published status ordered by startsAt asc", async () => {
    await getPublishedEvents(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "events");
    expect(whereMock).toHaveBeenCalledWith("status", "==", "published");
    expect(orderByMock).toHaveBeenCalledWith("startsAt", "asc");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getCategories
// ═════════════════════════════════════════════════════════════════════════════

describe("getCategories", () => {
  it("returns an empty array when no categories exist", async () => {
    expect(await getCategories(mockDb)).toEqual([]);
  });

  it("returns categories with id injected", async () => {
    const snap = makeSnap([
      { id: "cat-1", data: { name: "Technology", slug: "technology" } },
      { id: "cat-2", data: { name: "Health", slug: "health" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getCategories(mockDb);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("cat-1");
    expect(result[0].name).toBe("Technology");
    expect(result[1].id).toBe("cat-2");
  });

  it("queries categories collection filtered by deletedAt==null", async () => {
    await getCategories(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "categories");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getTags
// ═════════════════════════════════════════════════════════════════════════════

describe("getTags", () => {
  it("returns an empty array when no tags exist", async () => {
    expect(await getTags(mockDb)).toEqual([]);
  });

  it("returns tags with id injected", async () => {
    const snap = makeSnap([
      { id: "tag-1", data: { name: "React", slug: "react" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getTags(mockDb);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("tag-1");
    expect(result[0].name).toBe("React");
    expect(result[0].slug).toBe("react");
  });

  it("queries tags collection filtered by deletedAt==null", async () => {
    await getTags(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "tags");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getPublicMediaAssets
// ═════════════════════════════════════════════════════════════════════════════

describe("getPublicMediaAssets", () => {
  it("returns an empty array when no public media assets exist", async () => {
    expect(await getPublicMediaAssets(mockDb)).toEqual([]);
  });

  it("returns media assets with id injected", async () => {
    const snap = makeSnap([
      {
        id: "asset-1",
        data: { originalFilename: "photo.jpg", visibility: "public", kind: "image" },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublicMediaAssets(mockDb);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("asset-1");
    expect(result[0].originalFilename).toBe("photo.jpg");
  });

  it("queries mediaAssets with visibility=public, deletedAt==null, ordered by createdAt desc", async () => {
    await getPublicMediaAssets(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "mediaAssets");
    expect(whereMock).toHaveBeenCalledWith("visibility", "==", "public");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
    expect(orderByMock).toHaveBeenCalledWith("createdAt", "desc");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getActiveCampaigns
// ═════════════════════════════════════════════════════════════════════════════

describe("getActiveCampaigns", () => {
  it("returns an empty array when no active campaigns exist", async () => {
    expect(await getActiveCampaigns(mockDb)).toEqual([]);
  });

  it("returns campaigns with id injected", async () => {
    const snap = makeSnap([
      { id: "camp-1", data: { title: "Spring Drive", status: "active", raisedAmount: 500 } },
      { id: "camp-2", data: { title: "Winter Aid", status: "active", raisedAmount: 1200 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getActiveCampaigns(mockDb);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("camp-1");
    expect(result[0].title).toBe("Spring Drive");
    expect(result[1].raisedAmount).toBe(1200);
  });

  it("queries campaigns with status=active and deletedAt==null", async () => {
    await getActiveCampaigns(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "campaigns");
    expect(whereMock).toHaveBeenCalledWith("status", "==", "active");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getPublicIbanEntries
// ═════════════════════════════════════════════════════════════════════════════

describe("getPublicIbanEntries", () => {
  it("returns an empty array when no IBAN entries exist", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getPublicIbanEntries(mockDb)).toEqual([]);
  });

  it("maps document fields to PublicIbanEntry shape", async () => {
    const snap = makeSnap([
      {
        id: "iban-1",
        data: {
          bankName: "Garanti BBVA",
          accountHolder: "My NGO",
          iban: "TR00 0000 0000 0000 0000 00",
          currency: "TRY",
          sortOrder: 1,
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublicIbanEntries(mockDb);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("iban-1");
    expect(result[0].bankName).toBe("Garanti BBVA");
    expect(result[0].accountHolder).toBe("My NGO");
    expect(result[0].iban).toBe("TR00 0000 0000 0000 0000 00");
    expect(result[0].currency).toBe("TRY");
    expect(result[0].sortOrder).toBe(1);
  });

  it("uses empty string defaults for missing string fields", async () => {
    const snap = makeSnap([{ id: "iban-1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [entry] = await getPublicIbanEntries(mockDb);

    expect(entry.bankName).toBe("");
    expect(entry.accountHolder).toBe("");
    expect(entry.iban).toBe("");
  });

  it("defaults currency to 'TRY' when missing", async () => {
    const snap = makeSnap([{ id: "iban-1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [entry] = await getPublicIbanEntries(mockDb);

    expect(entry.currency).toBe("TRY");
  });

  it("defaults sortOrder to 0 when missing", async () => {
    const snap = makeSnap([{ id: "iban-1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [entry] = await getPublicIbanEntries(mockDb);

    expect(entry.sortOrder).toBe(0);
  });

  it("sorts entries in ascending order by sortOrder", async () => {
    const snap = makeSnap([
      { id: "iban-3", data: { sortOrder: 3 } },
      { id: "iban-1", data: { sortOrder: 1 } },
      { id: "iban-2", data: { sortOrder: 2 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublicIbanEntries(mockDb);

    expect(result[0].id).toBe("iban-1");
    expect(result[1].id).toBe("iban-2");
    expect(result[2].id).toBe("iban-3");
  });

  it("reads from ibanEntries collection directly (no query filter)", async () => {
    await getPublicIbanEntries(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "ibanEntries");
    expect(queryMock).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getPublicSupporters
// ═════════════════════════════════════════════════════════════════════════════

describe("getPublicSupporters", () => {
  it("returns an empty array when no supporters exist", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getPublicSupporters(mockDb)).toEqual([]);
  });

  it("maps document fields to PublicSupporter shape", async () => {
    const snap = makeSnap([
      {
        id: "sup-1",
        data: {
          name: "ACME Corp",
          logoUrl: "https://acme.com/logo.png",
          websiteUrl: "https://acme.com",
          sortOrder: 2,
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublicSupporters(mockDb);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("sup-1");
    expect(result[0].name).toBe("ACME Corp");
    expect(result[0].logoUrl).toBe("https://acme.com/logo.png");
    expect(result[0].websiteUrl).toBe("https://acme.com");
    expect(result[0].sortOrder).toBe(2);
  });

  it("uses empty string defaults for missing string fields", async () => {
    const snap = makeSnap([{ id: "sup-1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [supporter] = await getPublicSupporters(mockDb);

    expect(supporter.name).toBe("");
    expect(supporter.logoUrl).toBe("");
    expect(supporter.websiteUrl).toBe("");
  });

  it("defaults sortOrder to 0 when missing", async () => {
    const snap = makeSnap([{ id: "sup-1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [supporter] = await getPublicSupporters(mockDb);

    expect(supporter.sortOrder).toBe(0);
  });

  it("sorts supporters in ascending order by sortOrder", async () => {
    const snap = makeSnap([
      { id: "sup-3", data: { sortOrder: 3 } },
      { id: "sup-1", data: { sortOrder: 1 } },
      { id: "sup-2", data: { sortOrder: 2 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPublicSupporters(mockDb);

    expect(result[0].id).toBe("sup-1");
    expect(result[1].id).toBe("sup-2");
    expect(result[2].id).toBe("sup-3");
  });

  it("reads from supporters collection directly (no query filter)", async () => {
    await getPublicSupporters(mockDb);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "supporters");
    expect(queryMock).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// submitVolunteerApplication
// ═════════════════════════════════════════════════════════════════════════════

describe("submitVolunteerApplication", () => {
  const baseInput = {
    fullName: "Ayşe Kaya",
    email: "ayse@example.com",
    motivation: "I want to help the community.",
  };

  it("writes to volunteerApplications collection", async () => {
    await submitVolunteerApplication(mockDb, baseInput);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "volunteerApplications");
  });

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "vol-55" });

    const id = await submitVolunteerApplication(mockDb, baseInput);

    expect(id).toBe("vol-55");
  });

  it("sets status to 'new'", async () => {
    await submitVolunteerApplication(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.status).toBe("new");
  });

  it("passes required fields through correctly", async () => {
    await submitVolunteerApplication(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.fullName).toBe("Ayşe Kaya");
    expect(payload.email).toBe("ayse@example.com");
    expect(payload.motivation).toBe("I want to help the community.");
  });

  it("defaults phone to null when omitted", async () => {
    await submitVolunteerApplication(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.phone).toBeNull();
  });

  it("keeps phone value when provided", async () => {
    await submitVolunteerApplication(mockDb, { ...baseInput, phone: "+90 555 111 22 33" });

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.phone).toBe("+90 555 111 22 33");
  });

  it("defaults city to null when omitted", async () => {
    await submitVolunteerApplication(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.city).toBeNull();
  });

  it("keeps city value when provided", async () => {
    await submitVolunteerApplication(mockDb, { ...baseInput, city: "Istanbul" });

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.city).toBe("Istanbul");
  });

  it("uses serverTimestamp for createdAt", async () => {
    await submitVolunteerApplication(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// submitContactMessage
// ═════════════════════════════════════════════════════════════════════════════

describe("submitContactMessage", () => {
  const baseInput = {
    senderName: "Ali Veli",
    senderEmail: "ali@example.com",
    subject: "Test Subject",
    messageBody: "Hello there, this is a test message.",
  };

  it("writes to contactMessages collection", async () => {
    await submitContactMessage(mockDb, baseInput);

    expect(collectionMock).toHaveBeenCalledWith(mockDb, "contactMessages");
  });

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "msg-77" });

    const id = await submitContactMessage(mockDb, baseInput);

    expect(id).toBe("msg-77");
  });

  it("sets status to 'new'", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.status).toBe("new");
  });

  it("passes all required string fields through correctly", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.senderName).toBe("Ali Veli");
    expect(payload.senderEmail).toBe("ali@example.com");
    expect(payload.subject).toBe("Test Subject");
    expect(payload.messageBody).toBe("Hello there, this is a test message.");
  });

  it("defaults senderPhone to null when omitted", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.senderPhone).toBeNull();
  });

  it("keeps senderPhone when provided", async () => {
    await submitContactMessage(mockDb, { ...baseInput, senderPhone: "+90 555 000 00 00" });

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.senderPhone).toBe("+90 555 000 00 00");
  });

  it("sets handledBy and handledAt to null", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.handledBy).toBeNull();
    expect(payload.handledAt).toBeNull();
  });

  it("sets internalNotes and ipAddress to null", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.internalNotes).toBeNull();
    expect(payload.ipAddress).toBeNull();
  });

  it("sets deletedAt to null", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
  });

  it("uses serverTimestamp for createdAt and updatedAt", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("sets userAgent from navigator when available (happy-dom provides one)", async () => {
    await submitContactMessage(mockDb, baseInput);

    const payload = addDocMock.mock.calls[0][1];
    // happy-dom environment exposes navigator.userAgent as a non-empty string
    expect(typeof payload.userAgent).toBe("string");
  });

  it("sets userAgent to null when navigator is not defined", async () => {
    // Temporarily remove navigator from the global scope to simulate a server env.
    const original = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", { value: undefined, configurable: true });

    await submitContactMessage(mockDb, baseInput);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.userAgent).toBeNull();

    Object.defineProperty(globalThis, "navigator", { value: original, configurable: true });
  });
});
