import { describe, it, expect, vi, beforeEach } from "vitest";

// All Firebase app factory calls are hoisted so vi.mock can reference them.
const { initializeAppMock, getAppsMock, getAuthMock, getFirestoreMock, getStorageMock } =
  vi.hoisted(() => {
    const fakeApp = { name: "[DEFAULT]" };
    return {
      initializeAppMock: vi.fn(() => fakeApp),
      getAppsMock: vi.fn(() => []),
      getAuthMock: vi.fn(() => ({ __auth: true })),
      getFirestoreMock: vi.fn(() => ({ __db: true })),
      getStorageMock: vi.fn(() => ({ __storage: true })),
    };
  });

vi.mock("firebase/app", () => ({
  initializeApp: initializeAppMock,
  getApps: getAppsMock,
}));
vi.mock("firebase/auth", () => ({ getAuth: getAuthMock }));
vi.mock("firebase/firestore", () => ({ getFirestore: getFirestoreMock }));
vi.mock("firebase/storage", () => ({ getStorage: getStorageMock }));

import { getOrInitTenantApp, type TenantFirebaseConfig } from "@/lib/firebase/clientApp";

const config: TenantFirebaseConfig = {
  apiKey: "key",
  authDomain: "test.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test.appspot.com",
  messagingSenderId: "123",
  appId: "1:123:web:abc",
};

const fakeApp = { name: "[DEFAULT]" };

beforeEach(() => {
  initializeAppMock.mockClear();
  getAppsMock.mockReset();
  getAuthMock.mockClear();
  getFirestoreMock.mockClear();
  getStorageMock.mockClear();
  // Default: no existing apps → will call initializeApp
  getAppsMock.mockReturnValue([]);
  initializeAppMock.mockReturnValue(fakeApp);
});

// ── getOrInitTenantApp ────────────────────────────────────────────────────────

describe("getOrInitTenantApp", () => {
  it("initializes a new app when no [DEFAULT] app exists", () => {
    getAppsMock.mockReturnValue([]);
    getOrInitTenantApp(config);
    expect(initializeAppMock).toHaveBeenCalledWith(config);
  });

  it("reuses the existing [DEFAULT] app without re-initializing", () => {
    getAppsMock.mockReturnValue([fakeApp]);
    getOrInitTenantApp(config);
    expect(initializeAppMock).not.toHaveBeenCalled();
  });

  it("returns auth, db, and storage services", () => {
    getAppsMock.mockReturnValue([]);
    const services = getOrInitTenantApp(config);
    expect(services.auth).toBeDefined();
    expect(services.db).toBeDefined();
    expect(services.storage).toBeDefined();
  });

  it("returns the app itself", () => {
    getAppsMock.mockReturnValue([]);
    const services = getOrInitTenantApp(config);
    expect(services.app).toBe(fakeApp);
  });

  it("calls getAuth, getFirestore, getStorage with the resolved app", () => {
    getAppsMock.mockReturnValue([]);
    getOrInitTenantApp(config);
    expect(getAuthMock).toHaveBeenCalledWith(fakeApp);
    expect(getFirestoreMock).toHaveBeenCalledWith(fakeApp);
    expect(getStorageMock).toHaveBeenCalledWith(fakeApp);
  });
});
