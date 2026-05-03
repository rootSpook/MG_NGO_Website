"use client";

import { useMemo, useState, useEffect } from "react";
import { ChevronDown, Eye, Code2 } from "lucide-react";
import { BlogPost } from "@/types/editorPanel";
import { marked } from "marked";

type BlogFormMode = "create" | "edit";

interface BlogPostFormProps {
  mode: BlogFormMode;
  initialData?: BlogPost;
  onSubmit: (data: BlogPost) => void;
  onClear?: () => void;
}

const categoryOptions = [
  "Sağlık",
  "Etkinlik",
  "Topluluk",
  "Duyuru",
  "Destek",
  "Bağış",
];

// Configure marked for safe output
marked.setOptions({ async: false });

function renderMarkdown(md: string): string {
  if (!md) return "";
  try {
    return marked.parse(md) as string;
  } catch {
    return md;
  }
}

export default function BlogPostForm({
  mode,
  initialData,
  onSubmit,
  onClear,
}: BlogPostFormProps) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `blog-${Date.now()}`,
      title: initialData?.title ?? "",
      category: initialData?.category ?? "",
      publishedAt:
        initialData?.publishedAt ?? new Date().toISOString().slice(0, 10),
      status: initialData?.status ?? "draft",
      author: initialData?.author ?? "Editor 1",
      summary: initialData?.summary ?? "",
      bodyMarkdown: initialData?.bodyMarkdown ?? "",
      coverImageUrl: initialData?.coverImageUrl ?? "",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<BlogPost>(initialForm);
  const [imageName, setImageName] = useState("");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");

  // Re-render preview whenever markdown changes
  useEffect(() => {
    if (editorTab === "preview") {
      setPreviewHtml(renderMarkdown(formData.bodyMarkdown));
    }
  }, [formData.bodyMarkdown, editorTab]);

  function handleChange<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
      setImageName("");
    } else {
      setFormData({
        id: `blog-${Date.now()}`,
        title: "",
        category: "",
        publishedAt: new Date().toISOString().slice(0, 10),
        status: "draft",
        author: "Editor 1",
        summary: "",
        bodyMarkdown: "",
        coverImageUrl: "",
      });
      setImageName("");
    }
    onClear?.();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.summary) {
      alert("Lütfen gerekli alanları doldurun: Başlık, Kategori ve Kısa Özet.");
      return;
    }

    onSubmit(formData);
  }

  const inputCls =
    "h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] bg-[#efefef] p-6 shadow-md"
    >
      {/* ── Row 1: meta fields ────────────────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Blog Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Blog başlığını girin"
              className={inputCls}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                <option value="">Seçiniz</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
            </div>
          </div>

          {/* Published At */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Yayın Tarihi
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => handleChange("publishedAt", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Durum
            </label>
            <div className="flex gap-8">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="blogStatus"
                  checked={formData.status === "published"}
                  onChange={() => handleChange("status", "published")}
                  className="h-4 w-4 accent-[#2f80ed]"
                />
                <span>Yayınlandı</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="blogStatus"
                  checked={formData.status === "draft"}
                  onChange={() => handleChange("status", "draft")}
                  className="h-4 w-4 accent-[#2f80ed]"
                />
                <span>Taslak</span>
              </label>
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Yazar
            </label>
            <input
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Right column: summary + image */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Kısa Özet <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Blog yazısının kısa özetini yazın (liste görünümünde gösterilir)"
              rows={5}
              className="w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 py-3 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Kapak Görseli Ekle
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImageName(file?.name ?? "");
              }}
              className="block w-full text-[14px] text-[#333]"
            />
            {imageName && (
              <p className="mt-2 text-[13px] text-[#666]">
                Seçilen dosya: {imageName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: full body Markdown editor ─────────────────────────────── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[14px] font-medium text-[#222]">
            Blog İçeriği (Tam Metin)
          </label>
          <div className="flex gap-1 rounded-lg bg-[#e3e3e3] p-1">
            <button
              type="button"
              onClick={() => setEditorTab("write")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                editorTab === "write"
                  ? "bg-white text-[#2f80ed] shadow-sm"
                  : "text-[#666] hover:text-[#333]"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              Yaz
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewHtml(renderMarkdown(formData.bodyMarkdown));
                setEditorTab("preview");
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                editorTab === "preview"
                  ? "bg-white text-[#2f80ed] shadow-sm"
                  : "text-[#666] hover:text-[#333]"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Önizleme
            </button>
          </div>
        </div>

        {editorTab === "write" ? (
          <textarea
            value={formData.bodyMarkdown}
            onChange={(e) => handleChange("bodyMarkdown", e.target.value)}
            placeholder={`# Blog Başlığı\n\nİlk paragrafınızı buraya yazın.\n\n## Alt Başlık\n\nMarkdown formatı desteklenmektedir:\n- **kalın**, *italik*, \`kod\`\n- Listeler ve başlıklar\n- [Bağlantılar](https://ornek.com)`}
            rows={20}
            className="w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 py-3 font-mono text-[13px] leading-relaxed outline-none focus:border-[#2f80ed] resize-y"
          />
        ) : (
          <div
            className="min-h-[480px] w-full rounded-[10px] bg-white px-6 py-5 prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-primary"
            dangerouslySetInnerHTML={{
              __html: previewHtml || "<p class='text-gray-400'>İçerik girilmedi…</p>",
            }}
          />
        )}

        <p className="mt-2 text-[12px] text-[#888]">
          Markdown formatı desteklenir: **kalın**, *italik*, # başlık, - liste, `kod`, [bağlantı](url)
        </p>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="mt-10 flex justify-end gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-[#4a4a4a] bg-white px-8 py-3 text-[15px] font-medium text-[#333]"
        >
          Temizle
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#27ae60] px-10 py-3 text-[15px] font-semibold text-white"
        >
          {mode === "create" ? "EKLE" : "KAYDET"}
        </button>
      </div>
    </form>
  );
}
