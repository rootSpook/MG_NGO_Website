"use client";

import { useRef } from "react";
import { Plus, Trash2, RefreshCw, FileText, Download } from "lucide-react";

export interface AttachmentEntry {
  id: string;
  name: string;
  url: string;
  size?: number;
}

interface FileAttachmentManagerProps {
  /** Current attachment list */
  value: AttachmentEntry[];
  /** Called whenever the attachment array changes */
  onChange: (next: AttachmentEntry[]) => void;
  /** Optional label rendered above the manager */
  label?: string;
  /** Helper text rendered above the manager */
  hint?: string;
  /** Mime / extension filter (default: any) */
  accept?: string;
  /** Allow multiple files in the file picker */
  multiple?: boolean;
}

function makeId() {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatBytes(size?: number) {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Reusable manager for attaching, replacing and removing one or more files.
 * Uses base64 data URLs so attachments work entirely on the frontend
 * before backend integration.
 */
export function FileAttachmentManager({
  value,
  onChange,
  label = "Dosyalar",
  hint = "PDF veya dokümanlar yükleyin. Yüklediğiniz dosyalar public sayfada görünür.",
  accept,
  multiple = true,
}: FileAttachmentManagerProps) {
  const addInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const replaceTargetIdRef = useRef<string | null>(null);

  function readFile(file: File): Promise<AttachmentEntry> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          id: makeId(),
          name: file.name,
          url: String(reader.result ?? ""),
          size: file.size,
        });
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function handleAdd(files: FileList | null) {
    if (!files || files.length === 0) return;
    const incoming = await Promise.all(Array.from(files).map(readFile));
    onChange([...(value ?? []), ...incoming]);
  }

  async function handleReplace(files: FileList | null) {
    const id = replaceTargetIdRef.current;
    if (!files || files.length === 0 || !id) return;
    const next = await readFile(files[0]);
    onChange((value ?? []).map((entry) => (entry.id === id ? { ...next, id } : entry)));
    replaceTargetIdRef.current = null;
  }

  function handleDelete(id: string) {
    onChange((value ?? []).filter((entry) => entry.id !== id));
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      {hint && <p className="mb-2 text-[12px] text-gray-400">{hint}</p>}

      <div className="space-y-2">
        {(value ?? []).map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <FileText className="h-4 w-4 shrink-0 text-teal-600" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-800">{entry.name || "Dosya"}</p>
              {entry.size ? (
                <p className="text-[11px] text-gray-400">{formatBytes(entry.size)}</p>
              ) : null}
            </div>

            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              download={entry.name || true}
            >
              <Download className="h-3.5 w-3.5" />
              Aç
            </a>

            <button
              type="button"
              onClick={() => {
                replaceTargetIdRef.current = entry.id;
                replaceInputRef.current?.click();
              }}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Değiştir
            </button>

            <button
              type="button"
              onClick={() => handleDelete(entry.id)}
              className="flex items-center gap-1 rounded-md border border-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Sil
            </button>
          </div>
        ))}

        {(value ?? []).length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-400">
            Henüz dosya eklenmedi.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => addInputRef.current?.click()}
        className="mt-3 flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
      >
        <Plus className="h-4 w-4" />
        Dosya Ekle
      </button>

      <input
        ref={addInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleAdd(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleReplace(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
