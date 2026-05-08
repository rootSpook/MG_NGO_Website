import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { tsToDateString, tsToISOString } from "@/lib/firebase/editorServices";
import type { Timestamp } from "firebase/firestore";

const makeTs = (iso: string): Timestamp =>
  ({ toDate: () => new Date(iso) }) as unknown as Timestamp;

const FIXED_NOW = "2026-05-07T10:00:00.000Z";

describe("tsToDateString", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_NOW));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it("formats a Timestamp to YYYY-MM-DD", () => {
    expect(tsToDateString(makeTs("2025-03-04T12:34:56Z"))).toBe("2025-03-04");
  });

  it("returns today's date for null", () => {
    expect(tsToDateString(null)).toBe("2026-05-07");
  });

  it("returns today's date for undefined", () => {
    expect(tsToDateString(undefined)).toBe("2026-05-07");
  });

  // Edge cases
  it("throws when the provided object lacks a toDate method", () => {
    const invalidTs = { seconds: 12345 } as unknown as Timestamp;
    expect(() => tsToDateString(invalidTs)).toThrow();
  });

  it("handles extreme past dates", () => {
    expect(tsToDateString(makeTs("1800-01-01T12:00:00Z"))).toBe("1800-01-01");
  });

  it("handles leap year dates", () => {
    expect(tsToDateString(makeTs("2024-02-29T10:00:00Z"))).toBe("2024-02-29");
  });
});

describe("tsToISOString", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_NOW));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it("returns full ISO from a Timestamp", () => {
    expect(tsToISOString(makeTs("2025-03-04T12:34:56.000Z"))).toBe(
      "2025-03-04T12:34:56.000Z"
    );
  });

  it("returns current ISO string for null", () => {
    expect(tsToISOString(null)).toBe(FIXED_NOW);
  });

  it("returns current ISO string for undefined", () => {
    expect(tsToISOString(undefined)).toBe(FIXED_NOW);
  });

  // Edge cases
  it("throws if toDate is not a function", () => {
    const invalidTs = { seconds: 12345 } as unknown as Timestamp;
    expect(() => tsToISOString(invalidTs)).toThrow();
  });

  it("handles extreme future dates well", () => {
    expect(tsToISOString(makeTs("2200-12-31T23:59:59.000Z"))).toBe("2200-12-31T23:59:59.000Z");
  });
});
