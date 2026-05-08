import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/firebase/editorServices";

describe("slugify", () => {
  it("lowercases ASCII", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("maps Turkish lowercase chars", () => {
    expect(slugify("çğıöşü")).toBe("cgiosu");
  });

  it("maps Turkish uppercase chars", () => {
    expect(slugify("ÇĞİÖŞÜ")).toBe("cgiosu");
  });

  it("strips punctuation and symbols", () => {
    expect(slugify("Hello, World!?")).toBe("hello-world");
  });

  it("collapses multiple spaces into single hyphen", () => {
    expect(slugify("a   b   c")).toBe("a-b-c");
  });

  it("collapses repeated hyphens", () => {
    expect(slugify("a -- b")).toBe("a-b");
  });

  it("trims leading and trailing whitespace before hyphenation", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("truncates to 80 chars", () => {
    expect(slugify("a".repeat(120))).toHaveLength(80);
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns empty string for input with only symbols", () => {
    expect(slugify("!!!@@@")).toBe("");
  });

  it("handles mixed Turkish and ASCII", () => {
    expect(slugify("İstanbul Şehri 2025")).toBe("istanbul-sehri-2025");
  });

  it("keeps digits in output", () => {
    expect(slugify("Plan 2025")).toBe("plan-2025");
  });

  // Edge cases
  it("removes emojis and cyrillic characters", () => {
    expect(slugify("Hello 🌍 Привет")).toBe("hello");
  });

  it("handles newlines and tabs as separators", () => {
    expect(slugify("a\nb\tc")).toBe("a-b-c");
  });

  it("does not leave a trailing hyphen if stripped exactly at a hyphen or due to truncation", () => {
    // Depending on the exact slugify implementation, it either trims trailing hyphens after truncation or truncates right on it
    const input = "a".repeat(79) + "-b";
    expect(slugify(input).endsWith("-")).toBe(false);
  });
});
