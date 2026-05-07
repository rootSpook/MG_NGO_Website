"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/firebase/storageUtils";

interface ImageUploadWithUrlProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  previewClassName?: string;
}

/**
 * URL girişi + cihazdan dosya yükleme desteği olan görsel alanı.
 * İkisi aynı state'i paylaşır: dosya yüklenince URL alanı otomatik dolar.
 */
export function ImageUploadWithUrl({
  label,
  value,
  onChange,
  placeholder = "https://…",
  previewClassName = "h-16 w-24 object-contain",
}: ImageUploadWithUrlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      console.error("Görsel yükleme hatası:", err);
      setError("Yükleme başarısız. Lütfen tekrar deneyin.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>

      {/* URL input + upload button side by side */}
      <div className="flex gap-2">
        <input
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          title="Cihazdan yükle"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {uploading ? "Yükleniyor…" : "Yükle"}
          </span>
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <img
            src={value}
            alt="Önizleme"
            className={`rounded border border-gray-200 bg-gray-50 ${previewClassName}`}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded p-1 text-gray-400 hover:text-red-500"
            title="Görseli kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
