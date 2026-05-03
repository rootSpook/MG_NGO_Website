"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Check, ExternalLink } from "lucide-react";
import {
  Supporter,
  getSupporters,
  createSupporter,
  updateSupporter,
  deleteSupporter,
} from "@/lib/firebase/adminServices";

const emptySupporter: Omit<Supporter, "id"> = {
  name: "",
  logoUrl: "",
  websiteUrl: "",
  sortOrder: 0,
};

function SupporterForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Omit<Supporter, "id">;
  onSave: (data: Omit<Supporter, "id">) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (field: keyof typeof form, value: string | number) =>
    setForm((p) => ({ ...p, [field]: value }));

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-3 rounded-xl border border-primary bg-secondary/50 p-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Destekçi Adı</label>
          <input className={cls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Sıralama</label>
          <input
            type="number"
            className={cls}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Logo URL</label>
        <input
          className={cls}
          value={form.logoUrl}
          onChange={(e) => set("logoUrl", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Web Sitesi</label>
        <input
          className={cls}
          value={form.websiteUrl}
          onChange={(e) => set("websiteUrl", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
        >
          <X className="h-4 w-4" /> İptal
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name.trim()}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default function SupportersPage() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSupporters()
      .then(setSupporters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: Omit<Supporter, "id">) {
    setSaving(true);
    try {
      const id = await createSupporter(data);
      setSupporters((prev) => [...prev, { id, ...data }]);
      setAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, data: Omit<Supporter, "id">) {
    setSaving(true);
    try {
      await updateSupporter(id, data);
      setSupporters((prev) =>
        prev.map((s) => (s.id === id ? { id, ...data } : s))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu destekçiyi silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteSupporter(id);
      setSupporters((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destekçiler</h1>
          <p className="mt-1 text-sm text-gray-500">
            Siteде gösterilecek sponsor ve destekçi kuruluşlar.
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            <Plus className="h-4 w-4" /> Destekçi Ekle
          </button>
        )}
      </div>

      {adding && (
        <SupporterForm
          initial={emptySupporter}
          onSave={handleCreate}
          onCancel={() => setAdding(false)}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : supporters.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          Henüz destekçi eklenmemiş.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supporters.map((s) =>
            editingId === s.id ? (
              <div key={s.id} className="col-span-full">
                <SupporterForm
                  initial={s}
                  onSave={(data) => handleUpdate(s.id, data)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <div
                key={s.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {s.logoUrl ? (
                    <img
                      src={s.logoUrl}
                      alt={s.name}
                      className="h-12 w-24 object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-24 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-500">
                      Logo yok
                    </div>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingId(s.id); setAdding(false); }}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 font-semibold text-gray-900">{s.name}</p>

                {s.websiteUrl && (
                  <a
                    href={s.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {s.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
