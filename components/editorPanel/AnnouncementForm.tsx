"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnnouncementAudience, AnnouncementItem } from "@/types/editorPanel";

type AnnouncementFormMode = "create" | "edit";

interface AnnouncementFormProps {
  mode: AnnouncementFormMode;
  initialData?: AnnouncementItem;
  onSubmit: (data: AnnouncementItem) => void;
}

const audienceOptions: { value: AnnouncementAudience; label: string }[] = [
  { value: "all", label: "Herkes" },
  { value: "members", label: "Üyeler" },
  { value: "volunteers", label: "Gönüllüler" },
  { value: "patients", label: "Hastalar" },
];

export default function AnnouncementForm({
  mode,
  initialData,
  onSubmit,
}: AnnouncementFormProps) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `announcement-${Date.now()}`,
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      audience: initialData?.audience ?? "all",
      publishedAt:
        initialData?.publishedAt ?? new Date().toISOString().slice(0, 10),
      status: initialData?.status ?? "draft",
      pinned: initialData?.pinned ?? false,
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<AnnouncementItem>(initialForm);

  function handleChange<K extends keyof AnnouncementItem>(
    key: K,
    value: AnnouncementItem[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.title || !formData.content) {
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
              Duyuru Başlığı
            </label>
            <input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Duyuru başlığını girin"
              className="h-[48px] w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
            />
          </div>

          <div>
            <label className="mb-2 block text-[14px] font-medium text-[#222]">
              Hedef Kitle
            </label>
            <div className="relative">
              <select
                value={formData.audience}
                onChange={(e) =>
                  handleChange("audience", e.target.value as AnnouncementAudience)
                }
                className="h-[48px] w-full appearance-none rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 outline-none focus:border-[#2f80ed]"
              >
                {audienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                  name="announcementStatus"
                  checked={formData.status === "published"}
                  onChange={() => handleChange("status", "published")}
                  className="h-4 w-4 accent-[#2f80ed]"
                />
                <span>Yayınlandı</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="announcementStatus"
                  checked={formData.status === "draft"}
                  onChange={() => handleChange("status", "draft")}
                  className="h-4 w-4 accent-[#2f80ed]"
                />
                <span>Taslak</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-[15px] text-black">
              <input
                type="checkbox"
                checked={formData.pinned}
                onChange={(e) => handleChange("pinned", e.target.checked)}
                className="h-4 w-4 accent-[#2f80ed]"
              />
              <span>Öne Sabitle</span>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Duyuru İçeriği
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="Duyuru metnini yazın"
            rows={14}
            className="w-full rounded-[10px] border border-transparent bg-[#e3e3e3] px-4 py-3 outline-none focus:border-[#2f80ed]"
          />
        </div>
      </div>

      <div className="mt-10 flex justify-end">
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