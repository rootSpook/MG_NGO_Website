import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

// ─── Hoisted mock refs (must be declared before any vi.mock() calls) ──────────

const {
  addDocMock,
  getDocMock,
  getDocsMock,
  updateDocMock,
  setDocMock,
  deleteDocMock,
  collectionMock,
  docMock,
  queryMock,
  whereMock,
  serverTimestampMock,
} = vi.hoisted(() => ({
  addDocMock: vi.fn(),
  getDocMock: vi.fn(),
  getDocsMock: vi.fn(),
  updateDocMock: vi.fn(),
  setDocMock: vi.fn(),
  deleteDocMock: vi.fn(),
  collectionMock: vi.fn((_db: unknown, name: string) => ({ __collection: name })),
  docMock: vi.fn((_db: unknown, col: string, id: string) => ({ __doc: `${col}/${id}` })),
  queryMock: vi.fn((...args: unknown[]) => ({ __query: args })),
  whereMock: vi.fn((...args: unknown[]) => ({ __where: args })),
  serverTimestampMock: vi.fn(() => ({ __sentinel: "server" })),
}));

// Dynamic import inside deleteBoardMember / deleteSupporter / deleteIbanEntry
// — we need deleteDoc from the same mocked module.
vi.mock("firebase/firestore", () => ({
  addDoc: addDocMock,
  getDoc: getDocMock,
  getDocs: getDocsMock,
  updateDoc: updateDocMock,
  setDoc: setDocMock,
  deleteDoc: deleteDocMock,
  collection: collectionMock,
  doc: docMock,
  query: queryMock,
  where: whereMock,
  serverTimestamp: serverTimestampMock,
}));

// ─── Imported after mocks are wired ──────────────────────────────────────────

import {
  getAdminDashboardStats,
  getBoardMembers,
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
  getSupporters,
  createSupporter,
  updateSupporter,
  deleteSupporter,
  getIbanEntries,
  createIbanEntry,
  updateIbanEntry,
  deleteIbanEntry,
  getAdminReports,
  createAdminReport,
  updateAdminReport,
  deleteAdminReport,
  getAdminPageBySlug,
  getAdminPageDataBySlug,
  getAdminPages,
  upsertAdminPage,
  getAdminSiteSettings,
  updateAdminSiteSettings,
  getContactMessages,
  updateContactMessageStatus,
  getPageBlocks,
  savePageBlocks,
  upsertPageContent,
  updateStaffPhotoURL,
  getStaffMember,
} from "@/lib/firebase/adminServices";
import type { PageBlockData } from "@/types/pageBuilder";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const mockDb = {} as Firestore;

function makeAuth(uid: string | null = "user-1"): Auth {
  return {
    currentUser: uid ? { uid } : null,
  } as unknown as Auth;
}

const services = { db: mockDb, auth: makeAuth("user-1") };
const anonServices = { db: mockDb, auth: makeAuth(null) };

/** Build a minimal Firestore QuerySnapshot-like object. */
function makeSnap(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  const docObjects = docs.map((d) => ({
    id: d.id,
    data: () => d.data,
    exists: () => true,
  }));
  return {
    docs: docObjects,
    size: docObjects.length,
    empty: docObjects.length === 0,
  };
}

/** Build an empty QuerySnapshot. */
const emptySnap = { docs: [], size: 0, empty: true };

// ─── beforeEach teardown ──────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  // Sensible defaults — individual tests override as needed.
  addDocMock.mockResolvedValue({ id: "new-doc-id" });
  updateDocMock.mockResolvedValue(undefined);
  setDocMock.mockResolvedValue(undefined);
  deleteDocMock.mockResolvedValue(undefined);
  getDocsMock.mockResolvedValue(emptySnap);
  getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAdminDashboardStats
// ═════════════════════════════════════════════════════════════════════════════

describe("getAdminDashboardStats", () => {
  it("returns zero counts when all queries return empty snapshots", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    const stats = await getAdminDashboardStats(services);

    expect(stats.totalBlogs).toBe(0);
    expect(stats.publishedBlogs).toBe(0);
    expect(stats.totalEvents).toBe(0);
    expect(stats.totalAnnouncements).toBe(0);
    expect(stats.pendingMessages).toBe(0);
    expect(stats.pendingVolunteers).toBe(0);
  });

  it("counts all blogs and published blogs correctly", async () => {
    const blogsSnap = makeSnap([
      { id: "b1", data: { status: "published" } },
      { id: "b2", data: { status: "draft" } },
      { id: "b3", data: { status: "published" } },
    ]);
    const countSnap = (size: number) => ({ docs: Array(size).fill({ id: "x", data: () => ({}) }), size, empty: size === 0 });

    getDocsMock
      .mockResolvedValueOnce(blogsSnap)      // safeDocs → blogsSnap
      .mockResolvedValueOnce(countSnap(4))   // safeCount → totalEvents
      .mockResolvedValueOnce(countSnap(2))   // safeCount → totalAnnouncements
      .mockResolvedValueOnce(countSnap(7))   // safeCount → pendingMessages
      .mockResolvedValueOnce(countSnap(3));  // safeCount → pendingVolunteers

    const stats = await getAdminDashboardStats(services);

    expect(stats.totalBlogs).toBe(3);
    expect(stats.publishedBlogs).toBe(2);
    expect(stats.totalEvents).toBe(4);
    expect(stats.totalAnnouncements).toBe(2);
    expect(stats.pendingMessages).toBe(7);
    expect(stats.pendingVolunteers).toBe(3);
  });

  it("returns 0 for counts when getDocs rejects (safeCount catch path)", async () => {
    getDocsMock.mockRejectedValue(new Error("Firestore error"));

    const stats = await getAdminDashboardStats(services);

    expect(stats.totalBlogs).toBe(0);
    expect(stats.publishedBlogs).toBe(0);
    expect(stats.totalEvents).toBe(0);
  });

  it("handles blogsSnap being null (safeDocs catch path)", async () => {
    // safeDocs returns null on error; safeCount returns 0 on error
    getDocsMock.mockRejectedValue(new Error("network"));

    const stats = await getAdminDashboardStats(services);

    expect(stats.totalBlogs).toBe(0);
    expect(stats.publishedBlogs).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getBoardMembers
// ═════════════════════════════════════════════════════════════════════════════

describe("getBoardMembers", () => {
  it("returns an empty array when collection is empty", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    const result = await getBoardMembers(services);
    expect(result).toEqual([]);
  });

  it("maps and sorts board members by sortOrder", async () => {
    const snap = makeSnap([
      { id: "m2", data: { name: "B", title: "VP", bio: "bio2", photoUrl: "p2", sortOrder: 2 } },
      { id: "m1", data: { name: "A", title: "CEO", bio: "bio1", photoUrl: "p1", sortOrder: 1 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getBoardMembers(services);

    expect(result[0].id).toBe("m1");
    expect(result[1].id).toBe("m2");
    expect(result[0].name).toBe("A");
  });

  it("uses empty string defaults for missing fields", async () => {
    const snap = makeSnap([{ id: "m1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [member] = await getBoardMembers(services);

    expect(member.name).toBe("");
    expect(member.title).toBe("");
    expect(member.bio).toBe("");
    expect(member.photoUrl).toBe("");
    expect(member.sortOrder).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// createBoardMember
// ═════════════════════════════════════════════════════════════════════════════

describe("createBoardMember", () => {
  const member = { name: "Alice", title: "Director", bio: "Bio", photoUrl: "url", sortOrder: 1 };

  it("returns new document id", async () => {
    addDocMock.mockResolvedValue({ id: "board-42" });
    const id = await createBoardMember(services, member);
    expect(id).toBe("board-42");
  });

  it("writes to boardMembers collection", async () => {
    await createBoardMember(services, member);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "boardMembers");
  });

  it("includes createdBy / updatedBy as the current user uid", async () => {
    await createBoardMember(services, member);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBe("user-1");
    expect(payload.updatedBy).toBe("user-1");
  });

  it("sets createdBy / updatedBy to null when no authenticated user", async () => {
    await createBoardMember(anonServices, member);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
    expect(payload.updatedBy).toBeNull();
  });

  it("uses serverTimestamp for createdAt and updatedAt", async () => {
    await createBoardMember(services, member);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateBoardMember
// ═════════════════════════════════════════════════════════════════════════════

describe("updateBoardMember", () => {
  it("calls updateDoc on the correct document reference", async () => {
    await updateBoardMember(services, "m-1", { name: "Updated" });
    expect(docMock).toHaveBeenCalledWith(mockDb, "boardMembers", "m-1");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
  });

  it("merges the data fields and updatedBy / updatedAt", async () => {
    await updateBoardMember(services, "m-1", { title: "CTO" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("CTO");
    expect(payload.updatedBy).toBe("user-1");
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("sets updatedBy to null when no authenticated user", async () => {
    await updateBoardMember(anonServices, "m-1", { name: "X" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// deleteBoardMember
// ═════════════════════════════════════════════════════════════════════════════

describe("deleteBoardMember", () => {
  it("calls deleteDoc on the correct document reference", async () => {
    await deleteBoardMember(services, "m-99");
    expect(docMock).toHaveBeenCalledWith(mockDb, "boardMembers", "m-99");
    expect(deleteDocMock).toHaveBeenCalledTimes(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getSupporters
// ═════════════════════════════════════════════════════════════════════════════

describe("getSupporters", () => {
  it("returns empty array when no documents exist", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getSupporters(services)).toEqual([]);
  });

  it("maps and sorts supporters by sortOrder", async () => {
    const snap = makeSnap([
      { id: "s2", data: { name: "B", logoUrl: "l2", websiteUrl: "w2", sortOrder: 2 } },
      { id: "s1", data: { name: "A", logoUrl: "l1", websiteUrl: "w1", sortOrder: 1 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getSupporters(services);
    expect(result[0].id).toBe("s1");
    expect(result[1].id).toBe("s2");
  });

  it("fills missing fields with empty string / 0", async () => {
    const snap = makeSnap([{ id: "s1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [s] = await getSupporters(services);
    expect(s.name).toBe("");
    expect(s.logoUrl).toBe("");
    expect(s.websiteUrl).toBe("");
    expect(s.sortOrder).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// createSupporter
// ═════════════════════════════════════════════════════════════════════════════

describe("createSupporter", () => {
  const supporter = { name: "ACME", logoUrl: "logo.png", websiteUrl: "https://acme.com", sortOrder: 0 };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "sup-7" });
    expect(await createSupporter(services, supporter)).toBe("sup-7");
  });

  it("writes to supporters collection", async () => {
    await createSupporter(services, supporter);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "supporters");
  });

  it("sets createdBy / updatedBy to uid", async () => {
    await createSupporter(services, supporter);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBe("user-1");
    expect(payload.updatedBy).toBe("user-1");
  });

  it("sets createdBy / updatedBy to null when unauthenticated", async () => {
    await createSupporter(anonServices, supporter);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateSupporter
// ═════════════════════════════════════════════════════════════════════════════

describe("updateSupporter", () => {
  it("calls updateDoc on supporters/<id>", async () => {
    await updateSupporter(services, "s-1", { name: "New Name" });
    expect(docMock).toHaveBeenCalledWith(mockDb, "supporters", "s-1");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
  });

  it("merges data with updatedBy and updatedAt", async () => {
    await updateSupporter(services, "s-1", { logoUrl: "new-logo.png" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.logoUrl).toBe("new-logo.png");
    expect(payload.updatedBy).toBe("user-1");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// deleteSupporter
// ═════════════════════════════════════════════════════════════════════════════

describe("deleteSupporter", () => {
  it("calls deleteDoc on supporters/<id>", async () => {
    await deleteSupporter(services, "s-42");
    expect(docMock).toHaveBeenCalledWith(mockDb, "supporters", "s-42");
    expect(deleteDocMock).toHaveBeenCalledTimes(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getIbanEntries
// ═════════════════════════════════════════════════════════════════════════════

describe("getIbanEntries", () => {
  it("returns empty array for empty collection", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getIbanEntries(services)).toEqual([]);
  });

  it("maps and sorts IBAN entries by sortOrder", async () => {
    const snap = makeSnap([
      { id: "i2", data: { bankName: "B", accountHolder: "H2", iban: "TR2", currency: "USD", sortOrder: 2 } },
      { id: "i1", data: { bankName: "A", accountHolder: "H1", iban: "TR1", currency: "TRY", sortOrder: 1 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getIbanEntries(services);
    expect(result[0].id).toBe("i1");
    expect(result[1].id).toBe("i2");
  });

  it("defaults currency to 'TRY' when missing", async () => {
    const snap = makeSnap([{ id: "i1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [entry] = await getIbanEntries(services);
    expect(entry.currency).toBe("TRY");
    expect(entry.bankName).toBe("");
    expect(entry.accountHolder).toBe("");
    expect(entry.iban).toBe("");
    expect(entry.sortOrder).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// createIbanEntry
// ═════════════════════════════════════════════════════════════════════════════

describe("createIbanEntry", () => {
  const entry = { bankName: "Garanti", accountHolder: "NGO", iban: "TR00", currency: "TRY", sortOrder: 0 };

  it("returns new document id", async () => {
    addDocMock.mockResolvedValue({ id: "iban-3" });
    expect(await createIbanEntry(services, entry)).toBe("iban-3");
  });

  it("writes to ibanEntries collection", async () => {
    await createIbanEntry(services, entry);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "ibanEntries");
  });

  it("sets createdBy to null when unauthenticated", async () => {
    await createIbanEntry(anonServices, entry);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateIbanEntry
// ═════════════════════════════════════════════════════════════════════════════

describe("updateIbanEntry", () => {
  it("calls updateDoc on ibanEntries/<id>", async () => {
    await updateIbanEntry(services, "i-5", { iban: "TR99" });
    expect(docMock).toHaveBeenCalledWith(mockDb, "ibanEntries", "i-5");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
  });

  it("includes updatedBy uid in the payload", async () => {
    await updateIbanEntry(services, "i-5", { bankName: "Yapı Kredi" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.bankName).toBe("Yapı Kredi");
    expect(payload.updatedBy).toBe("user-1");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// deleteIbanEntry
// ═════════════════════════════════════════════════════════════════════════════

describe("deleteIbanEntry", () => {
  it("calls deleteDoc on ibanEntries/<id>", async () => {
    await deleteIbanEntry(services, "i-99");
    expect(docMock).toHaveBeenCalledWith(mockDb, "ibanEntries", "i-99");
    expect(deleteDocMock).toHaveBeenCalledTimes(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAdminReports
// ═════════════════════════════════════════════════════════════════════════════

describe("getAdminReports", () => {
  it("returns empty array when no reports exist", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getAdminReports(services)).toEqual([]);
  });

  it("maps report documents to AdminReport shape", async () => {
    const snap = makeSnap([
      {
        id: "r1",
        data: {
          title: "Annual Report 2023",
          excerpt: "Summary",
          year: "2023",
          categoryId: "cat-1",
          coverImageUrl: "file.pdf",
          featured: true,
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [report] = await getAdminReports(services);
    expect(report.id).toBe("r1");
    expect(report.title).toBe("Annual Report 2023");
    expect(report.excerpt).toBe("Summary");
    expect(report.year).toBe("2023");
    expect(report.category).toBe("cat-1");
    expect(report.fileUrl).toBe("file.pdf");
    expect(report.featured).toBe(true);
  });

  it("uses empty string / false defaults for missing report fields", async () => {
    const snap = makeSnap([{ id: "r1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [report] = await getAdminReports(services);
    expect(report.title).toBe("");
    expect(report.excerpt).toBe("");
    expect(report.year).toBe("");
    expect(report.category).toBe("");
    expect(report.fileUrl).toBe("");
    expect(report.featured).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// createAdminReport
// ═════════════════════════════════════════════════════════════════════════════

describe("createAdminReport", () => {
  const report = {
    title: "Policy Report 2024",
    excerpt: "An excerpt",
    year: "2024",
    category: "policy",
    fileUrl: "report.pdf",
    featured: false,
  };

  it("returns new document id", async () => {
    addDocMock.mockResolvedValue({ id: "rep-1" });
    expect(await createAdminReport(services, report)).toBe("rep-1");
  });

  it("writes to contentItems collection", async () => {
    await createAdminReport(services, report);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "contentItems");
  });

  it("sets type='policy' and status='published'", async () => {
    await createAdminReport(services, report);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.type).toBe("policy");
    expect(payload.status).toBe("published");
  });

  it("generates a slug from the title (lowercase, hyphenated)", async () => {
    await createAdminReport(services, { ...report, title: "My Report Title!" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("my-report-title-");
  });

  it("truncates slug to 80 characters", async () => {
    const longTitle = "A".repeat(100);
    await createAdminReport(services, { ...report, title: longTitle });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug.length).toBeLessThanOrEqual(80);
  });

  it("maps category → categoryId and fileUrl → coverImageUrl", async () => {
    await createAdminReport(services, report);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.categoryId).toBe("policy");
    expect(payload.coverImageUrl).toBe("report.pdf");
  });

  it("sets createdBy to null when unauthenticated", async () => {
    await createAdminReport(anonServices, report);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });

  it("sets deletedAt and archivedAt to null", async () => {
    await createAdminReport(services, report);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
    expect(payload.archivedAt).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateAdminReport
// ═════════════════════════════════════════════════════════════════════════════

describe("updateAdminReport", () => {
  it("calls updateDoc on contentItems/<id>", async () => {
    await updateAdminReport(services, "r-1", { title: "Updated" });
    expect(docMock).toHaveBeenCalledWith(mockDb, "contentItems", "r-1");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
  });

  it("only includes defined fields (partial update)", async () => {
    await updateAdminReport(services, "r-1", { title: "New Title" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("New Title");
    expect("excerpt" in payload).toBe(false);
    expect("year" in payload).toBe(false);
  });

  it("maps category → categoryId when provided", async () => {
    await updateAdminReport(services, "r-1", { category: "human-rights" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.categoryId).toBe("human-rights");
    expect("category" in payload).toBe(false);
  });

  it("maps fileUrl → coverImageUrl when provided", async () => {
    await updateAdminReport(services, "r-1", { fileUrl: "new.pdf" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.coverImageUrl).toBe("new.pdf");
  });

  it("includes updatedBy and updatedAt always", async () => {
    await updateAdminReport(services, "r-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBe("user-1");
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("handles all optional fields together", async () => {
    await updateAdminReport(services, "r-1", {
      title: "T",
      excerpt: "E",
      year: "2025",
      category: "cat",
      fileUrl: "f.pdf",
      featured: true,
    });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("T");
    expect(payload.excerpt).toBe("E");
    expect(payload.year).toBe("2025");
    expect(payload.categoryId).toBe("cat");
    expect(payload.coverImageUrl).toBe("f.pdf");
    expect(payload.featured).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// deleteAdminReport (soft delete via updatedAt/deletedAt)
// ═════════════════════════════════════════════════════════════════════════════

describe("deleteAdminReport", () => {
  it("sets deletedAt and updatedAt on the document (soft delete)", async () => {
    await deleteAdminReport(services, "r-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "contentItems", "r-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAdminPageBySlug
// ═════════════════════════════════════════════════════════════════════════════

describe("getAdminPageBySlug", () => {
  it("returns null when no page found", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getAdminPageBySlug(services, "about")).toBeNull();
  });

  it("returns the page when found with a Firestore Timestamp updatedAt", async () => {
    const isoDate = "2024-01-15T10:00:00.000Z";
    const snap = makeSnap([
      {
        id: "page-1",
        data: {
          slug: "about",
          title: "About Us",
          bodyMarkdown: "# About",
          status: "published",
          updatedAt: { toDate: () => new Date(isoDate) },
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const page = await getAdminPageBySlug(services, "about");
    expect(page).not.toBeNull();
    expect(page!.id).toBe("page-1");
    expect(page!.slug).toBe("about");
    expect(page!.title).toBe("About Us");
    expect(page!.bodyMarkdown).toBe("# About");
    expect(page!.status).toBe("published");
    expect(page!.updatedAt).toBe(isoDate);
  });

  it("returns empty string for updatedAt when ts has no toDate method", async () => {
    const snap = makeSnap([
      { id: "p1", data: { slug: "contact", title: "Contact", bodyMarkdown: "", status: "draft", updatedAt: null } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const page = await getAdminPageBySlug(services, "contact");
    expect(page!.updatedAt).toBe("");
  });

  it("falls back to slug parameter when data.slug is missing", async () => {
    const snap = makeSnap([
      { id: "p1", data: { title: "T", bodyMarkdown: "", status: "draft", updatedAt: null } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const page = await getAdminPageBySlug(services, "my-slug");
    expect(page!.slug).toBe("my-slug");
  });

  it("defaults status to 'draft' when missing", async () => {
    const snap = makeSnap([
      { id: "p1", data: { slug: "s", title: "", bodyMarkdown: "", updatedAt: null } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const page = await getAdminPageBySlug(services, "s");
    expect(page!.status).toBe("draft");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAdminPageDataBySlug
// ═════════════════════════════════════════════════════════════════════════════

describe("getAdminPageDataBySlug", () => {
  it("returns null when no page found", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getAdminPageDataBySlug(services, "faq")).toBeNull();
  });

  it("returns pageData when present", async () => {
    const pageData = { templateType: "general", sections: [] };
    const snap = makeSnap([{ id: "p1", data: { pageData } }]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getAdminPageDataBySlug(services, "faq");
    expect(result).toEqual(pageData);
  });

  it("returns null when pageData field is null/undefined", async () => {
    const snap = makeSnap([{ id: "p1", data: { pageData: null } }]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getAdminPageDataBySlug(services, "faq");
    expect(result).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAdminPages
// ═════════════════════════════════════════════════════════════════════════════

describe("getAdminPages", () => {
  it("returns empty array when collection is empty", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getAdminPages(services)).toEqual([]);
  });

  it("maps all page documents correctly", async () => {
    const isoDate = "2024-06-01T08:00:00.000Z";
    const snap = makeSnap([
      {
        id: "page-1",
        data: {
          slug: "home",
          title: "Home",
          bodyMarkdown: "# Home",
          status: "published",
          updatedAt: { toDate: () => new Date(isoDate) },
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const pages = await getAdminPages(services);
    expect(pages).toHaveLength(1);
    expect(pages[0].slug).toBe("home");
    expect(pages[0].updatedAt).toBe(isoDate);
  });

  it("falls back to empty string for updatedAt when ts is missing", async () => {
    const snap = makeSnap([
      { id: "p1", data: { slug: "s", title: "T", bodyMarkdown: "", status: "draft", updatedAt: null } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [page] = await getAdminPages(services);
    expect(page.updatedAt).toBe("");
    expect(page.status).toBe("draft");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// upsertAdminPage
// ═════════════════════════════════════════════════════════════════════════════

describe("upsertAdminPage", () => {
  it("updates the existing document when page is found", async () => {
    const snap = makeSnap([{ id: "page-1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await upsertAdminPage(services, "about", "About Us", "# About", "published");

    expect(updateDocMock).toHaveBeenCalledTimes(1);
    expect(addDocMock).not.toHaveBeenCalled();
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("About Us");
    expect(payload.bodyMarkdown).toBe("# About");
    expect(payload.status).toBe("published");
  });

  it("includes publishedAt when status is 'published' (update path)", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await upsertAdminPage(services, "s", "T", "body", "published");

    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("does NOT include publishedAt when status is 'draft' (update path)", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await upsertAdminPage(services, "s", "T", "body", "draft");

    const payload = updateDocMock.mock.calls[0][1];
    expect("publishedAt" in payload).toBe(false);
  });

  it("creates a new document when page is not found", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertAdminPage(services, "new-page", "New Page", "# New", "draft");

    expect(addDocMock).toHaveBeenCalledTimes(1);
    expect(updateDocMock).not.toHaveBeenCalled();
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.type).toBe("page");
    expect(payload.slug).toBe("new-page");
    expect(payload.title).toBe("New Page");
    expect(payload.bodyMarkdown).toBe("# New");
    expect(payload.status).toBe("draft");
  });

  it("sets publishedAt to serverTimestamp when status='published' (insert path)", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertAdminPage(services, "slug", "Title", "body", "published");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("sets publishedAt to null when status='draft' (insert path)", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertAdminPage(services, "slug", "Title", "body", "draft");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toBeNull();
  });

  it("sets createdBy to null when unauthenticated (insert path)", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertAdminPage(anonServices, "slug", "T", "body", "draft");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getAdminSiteSettings
// ═════════════════════════════════════════════════════════════════════════════

describe("getAdminSiteSettings", () => {
  it("returns empty object when document does not exist", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
    const result = await getAdminSiteSettings(services);
    expect(result).toEqual({});
  });

  it("returns mapped settings when document exists", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({
        ngoName: "My NGO",
        tagline: "Helping All",
        contactEmail: "info@ngo.org",
        contactPhone: "+90 212 000 0000",
        addressText: "Istanbul",
        socialFacebook: "fb.com/ngo",
        socialTwitter: "twitter.com/ngo",
        socialInstagram: "ig.com/ngo",
        socialLinkedin: "linkedin.com/ngo",
        socialYoutube: "youtube.com/ngo",
        defaultSeoDescription: "We help people",
      }),
    });

    const settings = await getAdminSiteSettings(services);
    expect(settings.ngoName).toBe("My NGO");
    expect(settings.tagline).toBe("Helping All");
    expect(settings.contactEmail).toBe("info@ngo.org");
    expect(settings.socialFacebook).toBe("fb.com/ngo");
    expect(settings.defaultSeoDescription).toBe("We help people");
  });

  it("falls back to legacy siteName field when ngoName is absent", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ siteName: "Legacy NGO" }),
    });

    const settings = await getAdminSiteSettings(services);
    expect(settings.ngoName).toBe("Legacy NGO");
  });

  it("falls back to legacy address field when addressText is absent", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ address: "Old Address" }),
    });

    const settings = await getAdminSiteSettings(services);
    expect(settings.addressText).toBe("Old Address");
  });

  it("falls back to legacy metaDescription when defaultSeoDescription is absent", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ metaDescription: "Old meta" }),
    });

    const settings = await getAdminSiteSettings(services);
    expect(settings.defaultSeoDescription).toBe("Old meta");
  });

  it("uses empty string defaults for all missing fields", async () => {
    getDocMock.mockResolvedValue({ exists: () => true, data: () => ({}) });

    const settings = await getAdminSiteSettings(services);
    expect(settings.ngoName).toBe("");
    expect(settings.tagline).toBe("");
    expect(settings.contactEmail).toBe("");
    expect(settings.contactPhone).toBe("");
    expect(settings.addressText).toBe("");
    expect(settings.socialFacebook).toBe("");
    expect(settings.defaultSeoDescription).toBe("");
  });

  it("reads from SETTINGS/site document path", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
    await getAdminSiteSettings(services);
    expect(docMock).toHaveBeenCalledWith(mockDb, "settings", "site");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateAdminSiteSettings
// ═════════════════════════════════════════════════════════════════════════════

describe("updateAdminSiteSettings", () => {
  it("calls setDoc with merge:true", async () => {
    await updateAdminSiteSettings(services, { ngoName: "Updated NGO" });
    expect(setDocMock).toHaveBeenCalledTimes(1);
    const [, , options] = setDocMock.mock.calls[0];
    expect(options).toEqual({ merge: true });
  });

  it("includes updatedBy and updatedAt in the payload", async () => {
    await updateAdminSiteSettings(services, { tagline: "New tagline" });
    const payload = setDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBe("user-1");
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.tagline).toBe("New tagline");
  });

  it("sets updatedBy to null when unauthenticated", async () => {
    await updateAdminSiteSettings(anonServices, {});
    const payload = setDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBeNull();
  });

  it("targets SETTINGS/site document", async () => {
    await updateAdminSiteSettings(services, {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "settings", "site");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getContactMessages
// ═════════════════════════════════════════════════════════════════════════════

describe("getContactMessages", () => {
  it("returns empty array when no messages exist", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getContactMessages(services)).toEqual([]);
  });

  it("maps documents to AdminContactMessage shape", async () => {
    const isoDate = "2024-03-10T12:00:00.000Z";
    const snap = makeSnap([
      {
        id: "msg-1",
        data: {
          senderName: "Ahmet",
          senderEmail: "ahmet@example.com",
          senderPhone: "555",
          subject: "Hello",
          messageBody: "World",
          status: "new",
          internalNotes: "note",
          createdAt: { toDate: () => new Date(isoDate) },
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [msg] = await getContactMessages(services);
    expect(msg.id).toBe("msg-1");
    expect(msg.senderName).toBe("Ahmet");
    expect(msg.senderEmail).toBe("ahmet@example.com");
    expect(msg.senderPhone).toBe("555");
    expect(msg.subject).toBe("Hello");
    expect(msg.messageBody).toBe("World");
    expect(msg.status).toBe("new");
    expect(msg.internalNotes).toBe("note");
    expect(msg.createdAt).toBe(isoDate);
  });

  it("falls back to String(ts) when ts has no toDate method", async () => {
    const snap = makeSnap([
      { id: "m1", data: { createdAt: 1234567890 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [msg] = await getContactMessages(services);
    expect(msg.createdAt).toBe("1234567890");
  });

  it("uses empty string when createdAt is null/undefined", async () => {
    const snap = makeSnap([{ id: "m1", data: { createdAt: null } }]);
    getDocsMock.mockResolvedValue(snap);

    const [msg] = await getContactMessages(services);
    expect(msg.createdAt).toBe("");
  });

  it("sorts messages in descending order by createdAt string", async () => {
    const snap = makeSnap([
      { id: "m1", data: { createdAt: { toDate: () => new Date("2024-01-01") } } },
      { id: "m2", data: { createdAt: { toDate: () => new Date("2024-06-01") } } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const msgs = await getContactMessages(services);
    expect(msgs[0].id).toBe("m2");
    expect(msgs[1].id).toBe("m1");
  });

  it("uses empty string defaults for all missing text fields", async () => {
    const snap = makeSnap([{ id: "m1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [msg] = await getContactMessages(services);
    expect(msg.senderName).toBe("");
    expect(msg.senderEmail).toBe("");
    expect(msg.senderPhone).toBe("");
    expect(msg.subject).toBe("");
    expect(msg.messageBody).toBe("");
    expect(msg.status).toBe("new");
    expect(msg.internalNotes).toBe("");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateContactMessageStatus
// ═════════════════════════════════════════════════════════════════════════════

describe("updateContactMessageStatus", () => {
  it("calls updateDoc on contactMessages/<id>", async () => {
    await updateContactMessageStatus(services, "msg-1", "resolved");
    expect(docMock).toHaveBeenCalledWith(mockDb, "contactMessages", "msg-1");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
  });

  it("sets status in the payload", async () => {
    await updateContactMessageStatus(services, "msg-1", "spam");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.status).toBe("spam");
  });

  it("includes internalNotes when provided", async () => {
    await updateContactMessageStatus(services, "msg-1", "inProgress", "Follow up needed");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.internalNotes).toBe("Follow up needed");
  });

  it("does NOT include internalNotes when omitted", async () => {
    await updateContactMessageStatus(services, "msg-1", "resolved");
    const payload = updateDocMock.mock.calls[0][1];
    expect("internalNotes" in payload).toBe(false);
  });

  it("sets handledBy to uid and handledAt / updatedAt to serverTimestamp", async () => {
    await updateContactMessageStatus(services, "msg-1", "resolved");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.handledBy).toBe("user-1");
    expect(payload.handledAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("sets handledBy to null when unauthenticated", async () => {
    await updateContactMessageStatus(anonServices, "msg-1", "resolved");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.handledBy).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getPageBlocks
// ═════════════════════════════════════════════════════════════════════════════

describe("getPageBlocks", () => {
  it("returns null when no page matches the slug", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    expect(await getPageBlocks(services, "unknown-page")).toBeNull();
  });

  it("returns null when pageData is null", async () => {
    const snap = makeSnap([{ id: "p1", data: { pageData: null } }]);
    getDocsMock.mockResolvedValue(snap);

    expect(await getPageBlocks(services, "page")).toBeNull();
  });

  it("returns null when pageData.sections is not an array", async () => {
    const snap = makeSnap([{ id: "p1", data: { pageData: { sections: "not-an-array" } } }]);
    getDocsMock.mockResolvedValue(snap);

    expect(await getPageBlocks(services, "page")).toBeNull();
  });

  it("returns PageBlockData when pageData has a valid sections array", async () => {
    const blockData: PageBlockData = { templateType: "general", sections: [] };
    const snap = makeSnap([{ id: "p1", data: { pageData: blockData } }]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPageBlocks(services, "home");
    expect(result).toEqual(blockData);
  });

  it("returns block data with populated sections", async () => {
    const blockData: PageBlockData = {
      templateType: "general",
      sections: [{ id: "s1", type: "hero", order: 0, data: { title: "Hero" } }],
    };
    const snap = makeSnap([{ id: "p1", data: { pageData: blockData } }]);
    getDocsMock.mockResolvedValue(snap);

    const result = await getPageBlocks(services, "home");
    expect(result!.sections).toHaveLength(1);
    expect(result!.sections[0].type).toBe("hero");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// savePageBlocks
// ═════════════════════════════════════════════════════════════════════════════

describe("savePageBlocks", () => {
  const blockData: PageBlockData = { templateType: "general", sections: [] };

  it("updates existing document when page is found", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await savePageBlocks(services, "home", "Home", blockData, "published");

    expect(updateDocMock).toHaveBeenCalledTimes(1);
    expect(addDocMock).not.toHaveBeenCalled();
  });

  it("sets publishedAt on update when status='published'", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await savePageBlocks(services, "home", "Home", blockData, "published");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("does not set publishedAt on update when status='draft'", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await savePageBlocks(services, "home", "Home", blockData, "draft");
    const payload = updateDocMock.mock.calls[0][1];
    expect("publishedAt" in payload).toBe(false);
  });

  it("creates new document when page is not found", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await savePageBlocks(services, "new-page", "New Page", blockData, "draft");

    expect(addDocMock).toHaveBeenCalledTimes(1);
    expect(updateDocMock).not.toHaveBeenCalled();
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.type).toBe("page");
    expect(payload.slug).toBe("new-page");
    expect(payload.title).toBe("New Page");
    expect(payload.pageData).toEqual(blockData);
  });

  it("sets publishedAt to serverTimestamp on insert when status='published'", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await savePageBlocks(services, "p", "P", blockData, "published");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("sets publishedAt to null on insert when status='draft'", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await savePageBlocks(services, "p", "P", blockData, "draft");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toBeNull();
  });

  it("sets createdBy to null when unauthenticated (insert path)", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await savePageBlocks(anonServices, "p", "P", blockData, "draft");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });

  it("includes updatedBy uid in update payload", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await savePageBlocks(services, "home", "Home", blockData, "draft");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBe("user-1");
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// upsertPageContent
// ═════════════════════════════════════════════════════════════════════════════

describe("upsertPageContent", () => {
  const pageData = { key: "value" };

  it("updates existing document when found", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await upsertPageContent(services, "about", pageData);

    expect(updateDocMock).toHaveBeenCalledTimes(1);
    expect(addDocMock).not.toHaveBeenCalled();
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.pageData).toEqual(pageData);
    expect(payload.status).toBe("published");
  });

  it("creates new document when page is not found", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertPageContent(services, "new-content", pageData);

    expect(addDocMock).toHaveBeenCalledTimes(1);
    expect(updateDocMock).not.toHaveBeenCalled();
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.type).toBe("page");
    expect(payload.slug).toBe("new-content");
    expect(payload.title).toBe("new-content");
    expect(payload.pageData).toEqual(pageData);
    expect(payload.status).toBe("published");
  });

  it("sets createdBy to uid when authenticated (insert path)", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertPageContent(services, "slug", pageData);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBe("user-1");
  });

  it("sets createdBy to null when unauthenticated (insert path)", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertPageContent(anonServices, "slug", pageData);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });

  it("sets updatedBy to uid in update payload", async () => {
    const snap = makeSnap([{ id: "p1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    await upsertPageContent(services, "about", pageData);
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBe("user-1");
  });

  it("includes serverTimestamp for publishedAt in insert path", async () => {
    getDocsMock.mockResolvedValue(emptySnap);

    await upsertPageContent(services, "slug", pageData);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// updateStaffPhotoURL
// ═════════════════════════════════════════════════════════════════════════════

describe("updateStaffPhotoURL", () => {
  it("calls updateDoc on staff/<uid>", async () => {
    await updateStaffPhotoURL(services, "staff-uid-1", "https://example.com/photo.jpg");
    expect(docMock).toHaveBeenCalledWith(mockDb, "staff", "staff-uid-1");
    expect(updateDocMock).toHaveBeenCalledTimes(1);
  });

  it("sets photoURL and updatedAt in the payload", async () => {
    await updateStaffPhotoURL(services, "staff-uid-1", "https://example.com/photo.jpg");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.photoURL).toBe("https://example.com/photo.jpg");
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// getStaffMember
// ═════════════════════════════════════════════════════════════════════════════

describe("getStaffMember", () => {
  it("returns staff data when document exists", async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ photoURL: "photo.jpg", displayName: "Alice", email: "alice@example.com" }),
    });

    const member = await getStaffMember(services, "uid-1");
    expect(member).not.toBeNull();
    expect(member!.photoURL).toBe("photo.jpg");
    expect(member!.displayName).toBe("Alice");
    expect(member!.email).toBe("alice@example.com");
  });

  it("returns null when document does not exist", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
    const member = await getStaffMember(services, "uid-1");
    expect(member).toBeNull();
  });

  it("reads from staff/<uid> document path", async () => {
    getDocMock.mockResolvedValue({ exists: () => false, data: () => ({}) });
    await getStaffMember(services, "staff-123");
    expect(docMock).toHaveBeenCalledWith(mockDb, "staff", "staff-123");
  });

  it("returns null and does not throw when getDoc rejects (catch path)", async () => {
    getDocMock.mockRejectedValue(new Error("Permission denied"));
    const member = await getStaffMember(services, "uid-1");
    expect(member).toBeNull();
  });
});
