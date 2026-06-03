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

function makeFile(name = "photo.jpg", type = "image/jpeg", sizeBytes = 100): File {
  const content = "x".repeat(sizeBytes);
  return new File([content], name, { type });
}

beforeEach(() => {
  vi.useRealTimers();
  refMock.mockClear();
  uploadBytesMock.mockReset();
  getDownloadURLMock.mockReset();
  deleteObjectMock.mockReset();
  uploadBytesMock.mockResolvedValue(undefined);
  getDownloadURLMock.mockResolvedValue("https://example.com/photo.jpg");
});

// ── uploadImage — happy path ──────────────────────────────────────────────────

describe("uploadImage — happy path", () => {
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

  it("falls back to 'bin' extension when filename has no dot", async () => {
    await uploadImage(mockStorage, makeFile("noextension", "application/octet-stream"));
    const path: string = refMock.mock.calls[0][1];
    // "noextension".split(".").pop() === "noextension" — whole name becomes ext
    expect(path).toMatch(/\.noextension$/);
  });

  it("passes contentType metadata to uploadBytes", async () => {
    await uploadImage(mockStorage, makeFile("img.jpg", "image/jpeg"));
    const metadata = uploadBytesMock.mock.calls[0][2];
    expect(metadata.contentType).toBe("image/jpeg");
  });

  it("generates a unique storage path on every call", async () => {
    await uploadImage(mockStorage, makeFile());
    await uploadImage(mockStorage, makeFile());
    const path1: string = refMock.mock.calls[0][1];
    const path2: string = refMock.mock.calls[1][1];
    expect(path1).not.toBe(path2);
  });
});

// ── uploadImage — Firebase error propagation ──────────────────────────────────

describe("uploadImage — Firebase errors", () => {
  it("propagates storage/unauthorized from uploadBytes", async () => {
    const err = Object.assign(new Error("Unauthorized"), { code: "storage/unauthorized" });
    uploadBytesMock.mockRejectedValue(err);
    await expect(uploadImage(mockStorage, makeFile())).rejects.toMatchObject({
      code: "storage/unauthorized",
    });
  });

  it("propagates storage/quota-exceeded from uploadBytes", async () => {
    const err = Object.assign(new Error("Quota exceeded"), { code: "storage/quota-exceeded" });
    uploadBytesMock.mockRejectedValue(err);
    await expect(uploadImage(mockStorage, makeFile())).rejects.toMatchObject({
      code: "storage/quota-exceeded",
    });
  });

  it("propagates errors from getDownloadURL even when upload succeeds", async () => {
    uploadBytesMock.mockResolvedValue(undefined);
    getDownloadURLMock.mockRejectedValue(new Error("URL fetch failed"));
    await expect(uploadImage(mockStorage, makeFile())).rejects.toThrow("URL fetch failed");
  });
});

// ── uploadImage — timeout ─────────────────────────────────────────────────────

describe("uploadImage — timeout", () => {
  it("rejects with a timeout error when uploadBytes never resolves (fake timers)", async () => {
    vi.useFakeTimers();

    // uploadBytes hangs indefinitely
    uploadBytesMock.mockImplementation(() => new Promise(() => {}));

    const uploadPromise = uploadImage(mockStorage, makeFile());

    // Advance clock past the 30 s internal timeout
    vi.advanceTimersByTime(30_001);

    await expect(uploadPromise).rejects.toThrow(/timed out/i);

    vi.useRealTimers();
  });

  it("rejects with a timeout error when getDownloadURL never resolves (fake timers)", async () => {
    vi.useFakeTimers();

    uploadBytesMock.mockResolvedValue(undefined);
    // getDownloadURL hangs indefinitely
    getDownloadURLMock.mockImplementation(() => new Promise(() => {}));

    const uploadPromise = uploadImage(mockStorage, makeFile());

    vi.advanceTimersByTime(30_001);

    await expect(uploadPromise).rejects.toThrow(/timed out/i);

    vi.useRealTimers();
  });

  it("succeeds when upload completes within 30 s", async () => {
    vi.useFakeTimers();

    uploadBytesMock.mockImplementation(
      () => new Promise((res) => setTimeout(res, 1_000)),
    );
    getDownloadURLMock.mockResolvedValue("https://ok.example.com/img.jpg");

    const uploadPromise = uploadImage(mockStorage, makeFile());

    vi.advanceTimersByTime(1_001);

    await expect(uploadPromise).resolves.toBe("https://ok.example.com/img.jpg");

    vi.useRealTimers();
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
    await expect(
      deleteImageByUrl(mockStorage, "https://example.com/gone.jpg"),
    ).resolves.toBeUndefined();
  });

  it("does not throw on an empty url string", async () => {
    deleteObjectMock.mockRejectedValue(new Error("invalid"));
    await expect(deleteImageByUrl(mockStorage, "")).resolves.toBeUndefined();
  });
});
