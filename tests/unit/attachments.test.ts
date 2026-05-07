import { describe, it, expect } from "vitest";
import { attachmentsFromContentItem } from "@/lib/firebase/editorServices";

describe("attachmentsFromContentItem", () => {
  it("returns [] when attachments is undefined", () => {
    expect(attachmentsFromContentItem({})).toEqual([]);
  });

  it("returns [] when attachments is null", () => {
    expect(attachmentsFromContentItem({ attachments: null })).toEqual([]);
  });

  it("returns [] when attachments is not an array", () => {
    expect(attachmentsFromContentItem({ attachments: "oops" })).toEqual([]);
    expect(attachmentsFromContentItem({ attachments: 42 })).toEqual([]);
    expect(attachmentsFromContentItem({ attachments: {} })).toEqual([]);
  });

  it("filters out entries without a url string", () => {
    const result = attachmentsFromContentItem({
      attachments: [{ url: "https://example.com/file.pdf" }, {}, { url: 42 }, null],
    });
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe("https://example.com/file.pdf");
  });

  it("passes through valid entries with all fields", () => {
    const attachment = { id: "a1", url: "https://example.com/doc.pdf", name: "doc.pdf", size: 1024 };
    const result = attachmentsFromContentItem({ attachments: [attachment] });
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(attachment);
  });
});
