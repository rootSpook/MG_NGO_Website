"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BlogPost } from "@/types/editorPanel";

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
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<BlogPost>(initialForm);
  const [imageName, setImageName] = useState("");

  function handleChange<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      });
      setImageName("");
    }

    onClear?.();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.summary) {
      alert("Lütfen gerekli alanları doldurun.");
      return;
    }

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] bg-[#efefef] p-6 shadow-md"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Blog Başlığı
            </label>
            <input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Blog başlığını girin"
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Kategori
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                <option value="">Seçiniz</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Yayın Tarihi
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => handleChange("publishedAt", e.target.value)}
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

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

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Yazar
            </label>
            <input
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Kısa Özet / İçerik
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Blog içeriğini veya kısa özetini yazın"
              rows={12}
              className="w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 py-3 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Görsel Ekle
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