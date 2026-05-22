import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock getOrInitTenantApp so we never touch real Firebase in this test.
const { getOrInitMock } = vi.hoisted(() => ({
  getOrInitMock: vi.fn(),
}));

vi.mock("@/lib/firebase/clientApp", () => ({
  getOrInitTenantApp: getOrInitMock,
}));

// We need to reset the module between tests because getDefaultDb caches `_db`
// in module scope. Re-importing after each reset gives us a fresh singleton.
beforeEach(async () => {
  vi.resetModules();
  getOrInitMock.mockReset();
});

// ── getDefaultDb ──────────────────────────────────────────────────────────────

describe("getDefaultDb", () => {
  it("returns a stub (not throws) when NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "");
    const { getDefaultDb } = await import("@/lib/firebase/getDefaultDb");
    // Should not throw — returns an empty stub so the build doesn't crash
    expect(() => getDefaultDb()).not.toThrow();
    const result = getDefaultDb();
    expect(result).toBeDefined();
    vi.unstubAllEnvs();
  });

  it("calls getOrInitTenantApp with env-var config when projectId is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "my-project");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "my-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "my-project.firebaseapp.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "my-project.appspot.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "999");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "1:999:web:abc");

    const fakeDb = { __db: true };
    getOrInitMock.mockReturnValue({ db: fakeDb });

    const { getDefaultDb } = await import("@/lib/firebase/getDefaultDb");
    const db = getDefaultDb();

    expect(getOrInitMock).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: "my-project", apiKey: "my-key" })
    );
    expect(db).toBe(fakeDb);
    vi.unstubAllEnvs();
  });

  it("returns the same cached instance on repeated calls", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "my-project");
    const fakeDb = { __db: true };
    getOrInitMock.mockReturnValue({ db: fakeDb });

    const { getDefaultDb } = await import("@/lib/firebase/getDefaultDb");
    const first = getDefaultDb();
    const second = getDefaultDb();

    expect(first).toBe(second);
    expect(getOrInitMock).toHaveBeenCalledTimes(1);
    vi.unstubAllEnvs();
  });
});
