"use client";

import {
  ImpactItemsEditor,
  type ImpactItemEntry,
  makeImpactId,
} from "@/components/admin/shared/ImpactItemsEditor";

interface InlineImpactManagerProps {
  items: ImpactItemEntry[];
  onChange: (items: ImpactItemEntry[]) => void;
}

/**
 * Wraps the reusable Impact editor in the standard inline-manager card style
 * used by the Menu Management page.
 */
export function InlineImpactManager({ items, onChange }: InlineImpactManagerProps) {
  const normalized: ImpactItemEntry[] = items.map((item) => ({
    id: item.id || makeImpactId(),
    icon: item.icon || "sparkles",
    title: item.title ?? "",
    description: item.description ?? "",
  }));

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Etki Bölümü
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Bağışların etkilerini gösteren kartları yönetin. Her kart için bir sembol seçin.
        </p>
      </div>

      <ImpactItemsEditor items={normalized} onChange={onChange} />
    </div>
  );
}
