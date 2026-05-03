"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Check, Copy } from "lucide-react";
import {
  IbanEntry,
  getIbanEntries,
  createIbanEntry,
  updateIbanEntry,
  deleteIbanEntry,
} from "@/lib/firebase/adminServices";

const emptyEntry: Omit<IbanEntry, "id"> = {
  bankName: "",
  accountHolder: "",
  iban: "",
  currency: "TRY",
  sortOrder: 0,
};

function IbanForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Omit<IbanEntry, "id">;
  onSave: (data: Omit<IbanEntry, "id">) => void;
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
          <label className="mb-1 block text-xs font-medium text-gray-600">Banka Adı</label>
          <input className={cls} value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Hesap Sahibi</label>
          <input className={cls} value={form.accountHolder} onChange={(e) => set("accountHolder", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">IBAN</label>
        <input
          className={`${cls} font-mono tracking-wide`}
          value={form.iban}
          onChange={(e) => set("iban", e.target.value.toUpperCase())}
          placeholder="TR00 0000 0000 0000 0000 0000 00"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Para Birimi</label>
          <select className={cls} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            <option value="TRY">TRY — Türk Lirası</option>
            <option value="USD">USD — Amerikan Doları</option>
            <option value="EUR">EUR — Euro</option>
          </select>
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

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
          <X className="h-4 w-4" /> İptal
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.bankName.trim() || !form.iban.trim()}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default function IbanPage() {
  const [entries, setEntries] = useState<IbanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getIbanEntries().then(setEntries).catch(console.error).finally(() => setLoading(false));
  }, []);

  function copyIban(iban: string) {
    navigator.clipboard.writeText(iban);
    setCopied(iban);
    setTimeout(() => setCopied(null), 1500);
  }

  async function handleCreate(data: Omit<IbanEntry, "id">) {
    setSaving(true);
    try {
      const id = await createIbanEntry(data);
      setEntries((prev) => [...prev, { id, ...data }]);
      setAdding(false);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleUpdate(id: string, data: Omit<IbanEntry, "id">) {
    setSaving(true);
    try {
      await updateIbanEntry(id, data);
      setEntries((prev) => prev.map((e) => (e.id === id ? { id, ...data } : e)));
      setEditingId(null);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu IBAN kaydını silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteIbanEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) { console.error(err); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IBAN Bilgileri</h1>
          <p className="mt-1 text-sm text-gray-500">Bağış sayfasında gösterilecek banka hesapları.</p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            <Plus className="h-4 w-4" /> IBAN Ekle
          </button>
        )}
      </div>

      {adding && (
        <IbanForm initial={emptyEntry} onSave={handleCreate} onCancel={() => setAdding(false)} saving={saving} />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : entries.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          Henüz IBAN kaydı eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) =>
            editingId === entry.id ? (
              <IbanForm
                key={entry.id}
                initial={entry}
                onSave={(data) => handleUpdate(entry.id, data)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : (
              <div key={entry.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{entry.bankName}</p>
                    <p className="text-sm text-gray-600">{entry.accountHolder}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm tracking-wide text-gray-800">{entry.iban}</p>
                      <button
                        onClick={() => copyIban(entry.iban)}
                        className="text-gray-400 hover:text-primary"
                        title="Kopyala"
                      >
                        {copied === entry.iban ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {entry.currency}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingId(entry.id); setAdding(false); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(entry.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
