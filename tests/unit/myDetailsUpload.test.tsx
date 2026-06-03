/**
 * Unit tests for the profile-photo upload flow in my-details/page.tsx.
 *
 * Tests cover the error-notification path that was added alongside the
 * storageUtils timeout fix: when uploadImage rejects, a human-readable
 * error message must appear in the UI and the spinner must clear.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ── Mocks (must be declared before the import under test) ────────────────────

const uploadImageMock = vi.fn();
const updateStaffPhotoURLMock = vi.fn();
const getStaffMemberMock = vi.fn();

vi.mock("@/lib/firebase/hooks/useTenantServices", () => ({
  useTenantServices: () => ({
    uploadImage: uploadImageMock,
    updateStaffPhotoURL: updateStaffPhotoURLMock,
    getStaffMember: getStaffMemberMock,
  }),
}));

vi.mock("@/lib/firebase/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "test-uid-123", email: "admin@example.com" },
    role: "admin",
    loading: false,
  }),
}));

// ── Component under test ──────────────────────────────────────────────────────

import AdminMyDetailsPage from "@/app/admin/(protected)/my-details/page";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeJpeg(name = "photo.jpg"): File {
  return new File(["data"], name, { type: "image/jpeg" });
}

function renderPage() {
  return render(<AdminMyDetailsPage />);
}

beforeEach(() => {
  uploadImageMock.mockReset();
  updateStaffPhotoURLMock.mockReset();
  getStaffMemberMock.mockReset();
  // Default: no existing photo
  getStaffMemberMock.mockResolvedValue({ photoURL: null });
});

// ── Render ────────────────────────────────────────────────────────────────────

describe("MyDetails — render", () => {
  it("renders the profile photo section heading", () => {
    renderPage();
    expect(screen.getByText("Profil Fotoğrafı")).toBeInTheDocument();
  });

  it("renders the 'Fotoğraf Değiştir' button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /fotoğraf değiştir/i })).toBeInTheDocument();
  });

  it("renders the account info section", () => {
    renderPage();
    expect(screen.getByText("Hesap Bilgileri")).toBeInTheDocument();
  });
});

// ── Loading state ─────────────────────────────────────────────────────────────

describe("MyDetails — upload loading state", () => {
  it("shows 'Yükleniyor' while upload is in progress", async () => {
    uploadImageMock.mockImplementation(() => new Promise(() => {}));

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: /yükleniyor/i })).toBeDisabled();
  });
});

// ── Successful upload ─────────────────────────────────────────────────────────

describe("MyDetails — successful upload", () => {
  it("shows 'Fotoğraf kaydedildi' confirmation after success", async () => {
    const photoUrl = "https://storage.example.com/profiles/photo.jpg";
    uploadImageMock.mockResolvedValue(photoUrl);
    updateStaffPhotoURLMock.mockResolvedValue(undefined);

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.getByText(/fotoğraf kaydedildi/i)).toBeInTheDocument(),
    );
  });

  it("calls updateStaffPhotoURL with the returned URL and the user uid", async () => {
    const photoUrl = "https://storage.example.com/profiles/photo.jpg";
    uploadImageMock.mockResolvedValue(photoUrl);
    updateStaffPhotoURLMock.mockResolvedValue(undefined);

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() => expect(updateStaffPhotoURLMock).toHaveBeenCalled());
    expect(updateStaffPhotoURLMock).toHaveBeenCalledWith("test-uid-123", photoUrl);
  });

  it("clears the spinner after a successful upload", async () => {
    uploadImageMock.mockResolvedValue("https://storage.example.com/photo.jpg");
    updateStaffPhotoURLMock.mockResolvedValue(undefined);

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.queryByText(/^yükleniyor/i)).not.toBeInTheDocument(),
    );
  });
});

// ── Error state ───────────────────────────────────────────────────────────────

describe("MyDetails — upload error state", () => {
  it("shows a generic error message when uploadImage rejects", async () => {
    uploadImageMock.mockRejectedValue(new Error("Network failure"));

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.getByText(/yüklenemedi/i)).toBeInTheDocument(),
    );
  });

  it("shows 'yetkiniz yok' for storage/unauthorized error", async () => {
    const err = Object.assign(new Error("Unauthorized"), { code: "storage/unauthorized" });
    uploadImageMock.mockRejectedValue(err);

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.getByText(/yetkiniz yok/i)).toBeInTheDocument(),
    );
  });

  it("shows timeout message when storageUtils timeout fires", async () => {
    const err = new Error("[storageUtils] uploadBytes timed out after 30s");
    uploadImageMock.mockRejectedValue(err);

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.getByText(/zaman aşımı/i)).toBeInTheDocument(),
    );
  });

  it("clears the spinner after an error", async () => {
    uploadImageMock.mockRejectedValue(new Error("Firebase error"));

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.queryByText(/^yükleniyor/i)).not.toBeInTheDocument(),
    );
  });

  it("does not call updateStaffPhotoURL when uploadImage fails", async () => {
    uploadImageMock.mockRejectedValue(new Error("Upload failed"));

    renderPage();
    const input = document.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeJpeg()] } });

    await waitFor(() =>
      expect(screen.getByText(/yüklenemedi/i)).toBeInTheDocument(),
    );
    expect(updateStaffPhotoURLMock).not.toHaveBeenCalled();
  });
});
