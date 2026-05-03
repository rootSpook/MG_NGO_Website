"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Check, Star } from "lucide-react";
import {
  AdminReport,
  getAdminReports,
  createAdminReport,
  updateAdminReport,
  deleteAdminReport,
} from "@/lib/firebase/adminServices";

const emptyReport: Omit<AdminReport, "id"> = {
  title: "",
  excerpt: "",
  year: String(new Date().getFullYear()),
  category: "Yıllık Rapor",
  fileUrl: "",
  featured: false,
};

function ReportForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Omit<AdminReport, "id">;
  onSave: (data: Omit<AdminReport, "id">) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (field: keyof typeof form, value: string | boolean) =>
    setForm((p) => ({ ...p, [field]: value }));

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-3 rounded-xl border border-primary bg-secondary/50 p-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Rapor Başlığı</label>
        <input className={cls} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Özet</label>
        <textarea rows={2} className={`${cls} resize-none`} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Yıl</label>
          <input className={cls} value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Kategori</label>
          <select className={cls} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {["Yıllık Rapor", "Araştırma", "Tıbbi Kılavuz", "Topluluk"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Dosya URL (PDF)</label>
        <input className={cls} value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="https://…" />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded" />
        Öne çıkan rapor olarak işaretle
      </label>

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
          <X className="h-4 w-4" /> İptal
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.title.trim()}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminReports().then(setReports).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: Omit<AdminReport, "id">) {
    setSaving(true);
    try {
      const id = await createAdminReport(data);
      setReports((prev) => [{ id, ...data }, ...prev]);
      setAdding(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleUpdate(id: string, data: Omit<AdminReport, "id">) {
    setSaving(true);
    try {
      await updateAdminReport(id, data);
      setReports((prev) => prev.map((r) => (r.id === id ? { id, ...data } : r)));
      setEditingId(null);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu raporu silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteAdminReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) { console.error(err); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
          <p className="mt-1 text-sm text-gray-500">Yıllık raporlar ve yayınlar.</p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            <Plus className="h-4 w-4" /> Rapor Ekle
          </button>
        )}
      </div>

      {adding && (
        <ReportForm initial={emptyReport} onSave={handleCreate} onCancel={() => setAdding(false)} saving={saving} />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : reports.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          Henüz rapor eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) =>
            editingId === report.id ? (
              <ReportForm
                key={report.id}
                initial={report}
                onSave={(data) => handleUpdate(report.id, data)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : (
              <div key={report.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{report.title}</p>
                    {report.featured && <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5">{report.category}</span>
                    <span>{report.year}</span>
                    {report.fileUrl && (
                      <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        PDF görüntüle
                      </a>
                    )}
                  </div>
                  {report.excerpt && (
                    <p className="mt-1 truncate text-xs text-gray-400">{report.excerpt}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingId(report.id); setAdding(false); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(report.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
