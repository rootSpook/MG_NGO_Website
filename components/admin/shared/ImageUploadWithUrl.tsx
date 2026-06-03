"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, Trash2, AlertCircle } from "lucide-react";
import { useTenantServices } from "@/lib/firebase/hooks/useTenantServices";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

interface ImageUploadWithUrlProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  previewClassName?: string;
}

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
  const { uploadImage } = useTenantServices();

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Desteklenmeyen dosya türü: ${file.type || "bilinmiyor"}. JPEG, PNG, GIF, WebP veya SVG yükleyin.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum 10 MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err: unknown) {
      console.error("[ImageUploadWithUrl] upload failed:", err);
      let msg = "Yükleme başarısız. Lütfen tekrar deneyin.";
      const code = (err as { code?: string })?.code ?? "";
      if (code === "storage/unauthorized") msg = "Yetkiniz yok. Lütfen tekrar giriş yapın.";
      else if (code === "storage/canceled")  msg = "Yükleme iptal edildi.";
      else if ((err as Error)?.message?.includes("timed out")) msg = "Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>

      <div className="flex gap-2">
        <input
          className={cls}
          value={value}
          onChange={(e) => { onChange(e.target.value); setError(null); }}
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
        <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500 mt-0.5" />
          <p className="text-[11px] text-red-600 leading-relaxed">{error}</p>
        </div>
      )}

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
