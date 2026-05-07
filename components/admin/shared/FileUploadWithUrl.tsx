"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, FileText, ExternalLink, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/firebase/storageUtils";

interface FileUploadWithUrlProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
}

/**
 * URL girişi + cihazdan dosya yükleme desteği olan dosya alanı.
 * Varsayılan olarak PDF kabul eder. Dosya yüklenince URL alanı otomatik dolar.
 */
export function FileUploadWithUrl({
  label,
  value,
  onChange,
  accept = "application/pdf",
  placeholder = "https://… (Firebase Storage veya harici link)",
}: FileUploadWithUrlProps) {
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
      console.error("Dosya yükleme hatası:", err);
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

      {/* File preview row */}
      {value && (
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
          <FileText className="h-5 w-5 shrink-0 text-primary" />
          <span className="flex-1 truncate text-sm text-gray-700">{value}</span>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" /> Görüntüle
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded p-1 text-gray-400 hover:text-red-500"
            title="Dosyayı kaldır"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
