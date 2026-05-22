import { describe, it, expect, vi, beforeEach } from "vitest";

const { refMock, uploadBytesMock, getDownloadURLMock, deleteObjectMock } = vi.hoisted(() => ({
  refMock: vi.fn((_storage: unknown, path: string) => ({ __path: path })),
  uploadBytesMock: vi.fn(),
  getDownloadURLMock: vi.fn(),
  deleteObjectMock: vi.fn(),
}));

vi.mock("firebase/storage", () => ({
  ref: refMock,
  uploadBytes: uploadBytesMock,
  getDownloadURL: getDownloadURLMock,
  deleteObject: deleteObjectMock,
}));

import { uploadImage, deleteImageByUrl } from "@/lib/firebase/storageUtils";
import type { FirebaseStorage } from "firebase/storage";

const mockStorage = {} as FirebaseStorage;

function makeFile(name = "photo.jpg", type = "image/jpeg"): File {
  return new File(["data"], name, { type });
}

beforeEach(() => {
  refMock.mockClear();
  uploadBytesMock.mockReset();
  getDownloadURLMock.mockReset();
  deleteObjectMock.mockReset();
  uploadBytesMock.mockResolvedValue(undefined);
  getDownloadURLMock.mockResolvedValue("https://example.com/photo.jpg");
});

// ── uploadImage ───────────────────────────────────────────────────────────────

describe("uploadImage", () => {
  it("returns the download URL from Firebase", async () => {
    getDownloadURLMock.mockResolvedValue("https://cdn.example.com/img.jpg");
    const url = await uploadImage(mockStorage, makeFile());
    expect(url).toBe("https://cdn.example.com/img.jpg");
  });

  it("uploads to public/uploads/ path", async () => {
    await uploadImage(mockStorage, makeFile("test.png", "image/png"));
    const path: string = refMock.mock.calls[0][1];
    expect(path).toMatch(/^public\/uploads\/.+/);
  });

  it("preserves the file extension in the generated name", async () => {
    await uploadImage(mockStorage, makeFile("document.pdf", "application/pdf"));
    const path: string = refMock.mock.calls[0][1];
    expect(path).toMatch(/\.pdf$/);
  });

  it("uses the full filename as extension when there is no dot in the name", async () => {
    // "noextension".split(".").pop() === "noextension" — the whole name becomes the ext
    await uploadImage(mockStorage, makeFile("noextension", "application/octet-stream"));
    const path: string = refMock.mock.calls[0][1];
    expect(path).toMatch(/\.noextension$/);
  });

  it("passes contentType to uploadBytes", async () => {
    await uploadImage(mockStorage, makeFile("img.jpg", "image/jpeg"));
    const metadata = uploadBytesMock.mock.calls[0][2];
    expect(metadata.contentType).toBe("image/jpeg");
  });

  it("generates a unique name on each call", async () => {
    await uploadImage(mockStorage, makeFile());
    await uploadImage(mockStorage, makeFile());
    const path1: string = refMock.mock.calls[0][1];
    const path2: string = refMock.mock.calls[1][1];
    expect(path1).not.toBe(path2);
  });
});

// ── deleteImageByUrl ──────────────────────────────────────────────────────────

describe("deleteImageByUrl", () => {
  it("calls deleteObject with a ref built from the url", async () => {
    deleteObjectMock.mockResolvedValue(undefined);
    await deleteImageByUrl(mockStorage, "https://example.com/img.jpg");
    expect(deleteObjectMock).toHaveBeenCalledTimes(1);
    expect(refMock).toHaveBeenCalledWith(mockStorage, "https://example.com/img.jpg");
  });

  it("does not throw when deleteObject rejects (file already gone)", async () => {
    deleteObjectMock.mockRejectedValue(new Error("not-found"));
    await expect(deleteImageByUrl(mockStorage, "https://example.com/gone.jpg")).resolves.toBeUndefined();
  });

  it("does not throw on an empty url string", async () => {
    deleteObjectMock.mockRejectedValue(new Error("invalid"));
    await expect(deleteImageByUrl(mockStorage, "")).resolves.toBeUndefined();
  });
});
