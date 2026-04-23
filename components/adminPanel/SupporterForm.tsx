"use client";

import { useMemo, useState } from "react";
import { SupporterItem } from "@/types/adminPanel";

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
  initialData?: SupporterItem;
  onSubmit: (data: SupporterItem) => void;
}

export default function SupporterForm({
  mode,
  initialData,
  onSubmit,
}: Props) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `supporter-${Date.now()}`,
      name: initialData?.name ?? "",
      category: initialData?.category ?? "",
      logoUrl: initialData?.logoUrl ?? "",
      since: initialData?.since ?? "",
      description: initialData?.description ?? "",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<SupporterItem>(initialForm);

  function handleChange<K extends keyof SupporterItem>(
    key: K,
    value: SupporterItem[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.since) {
      alert("Name, category ve başlangıç tarihi zorunlu!");
      return;
    }

    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* NAME */}
      <Input
        label="Supporter Name"
        value={formData.name}
        onChange={(v) => handleChange("name", v)}
      />

      {/* CATEGORY */}
      <Input
        label="Category"
        value={formData.category}
        onChange={(v) => handleChange("category", v)}
      />

      {/* SINCE DATE */}
      <div>
        <label className="block text-sm mb-1">Since (Başlangıç Tarihi)</label>
        <input
          type="date"
          value={formData.since}
          onChange={(e) => handleChange("since", e.target.value)}
          className="w-full p-3 rounded bg-white shadow"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm mb-1">Description (Opsiyonel)</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full p-3 rounded bg-white shadow min-h-[100px]"
          placeholder="Supporter hakkında açıklama..."
        />
      </div>

      {/* LOGO */}
      <div>
        <label className="block text-sm mb-1">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleChange("logoUrl", URL.createObjectURL(file));
            }
          }}
        />
      </div>

      <button className="bg-green-600 text-white px-6 py-3 rounded">
        {mode === "create" ? "Add Supporter" : "Save Changes"}
      </button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded bg-white shadow"
      />
    </div>
  );
}