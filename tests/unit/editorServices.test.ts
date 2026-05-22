import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

// ─── Hoisted mock refs ────────────────────────────────────────────────────────

const {
  addDocMock,
  getDocsMock,
  updateDocMock,
  collectionMock,
  docMock,
  queryMock,
  whereMock,
  orderByMock,
  serverTimestampMock,
  timestampFromDateMock,
  timestampNowMock,
} = vi.hoisted(() => ({
  addDocMock: vi.fn(),
  getDocsMock: vi.fn(),
  updateDocMock: vi.fn(),
  collectionMock: vi.fn((_db: unknown, name: string) => ({ __collection: name })),
  docMock: vi.fn((_db: unknown, col: string, id: string) => ({ __doc: `${col}/${id}` })),
  queryMock: vi.fn((...args: unknown[]) => ({ __query: args })),
  whereMock: vi.fn((...args: unknown[]) => ({ __where: args })),
  orderByMock: vi.fn((...args: unknown[]) => ({ __orderBy: args })),
  serverTimestampMock: vi.fn(() => ({ __sentinel: "server" })),
  timestampFromDateMock: vi.fn((d: Date) => ({ __ts: d.toISOString() })),
  timestampNowMock: vi.fn(() => ({ __ts: "now" })),
}));

vi.mock("firebase/firestore", () => ({
  collection: collectionMock,
  doc: docMock,
  getDocs: getDocsMock,
  addDoc: addDocMock,
  updateDoc: updateDocMock,
  query: queryMock,
  where: whereMock,
  orderBy: orderByMock,
  serverTimestamp: serverTimestampMock,
  Timestamp: {
    fromDate: timestampFromDateMock,
    now: timestampNowMock,
  },
}));

// ─── Subject under test (imported after mocks) ────────────────────────────────

import {
  tsToDateString,
  tsToISOString,
  slugify,
  attachmentsFromContentItem,
  getEditorBlogs,
  createEditorBlog,
  updateEditorBlog,
  deleteEditorBlog,
  getEditorEvents,
  createEditorEvent,
  updateEditorEvent,
  deleteEditorEvent,
  getEditorMedia,
  createEditorMedia,
  updateEditorMedia,
  deleteEditorMedia,
  getEditorAnnouncements,
  createEditorAnnouncement,
  updateEditorAnnouncement,
  deleteEditorAnnouncement,
  getEditorNotifications,
  markNotificationRead,
  getEditorCampaigns,
  createEditorCampaign,
  updateEditorCampaign,
  deleteEditorCampaign,
  getEditorCategories,
  createEditorCategory,
  updateEditorCategory,
  deleteEditorCategory,
  getEditorTags,
  createEditorTag,
  updateEditorTag,
  deleteEditorTag,
} from "@/lib/firebase/editorServices";

import type {
  BlogPost,
  EventItem,
  MediaItem,
  AnnouncementItem,
  CampaignItem,
  CategoryItem,
  TagItem,
} from "@/types/editorPanel";

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const mockDb = {} as Firestore;

function makeAuth(uid: string | null = "user-1"): Auth {
  return { currentUser: uid ? { uid } : null } as unknown as Auth;
}

const services = { db: mockDb, auth: makeAuth("user-1") };
const anonServices = { db: mockDb, auth: makeAuth(null) };

/** Build a minimal Firestore QuerySnapshot. */
function makeSnap(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  return {
    docs: docs.map((d) => ({ id: d.id, data: () => d.data })),
    size: docs.length,
    empty: docs.length === 0,
  };
}

const emptySnap = { docs: [], size: 0, empty: true };

/** A Firestore Timestamp-like object with a working toDate(). */
function makeTs(isoString: string) {
  return { toDate: () => new Date(isoString) };
}

// ─── afterEach teardown ───────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  addDocMock.mockResolvedValue({ id: "new-id" });
  updateDocMock.mockResolvedValue(undefined);
  getDocsMock.mockResolvedValue(emptySnap);
});

// ═════════════════════════════════════════════════════════════════════════════
// Pure helpers
// ═════════════════════════════════════════════════════════════════════════════

describe("tsToDateString", () => {
  it("returns today's date when ts is null", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(tsToDateString(null)).toBe(today);
  });

  it("returns today's date when ts is undefined", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(tsToDateString(undefined)).toBe(today);
  });

  it("returns the date portion of the timestamp", () => {
    const ts = makeTs("2024-03-15T10:30:00.000Z") as never;
    expect(tsToDateString(ts)).toBe("2024-03-15");
  });
});

describe("tsToISOString", () => {
  it("returns a current ISO string when ts is null", () => {
    const before = Date.now();
    const result = tsToISOString(null);
    const after = Date.now();
    const resultMs = new Date(result).getTime();
    expect(resultMs).toBeGreaterThanOrEqual(before);
    expect(resultMs).toBeLessThanOrEqual(after);
  });

  it("returns a current ISO string when ts is undefined", () => {
    const result = tsToISOString(undefined);
    expect(() => new Date(result)).not.toThrow();
  });

  it("converts a valid timestamp to ISO string", () => {
    const ts = makeTs("2024-06-01T08:00:00.000Z") as never;
    expect(tsToISOString(ts)).toBe("2024-06-01T08:00:00.000Z");
  });
});

describe("slugify", () => {
  it("converts a simple English title to a slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("converts Turkish characters correctly", () => {
    expect(slugify("çğıöşü")).toBe("cgiosu");
    expect(slugify("ÇĞİÖŞÜ")).toBe("cgiosu");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World#")).toBe("hello-world");
  });

  it("collapses multiple spaces/hyphens", () => {
    expect(slugify("hello   world---foo")).toBe("hello-world-foo");
  });

  it("trims leading/trailing whitespace", () => {
    expect(slugify("  trimmed  ")).toBe("trimmed");
  });

  it("truncates to 80 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(80);
  });

  it("returns empty string for an empty input", () => {
    expect(slugify("")).toBe("");
  });
});

describe("attachmentsFromContentItem", () => {
  it("returns empty array when attachments field is absent", () => {
    expect(attachmentsFromContentItem({})).toEqual([]);
  });

  it("returns empty array when attachments is not an array", () => {
    expect(attachmentsFromContentItem({ attachments: "not-array" })).toEqual([]);
  });

  it("filters out entries that lack a string url", () => {
    const raw = [
      { id: "a1", name: "file.pdf", url: "https://example.com/file.pdf" },
      { id: "a2", name: "bad" }, // no url
      null,
      42,
    ];
    const result = attachmentsFromContentItem({ attachments: raw });
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("https://example.com/file.pdf");
  });

  it("returns all valid attachments", () => {
    const raw = [
      { id: "a1", name: "f1.pdf", url: "url1" },
      { id: "a2", name: "f2.pdf", url: "url2" },
    ];
    expect(attachmentsFromContentItem({ attachments: raw })).toHaveLength(2);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Blog Posts
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorBlogs", () => {
  it("returns empty array when no documents exist", async () => {
    expect(await getEditorBlogs(services)).toEqual([]);
  });

  it("maps all document fields to BlogPost shape", async () => {
    const snap = makeSnap([
      {
        id: "blog-1",
        data: {
          title: "Test Blog",
          categoryId: "cat-1",
          publishedAt: makeTs("2024-05-01T00:00:00.000Z"),
          status: "published",
          authorName: "Alice",
          excerpt: "Short summary",
          bodyMarkdown: "# Body",
          coverImageUrl: "cover.jpg",
          attachmentUrl: "doc.pdf",
          attachmentName: "doc.pdf",
          attachments: [{ id: "a1", name: "f.pdf", url: "f.pdf" }],
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [blog] = await getEditorBlogs(services);
    expect(blog.id).toBe("blog-1");
    expect(blog.title).toBe("Test Blog");
    expect(blog.category).toBe("cat-1");
    expect(blog.status).toBe("published");
    expect(blog.author).toBe("Alice");
    expect(blog.summary).toBe("Short summary");
    expect(blog.bodyMarkdown).toBe("# Body");
    expect(blog.coverImageUrl).toBe("cover.jpg");
    expect(blog.attachmentUrl).toBe("doc.pdf");
    expect(blog.attachmentName).toBe("doc.pdf");
    expect(blog.attachments).toHaveLength(1);
  });

  it("falls back to data.category when categoryId is missing", async () => {
    const snap = makeSnap([{ id: "b1", data: { category: "fallback-cat" } }]);
    getDocsMock.mockResolvedValue(snap);

    const [blog] = await getEditorBlogs(services);
    expect(blog.category).toBe("fallback-cat");
  });

  it("falls back to data.summary when excerpt is missing", async () => {
    const snap = makeSnap([{ id: "b1", data: { summary: "summary text" } }]);
    getDocsMock.mockResolvedValue(snap);

    const [blog] = await getEditorBlogs(services);
    expect(blog.summary).toBe("summary text");
  });

  it("uses empty string defaults for all missing fields", async () => {
    const snap = makeSnap([{ id: "b1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [blog] = await getEditorBlogs(services);
    expect(blog.title).toBe("");
    expect(blog.category).toBe("");
    expect(blog.status).toBe("draft");
    expect(blog.author).toBe("");
    expect(blog.summary).toBe("");
    expect(blog.bodyMarkdown).toBe("");
    expect(blog.coverImageUrl).toBe("");
    expect(blog.attachmentUrl).toBe("");
    expect(blog.attachmentName).toBe("");
    expect(blog.attachments).toEqual([]);
  });

  it("queries contentItems collection with correct filters", async () => {
    await getEditorBlogs(services);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "contentItems");
    expect(whereMock).toHaveBeenCalledWith("type", "==", "post");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
    expect(orderByMock).toHaveBeenCalledWith("createdAt", "desc");
  });
});

describe("createEditorBlog", () => {
  const blog: Omit<BlogPost, "id"> = {
    title: "My Blog",
    category: "news",
    publishedAt: "2024-01-01",
    status: "published",
    author: "Bob",
    summary: "A summary",
    bodyMarkdown: "# Content",
    coverImageUrl: "cover.png",
    attachmentUrl: "file.pdf",
    attachmentName: "file.pdf",
    attachments: [],
  };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "blog-new" });
    expect(await createEditorBlog(services, blog)).toBe("blog-new");
  });

  it("writes to contentItems collection with type='post'", async () => {
    await createEditorBlog(services, blog);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "contentItems");
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.type).toBe("post");
  });

  it("generates a slug from the title", async () => {
    await createEditorBlog(services, blog);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("my-blog");
  });

  it("sets publishedAt to serverTimestamp when status='published'", async () => {
    await createEditorBlog(services, blog);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("sets publishedAt to null when status='draft'", async () => {
    await createEditorBlog(services, { ...blog, status: "draft" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toBeNull();
  });

  it("sets createdBy and updatedBy to uid", async () => {
    await createEditorBlog(services, blog);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBe("user-1");
    expect(payload.updatedBy).toBe("user-1");
  });

  it("sets createdBy and updatedBy to null when unauthenticated", async () => {
    await createEditorBlog(anonServices, blog);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
    expect(payload.updatedBy).toBeNull();
  });

  it("sets deletedAt and archivedAt to null", async () => {
    await createEditorBlog(services, blog);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
    expect(payload.archivedAt).toBeNull();
  });

  it("defaults bodyMarkdown to empty string when not provided", async () => {
    const { bodyMarkdown: _, ...blogWithout } = blog;
    await createEditorBlog(services, blogWithout as Omit<BlogPost, "id">);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.bodyMarkdown).toBe("");
  });
});

describe("updateEditorBlog", () => {
  it("always sets updatedAt and updatedBy", async () => {
    await updateEditorBlog(services, "b-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("updates title and regenerates slug", async () => {
    await updateEditorBlog(services, "b-1", { title: "New Title" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("New Title");
    expect(payload.slug).toBe("new-title");
  });

  it("does not include title/slug when title is undefined", async () => {
    await updateEditorBlog(services, "b-1", { author: "Ed" });
    const payload = updateDocMock.mock.calls[0][1];
    expect("title" in payload).toBe(false);
    expect("slug" in payload).toBe(false);
  });

  it("updates summary as both excerpt and summary fields", async () => {
    await updateEditorBlog(services, "b-1", { summary: "New summary" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.excerpt).toBe("New summary");
    expect(payload.summary).toBe("New summary");
  });

  it("updates category as both categoryId and category fields", async () => {
    await updateEditorBlog(services, "b-1", { category: "tech" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.categoryId).toBe("tech");
    expect(payload.category).toBe("tech");
  });

  it("sets publishedAt when status is updated to 'published'", async () => {
    await updateEditorBlog(services, "b-1", { status: "published" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.status).toBe("published");
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("does not set publishedAt when status is 'draft'", async () => {
    await updateEditorBlog(services, "b-1", { status: "draft" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.status).toBe("draft");
    expect("publishedAt" in payload).toBe(false);
  });

  it("updates author as authorName", async () => {
    await updateEditorBlog(services, "b-1", { author: "New Author" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.authorName).toBe("New Author");
  });

  it("updates bodyMarkdown, coverImageUrl, attachmentUrl, attachmentName, attachments", async () => {
    const updates = {
      bodyMarkdown: "# New",
      coverImageUrl: "new.jpg",
      attachmentUrl: "new.pdf",
      attachmentName: "new.pdf",
      attachments: [{ id: "a1", name: "n", url: "u" }],
    };
    await updateEditorBlog(services, "b-1", updates);
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.bodyMarkdown).toBe("# New");
    expect(payload.coverImageUrl).toBe("new.jpg");
    expect(payload.attachmentUrl).toBe("new.pdf");
    expect(payload.attachmentName).toBe("new.pdf");
    expect(payload.attachments).toHaveLength(1);
  });

  it("calls updateDoc on contentItems/<id>", async () => {
    await updateEditorBlog(services, "b-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "contentItems", "b-99");
  });
});

describe("deleteEditorBlog", () => {
  it("sets deletedAt and updatedAt (soft delete)", async () => {
    await deleteEditorBlog(services, "b-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "contentItems", "b-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Events
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorEvents", () => {
  it("returns empty array when no events exist", async () => {
    expect(await getEditorEvents(services)).toEqual([]);
  });

  it("maps all Firestore status values to EventItem statuses", async () => {
    const statusMap: Array<[string, EventItem["status"]]> = [
      ["draft", "planned"],
      ["published", "active"],
      ["canceled", "cancelled"],
      ["archived", "done"],
      ["unknown", "planned"], // unknown falls back to planned
    ];

    for (const [fsStatus, expectedStatus] of statusMap) {
      vi.clearAllMocks();
      const snap = makeSnap([
        { id: "e1", data: { status: fsStatus, startsAt: makeTs("2024-01-01T00:00:00.000Z") } },
      ]);
      getDocsMock.mockResolvedValue(snap);
      const [event] = await getEditorEvents(services);
      expect(event.status).toBe(expectedStatus);
    }
  });

  it("maps document fields to EventItem shape", async () => {
    const snap = makeSnap([
      {
        id: "e1",
        data: {
          title: "Conference",
          startsAt: makeTs("2024-06-15T09:00:00.000Z"),
          endsAt: makeTs("2024-06-16T17:00:00.000Z"),
          locationName: "Istanbul",
          city: "Istanbul",
          venue: "ICC",
          eventType: "conference",
          capacity: 500,
          isOnline: false,
          status: "published",
          attachmentUrl: "agenda.pdf",
          attachmentName: "agenda.pdf",
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [event] = await getEditorEvents(services);
    expect(event.id).toBe("e1");
    expect(event.title).toBe("Conference");
    expect(event.date).toBe("2024-06-15");
    expect(event.endDate).toBe("2024-06-16");
    expect(event.location).toBe("Istanbul");
    expect(event.city).toBe("Istanbul");
    expect(event.venue).toBe("ICC");
    expect(event.type).toBe("conference");
    expect(event.capacity).toBe(500);
    expect(event.isOnline).toBe(false);
    expect(event.status).toBe("active");
    expect(event.attachmentUrl).toBe("agenda.pdf");
  });

  it("omits endDate when endsAt is falsy", async () => {
    const snap = makeSnap([
      { id: "e1", data: { startsAt: makeTs("2024-01-01T00:00:00.000Z"), endsAt: null } },
    ]);
    getDocsMock.mockResolvedValue(snap);
    const [event] = await getEditorEvents(services);
    expect(event.endDate).toBeUndefined();
  });

  it("uses default values for missing fields", async () => {
    const snap = makeSnap([{ id: "e1", data: { startsAt: makeTs("2024-01-01T00:00:00.000Z") } }]);
    getDocsMock.mockResolvedValue(snap);

    const [event] = await getEditorEvents(services);
    expect(event.title).toBe("");
    expect(event.location).toBe("");
    expect(event.city).toBe("");
    expect(event.venue).toBe("");
    expect(event.type).toBe("");
    expect(event.capacity).toBe(0);
    expect(event.isOnline).toBe(false);
    expect(event.attachmentUrl).toBe("");
    expect(event.attachmentName).toBe("");
  });
});

describe("createEditorEvent", () => {
  const event: Omit<EventItem, "id"> = {
    title: "Workshop",
    date: "2024-07-10",
    endDate: "2024-07-11",
    location: "Ankara",
    city: "Ankara",
    venue: "Convention Center",
    type: "workshop",
    capacity: 100,
    isOnline: false,
    status: "planned",
    attachmentUrl: "brief.pdf",
    attachmentName: "brief.pdf",
  };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "event-42" });
    expect(await createEditorEvent(services, event)).toBe("event-42");
  });

  it("writes to events collection", async () => {
    await createEditorEvent(services, event);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "events");
  });

  it("converts EventItem status to Firestore status (planned→draft)", async () => {
    await createEditorEvent(services, event); // status: "planned"
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.status).toBe("draft");
  });

  it("converts all EventItem statuses to Firestore equivalents", async () => {
    const statusMap: Array<[EventItem["status"], string]> = [
      ["planned", "draft"],
      ["active", "published"],
      ["cancelled", "canceled"],
      ["done", "archived"],
    ];
    for (const [editorStatus, fsStatus] of statusMap) {
      vi.clearAllMocks();
      addDocMock.mockResolvedValue({ id: "x" });
      await createEditorEvent(services, { ...event, status: editorStatus });
      const payload = addDocMock.mock.calls[0][1];
      expect(payload.status).toBe(fsStatus);
    }
  });

  it("converts date string to Timestamp.fromDate", async () => {
    await createEditorEvent(services, event);
    expect(timestampFromDateMock).toHaveBeenCalled();
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.startsAt).toEqual({ __ts: new Date("2024-07-10").toISOString() });
  });

  it("uses Timestamp.now() when date is not provided", async () => {
    const eventWithoutDate = { ...event, date: "" };
    await createEditorEvent(services, eventWithoutDate);
    expect(timestampNowMock).toHaveBeenCalled();
  });

  it("converts endDate string to Timestamp when provided", async () => {
    await createEditorEvent(services, event);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.endsAt).toEqual({ __ts: new Date("2024-07-11").toISOString() });
  });

  it("sets endsAt to null when endDate is not provided", async () => {
    const { endDate: _, ...eventWithout } = event;
    await createEditorEvent(services, eventWithout);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.endsAt).toBeNull();
  });

  it("generates slug from title", async () => {
    await createEditorEvent(services, event);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("workshop");
  });

  it("sets createdBy to null when unauthenticated", async () => {
    await createEditorEvent(anonServices, event);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });
});

describe("updateEditorEvent", () => {
  it("always sets updatedAt and updatedBy", async () => {
    await updateEditorEvent(services, "e-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("updates title and regenerates slug", async () => {
    await updateEditorEvent(services, "e-1", { title: "New Event" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("New Event");
    expect(payload.slug).toBe("new-event");
  });

  it("converts date to Timestamp when provided", async () => {
    await updateEditorEvent(services, "e-1", { date: "2024-09-01" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.startsAt).toEqual({ __ts: new Date("2024-09-01").toISOString() });
  });

  it("converts endDate to Timestamp when provided", async () => {
    await updateEditorEvent(services, "e-1", { endDate: "2024-09-02" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.endsAt).toEqual({ __ts: new Date("2024-09-02").toISOString() });
  });

  it("sets endsAt to null when endDate is empty string", async () => {
    await updateEditorEvent(services, "e-1", { endDate: "" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.endsAt).toBeNull();
  });

  it("maps all optional fields correctly", async () => {
    await updateEditorEvent(services, "e-1", {
      location: "Izmir",
      city: "Izmir",
      venue: "Hall A",
      type: "seminar",
      capacity: 200,
      isOnline: true,
      status: "active",
      attachmentUrl: "new.pdf",
      attachmentName: "new.pdf",
    });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.locationName).toBe("Izmir");
    expect(payload.city).toBe("Izmir");
    expect(payload.venue).toBe("Hall A");
    expect(payload.eventType).toBe("seminar");
    expect(payload.capacity).toBe(200);
    expect(payload.isOnline).toBe(true);
    expect(payload.status).toBe("published"); // active → published
    expect(payload.attachmentUrl).toBe("new.pdf");
    expect(payload.attachmentName).toBe("new.pdf");
  });

  it("calls updateDoc on events/<id>", async () => {
    await updateEditorEvent(services, "e-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "events", "e-99");
  });
});

describe("deleteEditorEvent", () => {
  it("soft-deletes by setting deletedAt and updatedAt", async () => {
    await deleteEditorEvent(services, "e-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "events", "e-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Media Assets
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorMedia", () => {
  it("returns empty array when no media exists", async () => {
    expect(await getEditorMedia(services)).toEqual([]);
  });

  it("maps document fields to MediaItem shape", async () => {
    const snap = makeSnap([
      {
        id: "m1",
        data: {
          pageKey: "home",
          altText: "Cover photo",
          description: "desc",
          tags: ["tag1"],
          visibility: "public",
          featured: true,
          downloadUrl: "https://example.com/img.jpg",
          createdAt: makeTs("2024-04-01T00:00:00.000Z"),
          status: "published",
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [media] = await getEditorMedia(services);
    expect(media.id).toBe("m1");
    expect(media.pageKey).toBe("home");
    expect(media.title).toBe("Cover photo");
    expect(media.description).toBe("desc");
    expect(media.tags).toEqual(["tag1"]);
    expect(media.visibility).toBe("public");
    expect(media.featured).toBe(true);
    expect(media.imageUrl).toBe("https://example.com/img.jpg");
    expect(media.status).toBe("published");
  });

  it("falls back to originalFilename when altText is missing", async () => {
    const snap = makeSnap([{ id: "m1", data: { originalFilename: "photo.jpg" } }]);
    getDocsMock.mockResolvedValue(snap);
    const [media] = await getEditorMedia(services);
    expect(media.title).toBe("photo.jpg");
  });

  it("uses default values for all missing fields", async () => {
    const snap = makeSnap([{ id: "m1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);
    const [media] = await getEditorMedia(services);
    expect(media.pageKey).toBe("");
    expect(media.title).toBe("");
    expect(media.description).toBe("");
    expect(media.tags).toEqual([]);
    expect(media.visibility).toBe("public");
    expect(media.featured).toBe(false);
    expect(media.imageUrl).toBe("");
    expect(media.status).toBe("published");
  });
});

describe("createEditorMedia", () => {
  const baseItem: Omit<MediaItem, "id"> = {
    pageKey: "gallery",
    title: "Photo",
    description: "A photo",
    tags: ["nature"],
    visibility: "public",
    featured: false,
    imageUrl: "https://example.com/photo.jpg",
    createdAt: "2024-01-01T00:00:00.000Z",
    status: "published",
    mimeType: "image/jpeg",
    byteSize: 1024,
  };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "media-5" });
    expect(await createEditorMedia(services, baseItem)).toBe("media-5");
  });

  it("writes to mediaAssets collection", async () => {
    await createEditorMedia(services, baseItem);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "mediaAssets");
  });

  it("sets kind='image' for image mimeType", async () => {
    await createEditorMedia(services, baseItem);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.kind).toBe("image");
  });

  it("sets kind='document' for application/pdf mimeType", async () => {
    await createEditorMedia(services, { ...baseItem, mimeType: "application/pdf" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.kind).toBe("document");
  });

  it("sets kind='other' for unrecognised mimeType", async () => {
    await createEditorMedia(services, { ...baseItem, mimeType: "video/mp4" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.kind).toBe("other");
  });

  it("defaults mimeType to 'application/octet-stream' when absent", async () => {
    const { mimeType: _, ...itemWithout } = baseItem;
    await createEditorMedia(services, itemWithout);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.mimeType).toBe("application/octet-stream");
    expect(payload.kind).toBe("other");
  });

  it("defaults byteSize to 0 when absent", async () => {
    const { byteSize: _, ...itemWithout } = baseItem;
    await createEditorMedia(services, itemWithout);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.byteSize).toBe(0);
  });

  it("defaults status to 'published' when absent", async () => {
    const { status: _, ...itemWithout } = baseItem;
    await createEditorMedia(services, itemWithout);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.status).toBe("published");
  });

  it("sets uploadedBy to null when unauthenticated", async () => {
    await createEditorMedia(anonServices, baseItem);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.uploadedBy).toBeNull();
  });

  it("sets deletedAt to null", async () => {
    await createEditorMedia(services, baseItem);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
  });
});

describe("updateEditorMedia", () => {
  it("always sets updatedAt", async () => {
    await updateEditorMedia(services, "m-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("updates altText and originalFilename when title is provided", async () => {
    await updateEditorMedia(services, "m-1", { title: "New Title" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.altText).toBe("New Title");
    expect(payload.originalFilename).toBe("New Title");
  });

  it("maps imageUrl to downloadUrl", async () => {
    await updateEditorMedia(services, "m-1", { imageUrl: "new.jpg" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.downloadUrl).toBe("new.jpg");
  });

  it("updates all optional fields when provided", async () => {
    await updateEditorMedia(services, "m-1", {
      pageKey: "about",
      description: "desc",
      tags: ["a", "b"],
      visibility: "private",
      featured: true,
      status: "draft",
    });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.pageKey).toBe("about");
    expect(payload.description).toBe("desc");
    expect(payload.tags).toEqual(["a", "b"]);
    expect(payload.visibility).toBe("private");
    expect(payload.featured).toBe(true);
    expect(payload.status).toBe("draft");
  });

  it("calls updateDoc on mediaAssets/<id>", async () => {
    await updateEditorMedia(services, "m-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "mediaAssets", "m-99");
  });
});

describe("deleteEditorMedia", () => {
  it("soft-deletes by setting deletedAt and updatedAt", async () => {
    await deleteEditorMedia(services, "m-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "mediaAssets", "m-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Announcements
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorAnnouncements", () => {
  it("returns empty array when no announcements exist", async () => {
    expect(await getEditorAnnouncements(services)).toEqual([]);
  });

  it("maps document fields to AnnouncementItem shape", async () => {
    const snap = makeSnap([
      {
        id: "ann-1",
        data: {
          title: "Notice",
          content: "Content here",
          audience: "members",
          publishedAt: makeTs("2024-02-01T00:00:00.000Z"),
          status: "published",
          pinned: true,
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [ann] = await getEditorAnnouncements(services);
    expect(ann.id).toBe("ann-1");
    expect(ann.title).toBe("Notice");
    expect(ann.content).toBe("Content here");
    expect(ann.audience).toBe("members");
    expect(ann.publishedAt).toBe("2024-02-01");
    expect(ann.status).toBe("published");
    expect(ann.pinned).toBe(true);
  });

  it("uses default values for missing fields", async () => {
    const snap = makeSnap([{ id: "a1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);
    const [ann] = await getEditorAnnouncements(services);
    expect(ann.title).toBe("");
    expect(ann.content).toBe("");
    expect(ann.audience).toBe("all");
    expect(ann.status).toBe("draft");
    expect(ann.pinned).toBe(false);
  });

  it("queries announcements collection with correct filters", async () => {
    await getEditorAnnouncements(services);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "announcements");
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
    expect(orderByMock).toHaveBeenCalledWith("createdAt", "desc");
  });
});

describe("createEditorAnnouncement", () => {
  const item: Omit<AnnouncementItem, "id"> = {
    title: "Important Notice",
    content: "Please read carefully",
    audience: "all",
    publishedAt: "2024-03-01",
    status: "published",
    pinned: false,
  };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "ann-new" });
    expect(await createEditorAnnouncement(services, item)).toBe("ann-new");
  });

  it("converts publishedAt string to Timestamp when provided", async () => {
    await createEditorAnnouncement(services, item);
    expect(timestampFromDateMock).toHaveBeenCalledWith(new Date("2024-03-01"));
  });

  it("uses serverTimestamp for publishedAt when it is empty/falsy", async () => {
    await createEditorAnnouncement(services, { ...item, publishedAt: "" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __sentinel: "server" });
  });

  it("writes to announcements collection", async () => {
    await createEditorAnnouncement(services, item);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "announcements");
  });
});

describe("updateEditorAnnouncement", () => {
  it("always sets updatedAt", async () => {
    await updateEditorAnnouncement(services, "a-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });

  it("updates all provided fields", async () => {
    await updateEditorAnnouncement(services, "a-1", {
      title: "Updated",
      content: "New content",
      audience: "volunteers",
      status: "draft",
      pinned: true,
    });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("Updated");
    expect(payload.content).toBe("New content");
    expect(payload.audience).toBe("volunteers");
    expect(payload.status).toBe("draft");
    expect(payload.pinned).toBe(true);
  });

  it("converts publishedAt string to Timestamp when provided", async () => {
    await updateEditorAnnouncement(services, "a-1", { publishedAt: "2024-04-01" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toEqual({ __ts: new Date("2024-04-01").toISOString() });
  });

  it("sets publishedAt to null when publishedAt is empty string", async () => {
    await updateEditorAnnouncement(services, "a-1", { publishedAt: "" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.publishedAt).toBeNull();
  });

  it("calls updateDoc on announcements/<id>", async () => {
    await updateEditorAnnouncement(services, "a-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "announcements", "a-99");
  });
});

describe("deleteEditorAnnouncement", () => {
  it("soft-deletes by setting deletedAt and updatedAt", async () => {
    await deleteEditorAnnouncement(services, "a-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "announcements", "a-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Notifications
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorNotifications", () => {
  it("returns empty array immediately when no user is authenticated", async () => {
    const result = await getEditorNotifications(anonServices);
    expect(result).toEqual([]);
    expect(getDocsMock).not.toHaveBeenCalled();
  });

  it("queries notifications filtered by staffId when user is authenticated", async () => {
    getDocsMock.mockResolvedValue(emptySnap);
    await getEditorNotifications(services);
    expect(whereMock).toHaveBeenCalledWith("staffId", "==", "user-1");
    expect(orderByMock).toHaveBeenCalledWith("createdAt", "desc");
  });

  it("maps document fields to NotificationItem shape", async () => {
    const snap = makeSnap([
      {
        id: "n1",
        data: {
          title: "New message",
          isRead: false,
          createdAt: makeTs("2024-07-01T12:00:00.000Z"),
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [notif] = await getEditorNotifications(services);
    expect(notif.id).toBe("n1");
    expect(notif.title).toBe("New message");
    expect(notif.isRead).toBe(false);
    expect(notif.createdAt).toBe("2024-07-01T12:00:00.000Z");
  });

  it("uses empty string and false defaults for missing fields", async () => {
    const snap = makeSnap([{ id: "n1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);

    const [notif] = await getEditorNotifications(services);
    expect(notif.title).toBe("");
    expect(notif.isRead).toBe(false);
  });
});

describe("markNotificationRead", () => {
  it("sets isRead=true on notifications/<id>", async () => {
    await markNotificationRead(services, "n-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "notifications", "n-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.isRead).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Campaigns
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorCampaigns", () => {
  it("returns empty array when no campaigns exist", async () => {
    expect(await getEditorCampaigns(services)).toEqual([]);
  });

  it("maps document fields to CampaignItem shape", async () => {
    const snap = makeSnap([
      {
        id: "c1",
        data: {
          title: "Fund Drive",
          description: "Annual fundraiser",
          goalAmount: 50000,
          currency: "TRY",
          raisedAmount: 12000,
          status: "active",
          startsAt: makeTs("2024-01-01T00:00:00.000Z"),
          endsAt: makeTs("2024-12-31T00:00:00.000Z"),
          coverImageUrl: "banner.jpg",
          featured: true,
        },
      },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [campaign] = await getEditorCampaigns(services);
    expect(campaign.id).toBe("c1");
    expect(campaign.title).toBe("Fund Drive");
    expect(campaign.description).toBe("Annual fundraiser");
    expect(campaign.goalAmount).toBe(50000);
    expect(campaign.currency).toBe("TRY");
    expect(campaign.raisedAmount).toBe(12000);
    expect(campaign.status).toBe("active");
    expect(campaign.startDate).toBe("2024-01-01");
    expect(campaign.endDate).toBe("2024-12-31");
    expect(campaign.coverImageUrl).toBe("banner.jpg");
    expect(campaign.featured).toBe(true);
  });

  it("uses default values for missing fields", async () => {
    const snap = makeSnap([{ id: "c1", data: { startsAt: null, endsAt: null } }]);
    getDocsMock.mockResolvedValue(snap);
    const [campaign] = await getEditorCampaigns(services);
    expect(campaign.title).toBe("");
    expect(campaign.description).toBe("");
    expect(campaign.goalAmount).toBe(0);
    expect(campaign.currency).toBe("TRY");
    expect(campaign.raisedAmount).toBe(0);
    expect(campaign.status).toBe("draft");
    expect(campaign.coverImageUrl).toBe("");
    expect(campaign.featured).toBe(false);
  });
});

describe("createEditorCampaign", () => {
  const campaign: Omit<CampaignItem, "id"> = {
    title: "Spring Drive",
    description: "Help the cause",
    goalAmount: 10000,
    currency: "TRY",
    raisedAmount: 0,
    status: "draft",
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    coverImageUrl: "spring.jpg",
    featured: false,
  };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "camp-1" });
    expect(await createEditorCampaign(services, campaign)).toBe("camp-1");
  });

  it("writes to campaigns collection", async () => {
    await createEditorCampaign(services, campaign);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "campaigns");
  });

  it("generates a slug from the title", async () => {
    await createEditorCampaign(services, campaign);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("spring-drive");
  });

  it("converts startDate and endDate to Timestamps", async () => {
    await createEditorCampaign(services, campaign);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.startsAt).toEqual({ __ts: new Date("2024-03-01").toISOString() });
    expect(payload.endsAt).toEqual({ __ts: new Date("2024-05-31").toISOString() });
  });

  it("sets startsAt and endsAt to null when dates are absent", async () => {
    await createEditorCampaign(services, { ...campaign, startDate: "", endDate: "" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.startsAt).toBeNull();
    expect(payload.endsAt).toBeNull();
  });

  it("always sets raisedAmount to 0", async () => {
    await createEditorCampaign(services, { ...campaign, raisedAmount: 9999 });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.raisedAmount).toBe(0);
  });

  it("sets createdBy to null when unauthenticated", async () => {
    await createEditorCampaign(anonServices, campaign);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });

  it("sets deletedAt to null", async () => {
    await createEditorCampaign(services, campaign);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
  });
});

describe("updateEditorCampaign", () => {
  it("always sets updatedAt and updatedBy", async () => {
    await updateEditorCampaign(services, "c-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("updates title and regenerates slug", async () => {
    await updateEditorCampaign(services, "c-1", { title: "Summer Drive" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.title).toBe("Summer Drive");
    expect(payload.slug).toBe("summer-drive");
  });

  it("updates description, goalAmount, currency, status, featured", async () => {
    await updateEditorCampaign(services, "c-1", {
      description: "Updated",
      goalAmount: 20000,
      currency: "USD",
      status: "active",
      featured: true,
    });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.description).toBe("Updated");
    expect(payload.goalAmount).toBe(20000);
    expect(payload.currency).toBe("USD");
    expect(payload.status).toBe("active");
    expect(payload.featured).toBe(true);
  });

  it("converts startDate to Timestamp when provided", async () => {
    await updateEditorCampaign(services, "c-1", { startDate: "2025-01-01" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.startsAt).toEqual({ __ts: new Date("2025-01-01").toISOString() });
  });

  it("sets startsAt to null when startDate is empty", async () => {
    await updateEditorCampaign(services, "c-1", { startDate: "" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.startsAt).toBeNull();
  });

  it("converts endDate to Timestamp when provided", async () => {
    await updateEditorCampaign(services, "c-1", { endDate: "2025-06-30" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.endsAt).toEqual({ __ts: new Date("2025-06-30").toISOString() });
  });

  it("sets endsAt to null when endDate is empty", async () => {
    await updateEditorCampaign(services, "c-1", { endDate: "" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.endsAt).toBeNull();
  });

  it("sets both coverImageUrl and imageUrl when coverImageUrl is provided", async () => {
    await updateEditorCampaign(services, "c-1", { coverImageUrl: "new-banner.jpg" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.coverImageUrl).toBe("new-banner.jpg");
    expect(payload.imageUrl).toBe("new-banner.jpg");
  });

  it("calls updateDoc on campaigns/<id>", async () => {
    await updateEditorCampaign(services, "c-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "campaigns", "c-99");
  });
});

describe("deleteEditorCampaign", () => {
  it("soft-deletes by setting deletedAt and updatedAt", async () => {
    await deleteEditorCampaign(services, "c-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "campaigns", "c-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Categories
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorCategories", () => {
  it("returns empty array when no categories exist", async () => {
    expect(await getEditorCategories(services)).toEqual([]);
  });

  it("queries without type filter when type is omitted", async () => {
    await getEditorCategories(services);
    expect(whereMock).not.toHaveBeenCalledWith("type", "==", expect.anything());
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
    expect(orderByMock).toHaveBeenCalledWith("sortOrder", "asc");
  });

  it("queries with type filter when type is provided", async () => {
    await getEditorCategories(services, "post");
    expect(whereMock).toHaveBeenCalledWith("type", "==", "post");
  });

  it("maps document fields to CategoryItem shape", async () => {
    const snap = makeSnap([
      { id: "cat-1", data: { name: "News", slug: "news", type: "post", sortOrder: 1 } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [cat] = await getEditorCategories(services);
    expect(cat.id).toBe("cat-1");
    expect(cat.name).toBe("News");
    expect(cat.slug).toBe("news");
    expect(cat.type).toBe("post");
    expect(cat.sortOrder).toBe(1);
  });

  it("uses default values for missing fields", async () => {
    const snap = makeSnap([{ id: "c1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);
    const [cat] = await getEditorCategories(services);
    expect(cat.name).toBe("");
    expect(cat.slug).toBe("");
    expect(cat.type).toBe("");
    expect(cat.sortOrder).toBe(0);
  });
});

describe("createEditorCategory", () => {
  const category: Omit<CategoryItem, "id"> = {
    name: "Technology",
    slug: "technology",
    type: "post",
    sortOrder: 5,
  };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "cat-new" });
    expect(await createEditorCategory(services, category)).toBe("cat-new");
  });

  it("writes to categories collection", async () => {
    await createEditorCategory(services, category);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "categories");
  });

  it("uses provided slug when present", async () => {
    await createEditorCategory(services, category);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("technology");
  });

  it("generates slug from name when slug is empty", async () => {
    await createEditorCategory(services, { ...category, slug: "" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("technology");
  });

  it("sets createdBy to uid", async () => {
    await createEditorCategory(services, category);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBe("user-1");
  });

  it("sets createdBy to null when unauthenticated", async () => {
    await createEditorCategory(anonServices, category);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });

  it("sets deletedAt to null", async () => {
    await createEditorCategory(services, category);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
  });
});

describe("updateEditorCategory", () => {
  it("always sets updatedAt and updatedBy", async () => {
    await updateEditorCategory(services, "cat-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("updates all provided fields", async () => {
    await updateEditorCategory(services, "cat-1", {
      name: "Science",
      slug: "science",
      type: "event",
      sortOrder: 3,
    });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.name).toBe("Science");
    expect(payload.slug).toBe("science");
    expect(payload.type).toBe("event");
    expect(payload.sortOrder).toBe(3);
  });

  it("does not include fields that were not provided", async () => {
    await updateEditorCategory(services, "cat-1", { name: "Only name" });
    const payload = updateDocMock.mock.calls[0][1];
    expect("slug" in payload).toBe(false);
    expect("type" in payload).toBe(false);
    expect("sortOrder" in payload).toBe(false);
  });

  it("calls updateDoc on categories/<id>", async () => {
    await updateEditorCategory(services, "cat-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "categories", "cat-99");
  });
});

describe("deleteEditorCategory", () => {
  it("soft-deletes with deletedAt, updatedAt, and updatedBy", async () => {
    await deleteEditorCategory(services, "cat-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "categories", "cat-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("sets updatedBy to null when unauthenticated", async () => {
    await deleteEditorCategory(anonServices, "cat-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Tags
// ═════════════════════════════════════════════════════════════════════════════

describe("getEditorTags", () => {
  it("returns empty array when no tags exist", async () => {
    expect(await getEditorTags(services)).toEqual([]);
  });

  it("queries without type filter when type is omitted", async () => {
    await getEditorTags(services);
    expect(whereMock).not.toHaveBeenCalledWith("type", "==", expect.anything());
    expect(whereMock).toHaveBeenCalledWith("deletedAt", "==", null);
  });

  it("queries with type filter when type is provided", async () => {
    await getEditorTags(services, "post");
    expect(whereMock).toHaveBeenCalledWith("type", "==", "post");
  });

  it("maps document fields to TagItem shape", async () => {
    const snap = makeSnap([
      { id: "t1", data: { name: "React", slug: "react", type: "tech" } },
    ]);
    getDocsMock.mockResolvedValue(snap);

    const [tag] = await getEditorTags(services);
    expect(tag.id).toBe("t1");
    expect(tag.name).toBe("React");
    expect(tag.slug).toBe("react");
    expect(tag.type).toBe("tech");
  });

  it("uses empty string defaults for missing fields", async () => {
    const snap = makeSnap([{ id: "t1", data: {} }]);
    getDocsMock.mockResolvedValue(snap);
    const [tag] = await getEditorTags(services);
    expect(tag.name).toBe("");
    expect(tag.slug).toBe("");
    expect(tag.type).toBe("");
  });
});

describe("createEditorTag", () => {
  const tag: Omit<TagItem, "id"> = { name: "TypeScript", slug: "typescript", type: "tech" };

  it("returns the new document id", async () => {
    addDocMock.mockResolvedValue({ id: "tag-7" });
    expect(await createEditorTag(services, tag)).toBe("tag-7");
  });

  it("writes to tags collection", async () => {
    await createEditorTag(services, tag);
    expect(collectionMock).toHaveBeenCalledWith(mockDb, "tags");
  });

  it("uses provided slug when present", async () => {
    await createEditorTag(services, tag);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("typescript");
  });

  it("generates slug from name when slug is empty", async () => {
    await createEditorTag(services, { ...tag, slug: "" });
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.slug).toBe("typescript");
  });

  it("sets createdBy to uid", async () => {
    await createEditorTag(services, tag);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBe("user-1");
  });

  it("sets createdBy to null when unauthenticated", async () => {
    await createEditorTag(anonServices, tag);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.createdBy).toBeNull();
  });

  it("sets deletedAt to null", async () => {
    await createEditorTag(services, tag);
    const payload = addDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toBeNull();
  });
});

describe("updateEditorTag", () => {
  it("always sets updatedAt and updatedBy", async () => {
    await updateEditorTag(services, "t-1", {});
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("updates all provided fields", async () => {
    await updateEditorTag(services, "t-1", { name: "JS", slug: "js", type: "lang" });
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.name).toBe("JS");
    expect(payload.slug).toBe("js");
    expect(payload.type).toBe("lang");
  });

  it("does not include fields that were not provided", async () => {
    await updateEditorTag(services, "t-1", { name: "Only name" });
    const payload = updateDocMock.mock.calls[0][1];
    expect("slug" in payload).toBe(false);
    expect("type" in payload).toBe(false);
  });

  it("calls updateDoc on tags/<id>", async () => {
    await updateEditorTag(services, "t-99", {});
    expect(docMock).toHaveBeenCalledWith(mockDb, "tags", "t-99");
  });
});

describe("deleteEditorTag", () => {
  it("soft-deletes with deletedAt, updatedAt, and updatedBy", async () => {
    await deleteEditorTag(services, "t-1");
    expect(docMock).toHaveBeenCalledWith(mockDb, "tags", "t-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.deletedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedAt).toEqual({ __sentinel: "server" });
    expect(payload.updatedBy).toBe("user-1");
  });

  it("sets updatedBy to null when unauthenticated", async () => {
    await deleteEditorTag(anonServices, "t-1");
    const payload = updateDocMock.mock.calls[0][1];
    expect(payload.updatedBy).toBeNull();
  });
});
