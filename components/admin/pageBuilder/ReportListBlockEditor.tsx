"use client";

import { useRef } from "react";
import { Plus, Trash2, RefreshCw, FileText } from "lucide-react";
import type { ReportListBlockData } from "@/types/pageBuilder";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

interface ReportListBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function makeId() {
  return `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ReportListBlockEditor({ data, onChange }: ReportListBlockEditorProps) {
  const d = data as unknown as ReportListBlockData;
  const reports = d.reports ?? [];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileTargetRef = useRef<string | null>(null);

  function setReports(next: ReportListBlockData["reports"]) {
    onChange({ ...d, reports: next });
  }

  function update(id: string, patch: Partial<NonNullable<ReportListBlockData["reports"]>[number]>) {
    setReports(reports.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function remove(id: string) {
    setReports(reports.filter((r) => r.id !== id));
  }

  function add() {
    setReports([
      ...reports,
      { id: makeId(), title: "", year: "", fileUrl: "", category: "", excerpt: "" },
    ]);
  }

  function handleFile(files: FileList | null) {
    const id = fileTargetRef.current;
    const file = files?.[0];
    if (!id || !file) return;
    const reader = new FileReader();
    reader.onload = () => update(id, { fileUrl: String(reader.result ?? "") });
    reader.readAsDataURL(file);
    fileTargetRef.current = null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Rapor Listesi
        </p>
        <span className="text-xs text-gray-400">{reports.length} rapor</span>
      </div>

      {reports.map((report) => (
        <div key={report.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-600" />
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
              Rapor
            </span>
            <button
              type="button"
              onClick={() => remove(report.id)}
              className="ml-auto rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <input
              className={`${inputCls} font-medium`}
              placeholder="Başlık"
              value={report.title}
              onChange={(e) => update(report.id, { title: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder="Yıl"
              value={report.year}
              onChange={(e) => update(report.id, { year: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder="Kategori (örn. Yıllık Rapor)"
              value={report.category}
              onChange={(e) => update(report.id, { category: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder="Dosya URL (PDF)"
              value={report.fileUrl}
              onChange={(e) => update(report.id, { fileUrl: e.target.value })}
            />
          </div>
          <textarea
            className={`${inputCls} mt-2 min-h-16`}
            placeholder="Özet"
            value={report.excerpt}
            onChange={(e) => update(report.id, { excerpt: e.target.value })}
          />

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                fileTargetRef.current = report.id;
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {report.fileUrl ? "PDF'i değiştir" : "PDF yükle"}
            </button>
            {report.fileUrl && (
              <>
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-teal-700 underline"
                >
                  PDF'i görüntüle
                </a>
                <button
                  type="button"
                  onClick={() => update(report.id, { fileUrl: "" })}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  PDF'i kaldır
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
      >
        <Plus className="h-4 w-4" />
        Rapor Ekle
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
