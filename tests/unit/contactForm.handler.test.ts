import { describe, it, expect } from "vitest";
import { contactFormToInput, volunteerFormToInput } from "@/lib/validation/forms";
import type { ContactFormValues, VolunteerFormValues } from "@/lib/validation/forms";

// ── contactFormToInput ────────────────────────────────────────────────────────

describe("contactFormToInput", () => {
  const values: ContactFormValues = {
    name: "Ali Veli",
    email: "ali@example.com",
    message: "This is a test message body.",
  };

  it("maps name to senderName", () => {
    expect(contactFormToInput(values).senderName).toBe("Ali Veli");
  });

  it("maps email to senderEmail", () => {
    expect(contactFormToInput(values).senderEmail).toBe("ali@example.com");
  });

  it("maps message to messageBody", () => {
    expect(contactFormToInput(values).messageBody).toBe("This is a test message body.");
  });

  it("sets a fixed subject", () => {
    expect(contactFormToInput(values).subject).toBe("Web Sitesi İletişim Formu");
  });

  it("converts empty-string phone to undefined", () => {
    expect(contactFormToInput({ ...values, phone: "" }).senderPhone).toBeUndefined();
  });

  it("keeps non-empty phone string", () => {
    expect(contactFormToInput({ ...values, phone: "+90 555 000 00 00" }).senderPhone).toBe(
      "+90 555 000 00 00"
    );
  });
});

// ── volunteerFormToInput ──────────────────────────────────────────────────────

describe("volunteerFormToInput", () => {
  const values: VolunteerFormValues = {
    fullName: "Ayşe Kaya",
    email: "ayse@example.com",
    motivation: "I want to help the community.",
  };

  it("converts empty-string city to undefined", () => {
    expect(volunteerFormToInput({ ...values, city: "" }).city).toBeUndefined();
  });

  it("converts empty-string phone to undefined", () => {
    expect(volunteerFormToInput({ ...values, phone: "" }).phone).toBeUndefined();
  });

  it("passes fullName through", () => {
    expect(volunteerFormToInput(values).fullName).toBe("Ayşe Kaya");
  });

  it("passes email through", () => {
    expect(volunteerFormToInput(values).email).toBe("ayse@example.com");
  });

  it("passes motivation through", () => {
    expect(volunteerFormToInput(values).motivation).toBe("I want to help the community.");
  });

  it("passes non-empty city through", () => {
    expect(volunteerFormToInput({ ...values, city: "İstanbul" }).city).toBe("İstanbul");
  });

  it("passes non-empty phone through", () => {
    expect(volunteerFormToInput({ ...values, phone: "+90 555 111 22 33" }).phone).toBe(
      "+90 555 111 22 33"
    );
  });
});
