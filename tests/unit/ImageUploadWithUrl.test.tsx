/**
 * Unit tests for ImageUploadWithUrl component.
 *
 * Strategy: mock useTenantServices so the component never touches Firebase.
 * The uploadImage mock is a vi.fn() whose resolved/rejected value is
 * controlled per-test.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mock useTenantServices ────────────────────────────────────────────────────

const uploadImageMock = vi.fn();

vi.mock("@/lib/firebase/hooks/useTenantServices", () => ({
  useTenantServices: () => ({ uploadImage: uploadImageMock }),
}));

// ── Component under test (imported AFTER mocks) ───────────────────────────────

import { ImageUploadWithUrl } from "@/components/admin/shared/ImageUploadWithUrl";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFile(name = "avatar.png", type = "image/png", sizeKb = 1): File {
  return new File(["x".repeat(sizeKb * 1024)], name, { type });
}

function makeLargeFile(): File {
  // 11 MB — exceeds the 10 MB limit
  return new File(["x".repeat(11 * 1024 * 1024)], "huge.png", { type: "image/png" });
}

function setup(value = "", onChange = vi.fn()) {
  const utils = render(
    <ImageUploadWithUrl label="Fotoğraf" value={value} onChange={onChange} />,
  );
  return { ...utils, onChange };
}

beforeEach(() => {
  uploadImageMock.mockReset();
});

// ── Render ────────────────────────────────────────────────────────────────────

describe("ImageUploadWithUrl — render", () => {
  it("renders the label", () => {
    setup();
    expect(screen.getByText("Fotoğraf")).toBeInTheDocument();
  });

  it("renders the URL text input", () => {
    setup();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the upload button", () => {
    setup();
    expect(screen.getByRole("button", { name: /yükle/i })).toBeInTheDocument();
  });

  it("shows a preview image when value is a URL", () => {
    setup("https://example.com/img.png");
    const img = screen.getByAltText("Önizleme");
    expect(img).toHaveAttribute("src", "https://example.com/img.png");
  });

  it("does not show preview when value is empty", () => {
    setup("");
    expect(screen.queryByAltText("Önizleme")).not.toBeInTheDocument();
  });
});

// ── Client-side validation ────────────────────────────────────────────────────

describe("ImageUploadWithUrl — client-side validation", () => {
  it("blocks upload and shows error for unsupported MIME type", async () => {
    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    const badFile = new File(["data"], "doc.exe", { type: "application/x-msdownload" });
    fireEvent.change(input, { target: { files: [badFile] } });

    await waitFor(() =>
      expect(screen.getByText(/desteklenmeyen dosya türü/i)).toBeInTheDocument(),
    );
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("blocks upload and shows error when file exceeds 10 MB", async () => {
    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeLargeFile()] } });

    await waitFor(() =>
      expect(screen.getByText(/çok büyük/i)).toBeInTheDocument(),
    );
    expect(uploadImageMock).not.toHaveBeenCalled();
  });
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe("ImageUploadWithUrl — loading state", () => {
  it("shows 'Yükleniyor' and spinner while upload is in progress", async () => {
    // Never resolves — upload hangs
    uploadImageMock.mockImplementation(() => new Promise(() => {}));

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument(),
    );
    // Button is disabled during upload
    expect(screen.getByRole("button", { name: /yükleniyor/i })).toBeDisabled();
  });
});

// ── Successful upload ─────────────────────────────────────────────────────────

describe("ImageUploadWithUrl — successful upload", () => {
  it("calls onChange with the returned download URL", async () => {
    const returnedUrl = "https://storage.example.com/uploads/avatar.png";
    uploadImageMock.mockResolvedValue(returnedUrl);

    const onChange = vi.fn();
    render(<ImageUploadWithUrl label="Fotoğraf" value="" onChange={onChange} />);
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(returnedUrl));
  });

  it("clears the spinner after upload completes", async () => {
    uploadImageMock.mockResolvedValue("https://storage.example.com/img.png");

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(screen.queryByText(/yükleniyor/i)).not.toBeInTheDocument(),
    );
  });

  it("does not show an error message after a successful upload", async () => {
    uploadImageMock.mockResolvedValue("https://storage.example.com/img.png");

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() => expect(uploadImageMock).toHaveBeenCalled());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

// ── Error state ───────────────────────────────────────────────────────────────

describe("ImageUploadWithUrl — error state", () => {
  it("shows a generic error message when Firebase rejects", async () => {
    uploadImageMock.mockRejectedValue(new Error("Firebase error"));

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(screen.getByText(/başarısız/i)).toBeInTheDocument(),
    );
  });

  it("shows 'yetkiniz yok' for storage/unauthorized error", async () => {
    const err = Object.assign(new Error("Unauthorized"), { code: "storage/unauthorized" });
    uploadImageMock.mockRejectedValue(err);

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(screen.getByText(/yetkiniz yok/i)).toBeInTheDocument(),
    );
  });

  it("shows timeout message when upload hangs past 30 s", async () => {
    const err = new Error("[storageUtils] uploadBytes timed out after 30s");
    uploadImageMock.mockRejectedValue(err);

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      expect(screen.getByText(/zaman aşımı/i)).toBeInTheDocument(),
    );
  });

  it("clears the spinner after an error", async () => {
    uploadImageMock.mockRejectedValue(new Error("Firebase error"));

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile()] } });

    await waitFor(() =>
      // spinner text gone, error text present
      expect(screen.queryByText(/^yükleniyor…$/i)).not.toBeInTheDocument(),
    );
  });
});

// ── URL text input ────────────────────────────────────────────────────────────

describe("ImageUploadWithUrl — URL text input", () => {
  it("calls onChange when the user types a URL directly", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ImageUploadWithUrl label="Fotoğraf" value="" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "https://example.com/logo.png");

    expect(onChange).toHaveBeenCalled();
  });

  it("shows a remove button when a preview URL is set", () => {
    setup("https://example.com/img.png");
    // Trash button is present
    expect(screen.getByTitle(/kaldır/i)).toBeInTheDocument();
  });

  it("calls onChange('') when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ImageUploadWithUrl label="Fotoğraf" value="https://example.com/img.png" onChange={onChange} />,
    );
    await user.click(screen.getByTitle(/kaldır/i));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
