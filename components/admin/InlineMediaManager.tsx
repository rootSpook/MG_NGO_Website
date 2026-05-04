"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import type { MediaItem, MediaStatus } from "@/types/editorPanel";
import {
  createEditorMedia,
  deleteEditorMedia,
  getEditorMedia,
  updateEditorMedia,
} from "@/lib/firebase/editorServices";
import { revalidatePublicPathAction } from "@/app/admin/actions";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";
import { DraftPublishToggle } from "@/components/admin/shared/DraftPublishToggle";

const pageOptions = [
  { key: "media-updates", label: "Son Güncellemeler" },
  { key: "media-gallery", label: "Fotoğraf Galerisi" },
];

const categoryOptions = ["Haber", "Etkinlik", "Basın", "Duyuru"];

type DraftItem = Omit<MediaItem, "id" | "createdAt"> & { status: MediaStatus };

const emptyDraft: DraftItem = {
  pageKey: "media-updates",
  title: "",
  description: "",
  tags: ["Duyuru"],
  visibility: "public",
  featured: false,
  imageUrl: "",
  status: "draft",
};

const inputCls =
  "h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-teal-500";

const textareaCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-500";

interface MediaFormProps {
  initial: DraftItem;
  saving?: boolean;
  onSave: (next: DraftItem) => void;
  onCancel: () => void;
}

function MediaForm({ initial, onSave, onCancel, saving }: MediaFormProps) {
  const [form, setForm] = useState<DraftItem>(initial);

  function set<K extends keyof DraftItem>(key: K, value: DraftItem[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-4 rounded-xl border border-teal-200 bg-teal-50 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-600">Bölüm</span>
          <select
            value={form.pageKey}
            onChange={(e) => set("pageKey", e.target.value)}
            className={inputCls}
          >
            {pageOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-600">Kategori</span>
          <select
            value={form.tags[0] ?? "Duyuru"}
            onChange={(e) => set("tags", [e.target.value])}
            className={inputCls}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-medium text-gray-600">Başlık</span>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
            placeholder="Görselin / güncellemenin başlığı"
          />
        </label>
        <div className="md:col-span-2">
          <ImageUploadField
            label="Görsel"
            value={form.imageUrl}
            onChange={(url) => set("imageUrl", url)}
            aspectClassName="aspect-[16/9]"
            hint="Public medya sayfasında kullanılır."
          />
        </div>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs font-medium text-gray-600">Açıklama</span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={textareaCls}
            placeholder="Kart üzerinde gösterilecek kısa açıklama"
          />
        </label>
        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Öne çıkan içerik olarak işaretle</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-teal-100 pt-3">
        <DraftPublishToggle
          value={form.status}
          onChange={(next) => set("status", next)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            İptal
          </button>
          <button
            type="button"
            onClick={() => {
              if (!form.title.trim() || !form.imageUrl) {
                alert("Başlık ve görsel gerekli.");
                return;
              }
              onSave(form);
            }}
            disabled={saving}
            className="flex items-center gap-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function InlineMediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("media-updates");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getEditorMedia()
      .then((data) =>
        setItems(
          data.filter((item) => ["media-updates", "media-gallery"].includes(item.pageKey))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => item.pageKey === activeTab)
      .filter((item) =>
        !query.trim()
          ? true
          : `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())
      );
  }, [items, activeTab, query]);

  async function refresh() {
    await revalidatePublicPathAction("/media");
  }

  async function handleCreate(draft: DraftItem) {
    setSaving(true);
    try {
      const payload: Omit<MediaItem, "id"> = {
        ...draft,
        createdAt: new Date().toISOString(),
      };
      const id = await createEditorMedia(payload);
      setItems((prev) => [{ id, ...payload }, ...prev]);
      setCreating(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, draft: DraftItem) {
    setSaving(true);
    try {
      const existing = items.find((item) => item.id === id);
      const payload: MediaItem = {
        id,
        ...draft,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      await updateEditorMedia(id, payload);
      setItems((prev) => prev.map((item) => (item.id === id ? payload : item)));
      setEditingId(null);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu medya öğesini silmek istediğinize emin misiniz?")) return;
    await deleteEditorMedia(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    await refresh();
  }

  async function toggleStatus(item: MediaItem) {
    const next: MediaStatus = (item.status ?? "published") === "published" ? "draft" : "published";
    await updateEditorMedia(item.id, { ...item, status: next });
    setItems((prev) =>
      prev.map((entry) => (entry.id === item.id ? { ...entry, status: next } : entry))
    );
    await refresh();
  }

  function startCreate() {
    setEditingId(null);
    setCreating(true);
  }

  function startEdit(id: string) {
    setCreating(false);
    setEditingId(id);
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Medya İçerikleri
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Son Güncellemeler ve Fotoğraf Galerisi içeriklerini buradan yönetebilirsiniz.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Medya
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-gray-100 p-1">
          {pageOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setActiveTab(option.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === option.key
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="relative ml-auto w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ara…"
            className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
          />
        </label>
      </div>

      {creating && (
        <MediaForm
          initial={{ ...emptyDraft, pageKey: activeTab }}
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleItems.map((item) => {
            const isEditing = editingId === item.id;
            const status: MediaStatus = item.status ?? "published";

            if (isEditing) {
              return (
                <div key={item.id} className="md:col-span-2">
                  <MediaForm
                    initial={{
                      pageKey: item.pageKey,
                      title: item.title,
                      description: item.description,
                      tags: item.tags,
                      visibility: item.visibility,
                      featured: item.featured,
                      imageUrl: item.imageUrl,
                      status,
                    }}
                    onSave={(draft) => handleUpdate(item.id, draft)}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </div>
              );
            }

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 w-full bg-gray-200" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        status === "published"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item.id)}
                      className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className="flex items-center gap-1 rounded-md border border-teal-200 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {status === "published" ? "Taslağa Al" : "Yayınla"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1 rounded-md border border-red-100 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          {visibleItems.length === 0 && !creating && (
            <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-8 text-center text-sm text-gray-400 md:col-span-2">
              Bu bölümde henüz içerik yok.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
