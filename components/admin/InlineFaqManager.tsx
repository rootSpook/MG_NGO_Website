"use client";

import { FaqItemsEditor, type FaqItemEntry, makeFaqId } from "@/components/admin/shared/FaqItemsEditor";

interface InlineFaqManagerProps {
  items: FaqItemEntry[];
  onChange: (items: FaqItemEntry[]) => void;
}

/**
 * Wraps the reusable FAQ editor inside the standard inline-manager card so
 * it visually matches the other Menu Management sections.
 */
export function InlineFaqManager({ items, onChange }: InlineFaqManagerProps) {
  // Normalise legacy items that may not have an id yet
  const normalized: FaqItemEntry[] = items.map((item) => ({
    id: item.id || makeFaqId(),
    question: item.question ?? "",
    answer: item.answer ?? "",
  }));

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          SSS / Sıkça Sorulan Sorular
        </p>
        <p className="mt-1 text-sm text-gray-500">
          İletişim sayfasındaki SSS bölümünde gösterilecek soru ve cevapları yönetin.
        </p>
      </div>

      <FaqItemsEditor items={normalized} onChange={onChange} />
    </div>
  );
}
