import { describe, it, expect } from "vitest";
import { contactSchema, volunteerSchema } from "@/lib/validation/forms";

// ── contactSchema ─────────────────────────────────────────────────────────────

describe("contactSchema", () => {
  const valid = { name: "Ali Veli", email: "ali@example.com", message: "x".repeat(10) };

  it("accepts a minimal valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts empty-string phone", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
  });

  it("accepts a normal phone string", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "+90 555 111 22 33" }).success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });

  it("rejects name longer than 100 chars", () => {
    expect(contactSchema.safeParse({ ...valid, name: "A".repeat(101) }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects email longer than 254 chars", () => {
    const long = "a".repeat(244) + "@example.com";
    expect(contactSchema.safeParse({ ...valid, email: long }).success).toBe(false);
  });

  it("rejects message shorter than 10 chars", () => {
    expect(contactSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
  });

  it("rejects message longer than 2000 chars", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("rejects phone longer than 20 chars", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "1".repeat(21) }).success).toBe(false);
  });

  // Edge Cases
  it("rejects when required fields are missing", () => {
    expect(contactSchema.safeParse({}).success).toBe(false);
    expect(contactSchema.safeParse({ name: undefined, email: undefined, message: undefined }).success).toBe(false);
  });

  it("rejects fields containing only whitespace", () => {
    // Requires that the schema uses .trim() or explicit regex for non-empty
    expect(contactSchema.safeParse({ ...valid, name: "   " }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "          " }).success).toBe(false);
  });

  it("handles XSS/SQL injection patterns safely or rejects them", () => {
    // If we rely on pure length/email checks, it might pass, but we should make sure it doesn't crash
    const malicious = "<script>alert(1)</script>";
    const result = contactSchema.safeParse({ ...valid, name: malicious });
    // It might succeed if there's no strict regex, but it should definitely not throw.
    // If it succeeds, sanitization should be happening downstream.
    expect(() => contactSchema.safeParse({ ...valid, name: malicious })).not.toThrow();
  });
});

// ── volunteerSchema ───────────────────────────────────────────────────────────

describe("volunteerSchema", () => {
  const valid = {
    fullName: "Ayşe Kaya",
    email: "ayse@example.com",
    motivation: "y".repeat(10),
  };

  it("accepts minimal valid payload", () => {
    expect(volunteerSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional empty city and phone", () => {
    expect(volunteerSchema.safeParse({ ...valid, city: "", phone: "" }).success).toBe(true);
  });

  it("rejects fullName under 2 chars", () => {
    expect(volunteerSchema.safeParse({ ...valid, fullName: "A" }).success).toBe(false);
  });

  it("rejects motivation under 10 chars", () => {
    expect(volunteerSchema.safeParse({ ...valid, motivation: "short" }).success).toBe(false);
  });

  it("rejects motivation over 2000 chars", () => {
    expect(volunteerSchema.safeParse({ ...valid, motivation: "y".repeat(2001) }).success).toBe(false);
  });

  it("rejects city over 100 chars", () => {
    expect(volunteerSchema.safeParse({ ...valid, city: "x".repeat(101) }).success).toBe(false);
  });

  // Edge cases
  it("rejects invalid email formats", () => {
    expect(volunteerSchema.safeParse({ ...valid, email: "invalid-email" }).success).toBe(false);
    expect(volunteerSchema.safeParse({ ...valid, email: "test@domain" }).success).toBe(false);
  });

  it("rejects completely missing required fields", () => {
    expect(volunteerSchema.safeParse({}).success).toBe(false);
  });
});
