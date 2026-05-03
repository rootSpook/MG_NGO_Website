"use client";

import { X, Mountain, AlignLeft, CalendarDays, FileText, Users, HelpCircle, Megaphone, BarChart2 } from "lucide-react";
import type { BlockType } from "@/types/pageBuilder";
import { BLOCK_TYPE_LABELS } from "@/types/pageBuilder";

const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  "hero": "Büyük arka plan görseli, başlık ve eylem butonu",
  "rich-text": "Markdown formatında zengin metin içeriği",
  "event-grid": "Etkinlik kartları ızgarası",
  "report-list": "PDF ve araştırma belgesi listesi",
  "team-grid": "Ekip üyeleri kartları",
  "faq-accordion": "Soru–cevap akordeon paneli",
  "cta-banner": "Dikkat çekici eylem çağrısı şeridi",
  "stats-bar": "Sayısal istatistik gösterge şeridi",
};

const BLOCK_ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  "hero": Mountain,
  "rich-text": AlignLeft,
  "event-grid": CalendarDays,
  "report-list": FileText,
  "team-grid": Users,
  "faq-accordion": HelpCircle,
  "cta-banner": Megaphone,
  "stats-bar": BarChart2,
};

const BLOCK_ORDER: BlockType[] = [
  "hero", "rich-text", "cta-banner", "event-grid",
  "report-list", "team-grid", "faq-accordion", "stats-bar",
];

interface BlockTypeSelectorProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

export function BlockTypeSelector({ onSelect, onClose }: BlockTypeSelectorProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Blok Ekle</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Block grid */}
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
          {BLOCK_ORDER.map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => { onSelect(type); onClose(); }}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 p-4 text-center transition-all hover:border-primary hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-secondary">
                  <Icon className="h-5 w-5 text-gray-500 group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 group-hover:text-primary leading-tight">
                    {BLOCK_TYPE_LABELS[type]}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-gray-400 group-hover:text-primary-foreground/900">
                    {BLOCK_DESCRIPTIONS[type]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
