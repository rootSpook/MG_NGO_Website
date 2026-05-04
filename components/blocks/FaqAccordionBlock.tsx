"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FaqBlockData } from "@/types/pageBuilder";

interface FaqAccordionBlockProps {
  data: Record<string, unknown>;
}

export function FaqAccordionBlock({ data }: FaqAccordionBlockProps) {
  const { items = [] } = data as unknown as FaqBlockData;
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="overflow-hidden rounded-lg bg-gray-100">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              {openIndex === index ? (
                <Minus className="h-5 w-5 flex-shrink-0 text-gray-600" />
              ) : (
                <Plus className="h-5 w-5 flex-shrink-0 text-gray-600" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
