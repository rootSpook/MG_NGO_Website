"use client";

import { useMemo, useState } from "react";
import { BoardMemberItem } from "@/types/adminPanel";

type BoardMemberFormMode = "create" | "edit";

interface BoardMemberFormProps {
  mode: BoardMemberFormMode;
  initialData?: BoardMemberItem;
  onSubmit: (data: BoardMemberItem) => void;
}

export default function BoardMemberForm({
  mode,
  initialData,
  onSubmit,
}: BoardMemberFormProps) {
  const initialForm = useMemo(
    () => ({
      id: initialData?.id ?? `board-${Date.now()}`,
      fullName: initialData?.fullName ?? "",
      roleTitle: initialData?.roleTitle ?? "",
      period: initialData?.period ?? "",
      specialization: initialData?.specialization ?? "",
      photoUrl: initialData?.photoUrl ?? "",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<BoardMemberItem>(initialForm);
  const [photoName, setPhotoName] = useState("");

  function handleChange<K extends keyof BoardMemberItem>(
    key: K,
    value: BoardMemberItem[K]
  ) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.roleTitle.trim() ||
      !formData.period.trim()
    ) {
      alert("Please fill in name, role/title and period fields.");
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
        <InputField
          label="Full Name"
          value={formData.fullName}
          onChange={(value) => handleChange("fullName", value)}
        />

        <InputField
          label="Role / Title"
          value={formData.roleTitle}
          onChange={(value) => handleChange("roleTitle", value)}
        />

        <InputField
          label="Period"
          value={formData.period}
          onChange={(value) => handleChange("period", value)}
          placeholder="2022–Present"
        />

        <InputField
          label="Specialization"
          value={formData.specialization}
          onChange={(value) => handleChange("specialization", value)}
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-[14px] font-medium text-[#666]">
          Photo
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPhotoName(file?.name ?? "");

            if (file) {
              handleChange("photoUrl", URL.createObjectURL(file));
            }
          }}
          className="block w-full text-[14px]"
        />

        {photoName && (
          <p className="mt-2 text-[13px] text-[#666]">
            Selected photo: {photoName}
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-[12px] bg-[#27ae60] px-8 py-3 text-[17px] font-medium text-white"
        >
          {mode === "create" ? "Add Member" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#666]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[52px] w-full rounded-[12px] bg-white px-4 outline-none shadow-sm"
      />
    </div>
  );
}