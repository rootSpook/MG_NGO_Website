import { describe, it, expect, vi, beforeEach } from "vitest";

const { getDocMock, setDocMock, docMock, collectionMock } = vi.hoisted(() => ({
  getDocMock: vi.fn(),
  setDocMock: vi.fn(),
  docMock: vi.fn((_db: unknown, col: string, id: string) => ({ __ref: `${col}/${id}` })),
  collectionMock: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getDoc: getDocMock,
  setDoc: setDocMock,
  doc: docMock,
  collection: collectionMock,
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

import {
  getNavConfig,
  saveNavConfig,
  createNavItem,
  deleteNavItem,
  patchNavItem,
  DEFAULT_NAV_ITEMS,
  type NavItem,
} from "@/lib/firebase/navServices";
import type { Firestore } from "firebase/firestore";

const mockDb = {} as Firestore;

const makeItem = (overrides: Partial<NavItem> = {}): NavItem => ({
  key: "test",
  href: "/test",
  label: "Test",
  isVisible: true,
  sortOrder: 1,
  pageSlug: null,
  pageType: "special",
  ...overrides,
});

function makeSnap(exists: boolean, data?: object) {
  return { exists: () => exists, data: () => data ?? {} };
}

beforeEach(() => {
  getDocMock.mockReset();
  setDocMock.mockReset();
  docMock.mockClear();
  setDocMock.mockResolvedValue(undefined);
});

// ── getNavConfig ──────────────────────────────────────────────────────────────

describe("getNavConfig", () => {
  it("returns DEFAULT_NAV_ITEMS when doc does not exist", async () => {
    getDocMock.mockResolvedValue(makeSnap(false));
    const result = await getNavConfig(mockDb);
    expect(result).toEqual(DEFAULT_NAV_ITEMS);
  });

  it("returns DEFAULT_NAV_ITEMS when doc exists but items is empty", async () => {
    getDocMock.mockResolvedValue(makeSnap(true, { items: [] }));
    const result = await getNavConfig(mockDb);
    expect(result).toEqual(DEFAULT_NAV_ITEMS);
  });

  it("returns sorted items from Firestore when present", async () => {
    const items: NavItem[] = [
      makeItem({ key: "b", sortOrder: 2 }),
      makeItem({ key: "a", sortOrder: 1 }),
    ];
    getDocMock.mockResolvedValue(makeSnap(true, { items }));
    const result = await getNavConfig(mockDb);
    expect(result[0].key).toBe("a");
    expect(result[1].key).toBe("b");
  });

  it("returns DEFAULT_NAV_ITEMS on Firestore error", async () => {
    getDocMock.mockRejectedValue(new Error("network error"));
    const result = await getNavConfig(mockDb);
    expect(result).toEqual(DEFAULT_NAV_ITEMS);
  });

  it("reads from the settings/navigation document", async () => {
    getDocMock.mockResolvedValue(makeSnap(false));
    await getNavConfig(mockDb);
    expect(docMock).toHaveBeenCalledWith(mockDb, "settings", "navigation");
  });
});

// ── saveNavConfig ─────────────────────────────────────────────────────────────

describe("saveNavConfig", () => {
  it("calls setDoc with merge: true", async () => {
    const items = [makeItem()];
    await saveNavConfig(mockDb, items);
    expect(setDocMock).toHaveBeenCalledWith(
      expect.anything(),
      { items },
      { merge: true }
    );
  });

  it("writes to settings/navigation", async () => {
    await saveNavConfig(mockDb, []);
    expect(docMock).toHaveBeenCalledWith(mockDb, "settings", "navigation");
  });
});

// ── createNavItem ─────────────────────────────────────────────────────────────

describe("createNavItem", () => {
  it("appends item with sortOrder = max + 1", async () => {
    const existing = [makeItem({ key: "a", sortOrder: 3 }), makeItem({ key: "b", sortOrder: 1 })];
    getDocMock.mockResolvedValue(makeSnap(true, { items: existing }));

    const newItem = makeItem({ key: "c", sortOrder: 0 });
    await createNavItem(mockDb, newItem);

    const saved = setDocMock.mock.calls[0][1] as { items: NavItem[] };
    const added = saved.items.find((i) => i.key === "c");
    expect(added?.sortOrder).toBe(4);
  });

  it("gives sortOrder 1 to the first item when list is empty", async () => {
    getDocMock.mockResolvedValue(makeSnap(false));

    const newItem = makeItem({ key: "first", sortOrder: 0 });
    await createNavItem(mockDb, newItem);

    const saved = setDocMock.mock.calls[0][1] as { items: NavItem[] };
    expect(saved.items[0].sortOrder).toBe(1);
  });
});

// ── deleteNavItem ─────────────────────────────────────────────────────────────

describe("deleteNavItem", () => {
  it("removes item by key and re-numbers sortOrder", async () => {
    const existing = [
      makeItem({ key: "a", sortOrder: 1 }),
      makeItem({ key: "b", sortOrder: 2 }),
      makeItem({ key: "c", sortOrder: 3 }),
    ];
    getDocMock.mockResolvedValue(makeSnap(true, { items: existing }));

    await deleteNavItem(mockDb, "b");

    const saved = setDocMock.mock.calls[0][1] as { items: NavItem[] };
    expect(saved.items).toHaveLength(2);
    expect(saved.items.find((i) => i.key === "b")).toBeUndefined();
    expect(saved.items.map((i) => i.sortOrder)).toEqual([1, 2]);
  });

  it("is a no-op when key does not exist", async () => {
    const existing = [makeItem({ key: "a", sortOrder: 1 })];
    getDocMock.mockResolvedValue(makeSnap(true, { items: existing }));

    await deleteNavItem(mockDb, "nonexistent");

    const saved = setDocMock.mock.calls[0][1] as { items: NavItem[] };
    expect(saved.items).toHaveLength(1);
  });
});

// ── patchNavItem ──────────────────────────────────────────────────────────────

describe("patchNavItem", () => {
  it("merges patch into the matching item", async () => {
    const existing = [
      makeItem({ key: "a", isVisible: true }),
      makeItem({ key: "b", isVisible: true }),
    ];
    getDocMock.mockResolvedValue(makeSnap(true, { items: existing }));

    await patchNavItem(mockDb, "a", { isVisible: false });

    const saved = setDocMock.mock.calls[0][1] as { items: NavItem[] };
    expect(saved.items.find((i) => i.key === "a")?.isVisible).toBe(false);
    expect(saved.items.find((i) => i.key === "b")?.isVisible).toBe(true);
  });

  it("leaves other items unchanged", async () => {
    const existing = [makeItem({ key: "a", label: "Old" }), makeItem({ key: "b" })];
    getDocMock.mockResolvedValue(makeSnap(true, { items: existing }));

    await patchNavItem(mockDb, "a", { label: "New" });

    const saved = setDocMock.mock.calls[0][1] as { items: NavItem[] };
    expect(saved.items.find((i) => i.key === "b")?.label).toBe("Test");
  });
});
