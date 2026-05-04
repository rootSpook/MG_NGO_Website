"use client";

import { CheckCircle2, FileEdit } from "lucide-react";

type Status = "draft" | "published";

interface DraftPublishToggleProps {
  value: Status;
  onChange: (next: Status) => void;
  size?: "sm" | "md";
}

/** Reusable two-state toggle for draft / published switch. */
export function DraftPublishToggle({
  value,
  onChange,
  size = "md",
}: DraftPublishToggleProps) {
  const padding = size === "sm" ? "px-3 py-1.5" : "px-4 py-2";
  const text = size === "sm" ? "text-xs" : "text-sm";
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onChange("draft")}
        className={`flex items-center gap-1.5 rounded-md ${padding} ${text} font-medium transition-colors ${
          value === "draft"
            ? "bg-white text-amber-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <FileEdit className="h-3.5 w-3.5" />
        Taslak
      </button>
      <button
        type="button"
        onClick={() => onChange("published")}
        className={`flex items-center gap-1.5 rounded-md ${padding} ${text} font-medium transition-colors ${
          value === "published"
            ? "bg-white text-teal-700 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Yayında
      </button>
    </div>
  );
}
