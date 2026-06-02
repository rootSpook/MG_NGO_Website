import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock server-only so the import doesn't crash in the test environment ──────
vi.mock("server-only", () => ({}));

// ── Hoist all admin SDK mocks ─────────────────────────────────────────────────
const { initializeAppMock, certMock, getAppsMock, getAppMock, getFirestoreMock } =
  vi.hoisted(() => {
    const fakeApp = { name: "master" };
    return {
      initializeAppMock: vi.fn(() => fakeApp),
      certMock: vi.fn((cred) => cred),
      getAppsMock: vi.fn(() => []),
      getAppMock: vi.fn(() => { throw new Error("no app"); }),
      getFirestoreMock: vi.fn(),
    };
  });

vi.mock("firebase-admin/app", () => ({
  initializeApp: initializeAppMock,
  cert: certMock,
  getApps: getAppsMock,
  getApp: getAppMock,
}));

vi.mock("firebase-admin/firestore", () => ({
  getFirestore: getFirestoreMock,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFirestoreWithTenant(data: object | null) {
  const docSnap = { exists: data !== null, data: () => data };
  const snapObj = { empty: data === null, docs: data !== null ? [{ data: () => data }] : [] };
  const whereFn = vi.fn().mockReturnThis();
  const limitFn = vi.fn().mockReturnThis();
  const getFn = vi.fn().mockResolvedValue(snapObj);
  const docFn = vi.fn().mockReturnValue({ get: vi.fn().mockResolvedValue(docSnap) });
  return {
    collection: vi.fn().mockReturnValue({ where: whereFn, limit: limitFn, get: getFn, doc: docFn }),
  };
}

const fakeApp = { name: "master" };

beforeEach(() => {
  vi.resetModules();
  initializeAppMock.mockClear().mockReturnValue(fakeApp);
  certMock.mockClear();
  getAppsMock.mockReset().mockReturnValue([]);
  getAppMock.mockReset().mockImplementation(() => { throw new Error("no app"); });
  getFirestoreMock.mockReset();
  vi.unstubAllEnvs();
});

// ── getMasterAdminApp (via getTenantByDomain) ─────────────────────────────────

describe("getMasterAdminApp (internal — tested via public functions)", () => {
  it("throws a descriptive error when FIREBASE_MASTER_* vars are missing", async () => {
    vi.stubEnv("FIREBASE_MASTER_PROJECT_ID", "");
    vi.stubEnv("FIREBASE_MASTER_CLIENT_EMAIL", "");
    vi.stubEnv("FIREBASE_MASTER_PRIVATE_KEY", "");

    const { getTenantByDomain } = await import("@/lib/tenant/masterDb");
    await expect(getTenantByDomain("localhost")).rejects.toThrow(/FIREBASE_MASTER_PROJECT_ID/);
  });

  it("initializes the admin app with cert credentials", async () => {
    vi.stubEnv("FIREBASE_MASTER_PROJECT_ID", "master-proj");
    vi.stubEnv("FIREBASE_MASTER_CLIENT_EMAIL", "sa@master-proj.iam.gserviceaccount.com");
    vi.stubEnv("FIREBASE_MASTER_PRIVATE_KEY", "-----BEGIN RSA PRIVATE KEY-----\\nABC\\n-----END RSA PRIVATE KEY-----\\n");

    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(null));

    const { getTenantByDomain } = await import("@/lib/tenant/masterDb");
    await getTenantByDomain("localhost");

    expect(certMock).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: "master-proj" })
    );
    expect(initializeAppMock).toHaveBeenCalledWith(
      expect.objectContaining({ credential: expect.anything() }),
      "master"
    );
  });

  it("reuses the existing master app without re-initializing", async () => {
    vi.stubEnv("FIREBASE_MASTER_PROJECT_ID", "master-proj");
    vi.stubEnv("FIREBASE_MASTER_CLIENT_EMAIL", "sa@x.iam.gserviceaccount.com");
    vi.stubEnv("FIREBASE_MASTER_PRIVATE_KEY", "key");

    // getApp succeeds → app already exists
    getAppMock.mockReturnValue(fakeApp);
    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(null));

    const { getTenantByDomain } = await import("@/lib/tenant/masterDb");
    await getTenantByDomain("localhost");

    expect(initializeAppMock).not.toHaveBeenCalled();
  });

  it("replaces \\n escape sequences in the private key", async () => {
    vi.stubEnv("FIREBASE_MASTER_PROJECT_ID", "p");
    vi.stubEnv("FIREBASE_MASTER_CLIENT_EMAIL", "e");
    vi.stubEnv("FIREBASE_MASTER_PRIVATE_KEY", "line1\\nline2");

    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(null));

    const { getTenantByDomain } = await import("@/lib/tenant/masterDb");
    await getTenantByDomain("localhost");

    const cred = certMock.mock.calls[0][0];
    expect(cred.privateKey).toBe("line1\nline2");
  });
});

// ── getTenantByDomain ─────────────────────────────────────────────────────────

describe("getTenantByDomain", () => {
  function stubEnvs() {
    vi.stubEnv("FIREBASE_MASTER_PROJECT_ID", "p");
    vi.stubEnv("FIREBASE_MASTER_CLIENT_EMAIL", "e");
    vi.stubEnv("FIREBASE_MASTER_PRIVATE_KEY", "k");
  }

  it("returns null when no tenant matches the domain", async () => {
    stubEnvs();
    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(null));

    const { getTenantByDomain } = await import("@/lib/tenant/masterDb");
    const result = await getTenantByDomain("unknown.example.com");
    expect(result).toBeNull();
  });

  it("returns the tenant record when a match is found", async () => {
    stubEnvs();
    const record = { tenantId: "ngo-1", domains: ["ngo.example.com"], firebaseConfig: {} };
    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(record));

    const { getTenantByDomain } = await import("@/lib/tenant/masterDb");
    const result = await getTenantByDomain("ngo.example.com");
    expect(result).toEqual(record);
  });
});

// ── getTenantById ─────────────────────────────────────────────────────────────

describe("getTenantById", () => {
  function stubEnvs() {
    vi.stubEnv("FIREBASE_MASTER_PROJECT_ID", "p");
    vi.stubEnv("FIREBASE_MASTER_CLIENT_EMAIL", "e");
    vi.stubEnv("FIREBASE_MASTER_PRIVATE_KEY", "k");
  }

  it("returns null when the tenantId document does not exist", async () => {
    stubEnvs();
    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(null));

    const { getTenantById } = await import("@/lib/tenant/masterDb");
    const result = await getTenantById("nonexistent");
    expect(result).toBeNull();
  });

  it("returns the tenant record when the document exists", async () => {
    stubEnvs();
    const record = { tenantId: "ngo-2", domains: ["x.com"], firebaseConfig: {} };
    getFirestoreMock.mockReturnValue(makeFirestoreWithTenant(record));

    const { getTenantById } = await import("@/lib/tenant/masterDb");
    const result = await getTenantById("ngo-2");
    expect(result).toEqual(record);
  });
});

// ── isMasterAppInitialized ────────────────────────────────────────────────────

describe("isMasterAppInitialized", () => {
  it("returns false when no apps are initialized", async () => {
    getAppsMock.mockReturnValue([]);
    const { isMasterAppInitialized } = await import("@/lib/tenant/masterDb");
    expect(isMasterAppInitialized()).toBe(false);
  });

  it("returns true when an app named 'master' exists", async () => {
    getAppsMock.mockReturnValue([{ name: "master" }]);
    const { isMasterAppInitialized } = await import("@/lib/tenant/masterDb");
    expect(isMasterAppInitialized()).toBe(true);
  });

  it("returns false when only the [DEFAULT] app exists", async () => {
    getAppsMock.mockReturnValue([{ name: "[DEFAULT]" }]);
    const { isMasterAppInitialized } = await import("@/lib/tenant/masterDb");
    expect(isMasterAppInitialized()).toBe(false);
  });
});
