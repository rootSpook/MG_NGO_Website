"use client";

import type { FaqBlockData } from "@/types/pageBuilder";
import { FaqItemsEditor, type FaqItemEntry } from "@/components/admin/shared/FaqItemsEditor";

interface FaqBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function FaqBlockEditor({ data, onChange }: FaqBlockEditorProps) {
  const d = data as unknown as FaqBlockData;
  const items: FaqItemEntry[] = (d.items ?? []) as FaqItemEntry[];

  return (
    <FaqItemsEditor
      items={items}
      onChange={(next) => onChange({ ...d, items: next })}
    />
  );
}
