"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ReportItem } from "@/types/adminPanel";

type ReportFormMode = "create" | "edit";

interface ReportFormProps {
  mode: ReportFormMode;
  initialData?: ReportItem;
  onSubmit: (data: ReportItem) => void;
}

export default function ReportForm({
  mode,
  initialData,
  onSubmit,
}: ReportFormProps) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `report-${Date.now()}`,
      year: initialData?.year ?? String(new Date().getFullYear()),
      title: initialData?.title ?? "",
      category: initialData?.category ?? "Annual",
      fileSize: initialData?.fileSize ?? "0 MB",
      uploadDate: initialData?.uploadDate ?? new Date().toISOString().slice(0, 10),
      status: initialData?.status ?? "published",
      fileType: initialData?.fileType ?? "PDF",
      uploadedBy: initialData?.uploadedBy ?? "Admin",
      fileUrl: initialData?.fileUrl ?? "#",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<ReportItem>(initialForm);
  const [fileName, setFileName] = useState("");

  function handleChange<K extends keyof ReportItem>(key: K, value: ReportItem[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.title || !formData.year || !formData.uploadDate) {
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
            Report Title
          </label>
          <input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Year
          </label>
          <input
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value)}
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Category
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="h-[48px] w-full appearance-none rounded-[12px] bg-white px-4 outline-none"
            >
              <option value="Annual">Annual</option>
              <option value="Financial">Financial</option>
              <option value="Meeting">Meeting</option>
              <option value="Operational">Operational</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a7a7a]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            Upload Date
          </label>
          <input
            type="date"
            value={formData.uploadDate}
            onChange={(e) => handleChange("uploadDate", e.target.value)}
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-medium text-[#222]">
            File Type
          </label>
          <div className="relative">
            <select
              value={formData.fileType}
              onChange={(e) =>
                handleChange("fileType", e.target.value as ReportItem["fileType"])
              }
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
            Status
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value as ReportItem["status"])
              }
              className="h-[48px] w-full appearance-none rounded-[12px] bg-white px-4 outline-none"
            >
              <option value="published">Published</option>
              <option value="archived">Archived</option>
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
            File Size
          </label>
          <input
            value={formData.fileSize}
            onChange={(e) => handleChange("fileSize", e.target.value)}
            placeholder="e.g. 2.4 MB"
            className="h-[48px] w-full rounded-[12px] bg-white px-4 outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-[14px] font-medium text-[#222]">
          File Upload
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFileName(file?.name ?? "");
          }}
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
          {mode === "create" ? "Upload Report" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}