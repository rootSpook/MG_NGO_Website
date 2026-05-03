"use client";

import type { RichTextBlockData } from "@/types/pageBuilder";

interface RichTextBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function RichTextBlockEditor({ data, onChange }: RichTextBlockEditorProps) {
  const d = data as unknown as RichTextBlockData;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
        İçerik (Markdown)
      </label>
      <textarea
        rows={12}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs leading-relaxed focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-y"
        value={d.markdown ?? ""}
        placeholder="Markdown formatında içerik yazın…"
        onChange={(e) => onChange({ ...d, markdown: e.target.value })}
      />
      <p className="text-xs text-gray-400">
        **kalın**, *italik*, ## başlık, - liste, [bağlantı](url)
      </p>
    </div>
  );
}
