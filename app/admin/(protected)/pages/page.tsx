"use client";

import { useEffect, useState } from "react";
import { Pencil, X, Check, Plus, FileText } from "lucide-react";
import { AdminPage, getAdminPages, upsertAdminPage } from "@/lib/firebase/adminServices";
import { MG_SECTIONS } from "@/lib/publicContent";

const MANAGED_SLUGS = [
  { slug: "hakkimizda", label: "Hakkımızda" },
  { slug: "tuzuk", label: "Tüzük" },
  ...MG_SECTIONS.map((s) => ({ slug: s.slug, label: `MG: ${s.title}` })),
];

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Editor({
  page,
  onSave,
  onCancel,
  saving,
}: {
  page: { slug: string; title: string; bodyMarkdown: string; status: AdminPage["status"] };
  onSave: (title: string, body: string, status: AdminPage["status"]) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState(page.title);
  const [body, setBody] = useState(page.bodyMarkdown);
  const [status, setStatus] = useState<AdminPage["status"]>(page.status);

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  return (
    <div className="space-y-4 rounded-xl border border-teal-200 bg-teal-50 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          /{page.slug}
        </p>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Sayfa Başlığı</label>
        <input className={cls} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          İçerik (Markdown)
        </label>
        <textarea
          rows={12}
          className={`${cls} resize-y font-mono text-xs`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Markdown formatında içerik yazın…"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Durum:</label>
          <select
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminPage["status"])}
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
        <button
          onClick={() => onSave(title, body, status)}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
        >
          <Check className="h-4 w-4" />
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default function PageManagementPage() {
  const [pages, setPages] = useState<AdminPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);

  useEffect(() => {
    getAdminPages()
      .then(setPages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function getPage(slug: string): AdminPage | undefined {
    return pages.find((p) => p.slug === slug);
  }

  async function handleSave(
    slug: string,
    title: string,
    body: string,
    status: AdminPage["status"]
  ) {
    setSaving(true);
    try {
      await upsertAdminPage(slug, title, body, status);
      setPages((prev) => {
        const exists = prev.find((p) => p.slug === slug);
        const updated: AdminPage = {
          id: exists?.id ?? slug,
          slug,
          title,
          bodyMarkdown: body,
          status,
          updatedAt: new Date().toISOString(),
        };
        return exists
          ? prev.map((p) => (p.slug === slug ? updated : p))
          : [...prev, updated];
      });
      setEditingSlug(null);
      setAddingCustom(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sayfa Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Site sayfalarının içeriğini düzenleyin.
          </p>
        </div>
        {!addingCustom && (
          <button
            onClick={() => { setAddingCustom(true); setEditingSlug(null); }}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" /> Yeni Sayfa
          </button>
        )}
      </div>

      {/* Custom page form */}
      {addingCustom && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
          <p className="text-sm font-medium text-gray-700">Slug girin:</p>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              placeholder="örnek: mg-hakkinda"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            />
            <button
              disabled={!newSlug.trim()}
              onClick={() => { setEditingSlug(newSlug); setAddingCustom(false); }}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
            >
              Devam
            </button>
            <button onClick={() => setAddingCustom(false)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editing a custom-slug page */}
      {editingSlug && !MANAGED_SLUGS.find((s) => s.slug === editingSlug) && (
        <Editor
          page={{
            slug: editingSlug,
            title: getPage(editingSlug)?.title ?? "",
            bodyMarkdown: getPage(editingSlug)?.bodyMarkdown ?? "",
            status: getPage(editingSlug)?.status ?? "draft",
          }}
          onSave={(title, body, status) => handleSave(editingSlug, title, body, status)}
          onCancel={() => setEditingSlug(null)}
          saving={saving}
        />
      )}

      {/* Managed pages list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {MANAGED_SLUGS.map(({ slug, label }) => {
            const page = getPage(slug);
            return editingSlug === slug ? (
              <Editor
                key={slug}
                page={{
                  slug,
                  title: page?.title ?? label,
                  bodyMarkdown: page?.bodyMarkdown ?? "",
                  status: page?.status ?? "draft",
                }}
                onSave={(title, body, status) => handleSave(slug, title, body, status)}
                onCancel={() => setEditingSlug(null)}
                saving={saving}
              />
            ) : (
              <div
                key={slug}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <FileText className="h-5 w-5 shrink-0 text-teal-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">/{slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  {page ? (
                    <>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        page.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {page.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(page.updatedAt)}</span>
                    </>
                  ) : (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                      İçerik yok
                    </span>
                  )}
                  <button
                    onClick={() => { setEditingSlug(slug); setAddingCustom(false); }}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Düzenle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
