import { vi, beforeEach } from "vitest";

// Default Firebase config mock — individual test files can override via vi.mock()
vi.mock("@/lib/firebase/config", () => ({
  db: { __mock: "db" },
  auth: { currentUser: null },
}));

beforeEach(() => {
  vi.clearAllMocks();
});
