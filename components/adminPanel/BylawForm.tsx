"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BylawItem } from "@/types/adminPanel";

type BylawFormMode = "create" | "edit";

interface BylawFormProps {
  mode: BylawFormMode;
  initialData?: BylawItem;
  onSubmit: (data: BylawItem) => void;
}

export default function BylawForm({
  mode,
  initialData,
  onSubmit,
}: BylawFormProps) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `bylaw-${Date.now()}`,
      date: initialData?.date ?? new Date().toISOString().slice(0, 10),
      title: initialData?.title ?? "",
      version: initialData?.version ?? "",
      type: initialData?.type ?? "PDF",
      uploadedBy: initialData?.uploadedBy ?? "Admin",
      status: initialData?.status ?? "active",
      fileUrl: initialData?.fileUrl ?? "#",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<BylawItem>(initialForm);
  const [fileName, setFileName] = useState("");

  function handleChange<K extends keyof BylawItem>(key: K, value: BylawItem[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.title || !formData.version || !formData.date) {
      alert("Lütfen gerekli alanları doldurun.");
      return;
    }

    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Title / Description
          </label>
          <input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Version
          </label>
          <input
            value={formData.version}
            onChange={(e) => handleChange("version", e.target.value)}
            placeholder="v1.0"
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Type
          </label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="h-[48px] w-full appearance-none rounded-[12px] bg-white px-4 outline-none"
            >
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a7a]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Uploaded By
          </label>
          <input
            value={formData.uploadedBy}
            onChange={(e) => handleChange("uploadedBy", e.target.value)}
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Status
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value as BylawItem["status"])
              }
              className="h-[48px] w-full appearance-none rounded-[12px] bg-white px-4 outline-none"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a7a]" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-[14px] font-medium text-[#222]">
          File Upload
        </label>
        <input
          type="file"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          className="block w-full text-[14px]"
        />
        {fileName && (
          <p className="mt-2 text-[13px] text-[#666]">Selected file: {fileName}</p>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-[12px] bg-[#27ae60] px-8 py-3 text-white"
        >
          {mode === "create" ? "Upload Bylaw" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}