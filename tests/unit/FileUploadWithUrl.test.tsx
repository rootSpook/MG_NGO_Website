/**
 * Unit tests for FileUploadWithUrl component.
 *
 * Same mock strategy as ImageUploadWithUrl: useTenantServices is stubbed so
 * no real Firebase calls are made.
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

import { FileUploadWithUrl } from "@/components/admin/shared/FileUploadWithUrl";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePdf(name = "report.pdf", sizeKb = 100): File {
  return new File(["x".repeat(sizeKb * 1024)], name, { type: "application/pdf" });
}

function makeLargePdf(): File {
  return new File(["x".repeat(11 * 1024 * 1024)], "huge.pdf", { type: "application/pdf" });
}

function setup(value = "", onChange = vi.fn()) {
  const utils = render(
    <FileUploadWithUrl label="Rapor PDF" value={value} onChange={onChange} />,
  );
  return { ...utils, onChange };
}

beforeEach(() => {
  uploadImageMock.mockReset();
});

// ── Render ────────────────────────────────────────────────────────────────────

describe("FileUploadWithUrl — render", () => {
  it("renders the label", () => {
    setup();
    expect(screen.getByText("Rapor PDF")).toBeInTheDocument();
  });

  it("renders the URL text input", () => {
    setup();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders the upload button", () => {
    setup();
    expect(screen.getByRole("button", { name: /yükle/i })).toBeInTheDocument();
  });

  it("shows file preview row when value is set", () => {
    setup("https://storage.example.com/report.pdf");
    expect(screen.getByText("https://storage.example.com/report.pdf")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /görüntüle/i })).toBeInTheDocument();
  });

  it("does not show preview when value is empty", () => {
    setup("");
    expect(screen.queryByRole("link", { name: /görüntüle/i })).not.toBeInTheDocument();
  });
});

// ── Client-side validation ────────────────────────────────────────────────────

describe("FileUploadWithUrl — client-side validation", () => {
  it("blocks upload and shows error when file exceeds 10 MB", async () => {
    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeLargePdf()] } });

    await waitFor(() =>
      expect(screen.getByText(/çok büyük/i)).toBeInTheDocument(),
    );
    expect(uploadImageMock).not.toHaveBeenCalled();
  });
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe("FileUploadWithUrl — loading state", () => {
  it("shows 'Yükleniyor' while upload is in progress", async () => {
    uploadImageMock.mockImplementation(() => new Promise(() => {}));

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() =>
      expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: /yükleniyor/i })).toBeDisabled();
  });
});

// ── Successful upload ─────────────────────────────────────────────────────────

describe("FileUploadWithUrl — successful upload", () => {
  it("calls onChange with the returned download URL", async () => {
    const returnedUrl = "https://storage.example.com/uploads/report.pdf";
    uploadImageMock.mockResolvedValue(returnedUrl);

    const onChange = vi.fn();
    render(<FileUploadWithUrl label="Rapor PDF" value="" onChange={onChange} />);
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(returnedUrl));
  });

  it("clears the spinner after upload completes", async () => {
    uploadImageMock.mockResolvedValue("https://storage.example.com/report.pdf");

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() =>
      expect(screen.queryByText(/^yükleniyor…$/i)).not.toBeInTheDocument(),
    );
  });
});

// ── Error state ───────────────────────────────────────────────────────────────

describe("FileUploadWithUrl — error state", () => {
  it("shows a generic error message when Firebase rejects", async () => {
    uploadImageMock.mockRejectedValue(new Error("Firebase error"));

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() =>
      expect(screen.getByText(/başarısız/i)).toBeInTheDocument(),
    );
  });

  it("shows 'yetkiniz yok' for storage/unauthorized", async () => {
    const err = Object.assign(new Error("Unauthorized"), { code: "storage/unauthorized" });
    uploadImageMock.mockRejectedValue(err);

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() =>
      expect(screen.getByText(/yetkiniz yok/i)).toBeInTheDocument(),
    );
  });

  it("shows timeout message when storageUtils timeout fires", async () => {
    const err = new Error("[storageUtils] uploadBytes timed out after 30s");
    uploadImageMock.mockRejectedValue(err);

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() =>
      expect(screen.getByText(/zaman aşımı/i)).toBeInTheDocument(),
    );
  });

  it("clears the spinner after an error", async () => {
    uploadImageMock.mockRejectedValue(new Error("Firebase error"));

    setup();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makePdf()] } });

    await waitFor(() =>
      expect(screen.queryByText(/^yükleniyor…$/i)).not.toBeInTheDocument(),
    );
  });
});

// ── URL text input & remove ───────────────────────────────────────────────────

describe("FileUploadWithUrl — URL text input", () => {
  it("calls onChange when the user types a URL directly", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FileUploadWithUrl label="Rapor PDF" value="" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "https://example.com/file.pdf");

    expect(onChange).toHaveBeenCalled();
  });

  it("calls onChange('') when the remove button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FileUploadWithUrl
        label="Rapor PDF"
        value="https://storage.example.com/report.pdf"
        onChange={onChange}
      />,
    );
    await user.click(screen.getByTitle(/kaldır/i));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
