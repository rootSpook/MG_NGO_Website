"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { useTenantServices } from "@/lib/firebase/hooks/useTenantServices";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

interface ImageUploadFieldProps {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  hint?: string;
  aspectClassName?: string;
  accept?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Görsel",
  hint,
  aspectClassName = "aspect-[16/9]",
  accept = "image/*",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadImage } = useTenantServices();

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    // Client-side validation before touching Firebase
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Desteklenmeyen dosya türü: ${file.type || "bilinmiyor"}. JPEG, PNG, GIF, WebP veya SVG yükleyin.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Dosya çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum 10 MB yükleyebilirsiniz.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err: unknown) {
      console.error("[ImageUploadField] upload failed:", err);

      // Surface a human-readable message from Firebase Storage errors
      let msg = "Yükleme başarısız. Lütfen tekrar deneyin.";
      if (err && typeof err === "object") {
        const code = (err as { code?: string }).code ?? "";
        if (code === "storage/unauthorized") {
          msg = "Yetkiniz yok. Lütfen tekrar giriş yapın.";
        } else if (code === "storage/canceled") {
          msg = "Yükleme iptal edildi.";
        } else if (code === "storage/unknown") {
          msg = "Bilinmeyen bir hata oluştu. İnternet bağlantınızı kontrol edin.";
        } else if (code) {
          msg = `Firebase Storage hatası: ${code}`;
        }
      }
      setError(msg);
    } finally {
      // Always clear the spinner — no infinite loading
      setUploading(false);
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}

      {value ? (
        <div className="space-y-2">
          <div className={`relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 ${aspectClassName}`}>
            <img src={value} alt="Görsel önizleme" className="h-full w-full object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Görseli Değiştir
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange("")}
              className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Görseli Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-6 text-center text-gray-400 hover:border-teal-300 hover:bg-teal-50/40 disabled:cursor-not-allowed disabled:opacity-60 ${aspectClassName}`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 animate-spin" />
              <span className="text-xs font-medium">Yükleniyor…</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-7 w-7" />
              <span className="text-xs font-medium">Görsel yükleyin</span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500 mt-0.5" />
          <p className="text-[11px] text-red-600 leading-relaxed">{error}</p>
        </div>
      )}
      {hint && <p className="mt-2 text-[11px] text-gray-400">{hint}</p>}

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
