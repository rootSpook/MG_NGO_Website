"use client";

import { useEffect, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { upsertPageContent } from "@/lib/firebase/adminServices";
import { getContentBySlug } from "@/lib/firebase/services";

const SLUG = "tuzuk";

export default function BylawsPage() {
  const [title, setTitle] = useState("Dernek Tüzüğü");
  const [fileUrl, setFileUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentBySlug(SLUG)
      .then((item) => {
        if (item?.pageData) {
          const pd = item.pageData as Record<string, string>;
          setTitle(pd.title ?? "Dernek Tüzüğü");
          setFileUrl(pd.fileUrl ?? "");
          setDescription(pd.description ?? "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setStatus("saving");
    try {
      await upsertPageContent(SLUG, { title, fileUrl, description });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Yükleniyor…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tüzük</h1>
          <p className="mt-1 text-sm text-gray-500">
            Dernek tüzük belgesini yükleyin veya güncelleyin.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
        >
          {status === "saving" ? "Kaydediliyor…" : status === "saved" ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Başlık</label>
          <input className={cls} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Açıklama</label>
          <textarea
            rows={3}
            className={`${cls} resize-none`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tüzük hakkında kısa bir açıklama…"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">PDF Dosya URL</label>
          <input
            className={cls}
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://… (Firebase Storage veya harici link)"
          />
        </div>

        {fileUrl && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <FileText className="h-5 w-5 text-primary" />
            <span className="flex-1 truncate text-sm text-gray-700">{fileUrl}</span>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Görüntüle
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
