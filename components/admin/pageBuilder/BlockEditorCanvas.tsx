"use client";

import { useState } from "react";
import {
  ChevronUp, ChevronDown, ChevronRight, ChevronDown as Expand,
  Trash2, Plus, GripVertical,
  Mountain, AlignLeft, CalendarDays, FileText, Users, HelpCircle, Megaphone, BarChart2,
} from "lucide-react";
import type { PageSection, BlockType } from "@/types/pageBuilder";
import { BLOCK_TYPE_LABELS } from "@/types/pageBuilder";
import { BlockTypeSelector } from "./BlockTypeSelector";
import { HeroBlockEditor } from "./HeroBlockEditor";
import { RichTextBlockEditor } from "./RichTextBlockEditor";
import { CtaBannerBlockEditor } from "./CtaBannerBlockEditor";
import { EventGridBlockEditor } from "./EventGridBlockEditor";
import { ReportListBlockEditor } from "./ReportListBlockEditor";
import { TeamGridBlockEditor } from "./TeamGridBlockEditor";
import { FaqBlockEditor } from "./FaqBlockEditor";
import { StatsBarBlockEditor } from "./StatsBarBlockEditor";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function defaultDataForType(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return { title: "", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "", overlayDark: false };
    case "rich-text":
      return { markdown: "" };
    case "cta-banner":
      return { heading: "", body: "", buttonLabel: "", buttonHref: "", variant: "teal" };
    case "event-grid":
      return { source: "firestore", limit: 6 };
    case "report-list":
      return { reports: [] };
    case "team-grid":
      return { source: "firestore" };
    case "faq-accordion":
      return { items: [] };
    case "stats-bar":
      return { stats: [] };
  }
}

const TYPE_ICONS: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  "hero": Mountain,
  "rich-text": AlignLeft,
  "event-grid": CalendarDays,
  "report-list": FileText,
  "team-grid": Users,
  "faq-accordion": HelpCircle,
  "cta-banner": Megaphone,
  "stats-bar": BarChart2,
};

const TYPE_COLORS: Record<BlockType, string> = {
  "hero": "bg-violet-100 text-violet-700",
  "rich-text": "bg-blue-100 text-blue-700",
  "event-grid": "bg-amber-100 text-amber-700",
  "report-list": "bg-orange-100 text-orange-700",
  "team-grid": "bg-pink-100 text-pink-700",
  "faq-accordion": "bg-cyan-100 text-cyan-700",
  "cta-banner": "bg-teal-100 text-teal-700",
  "stats-bar": "bg-green-100 text-green-700",
};

function previewText(section: PageSection): string {
  const d = section.data;
  switch (section.type) {
    case "hero":
      return String(d.title || "—");
    case "rich-text":
      return String(d.markdown || "—").replace(/[#*_`]/g, "").slice(0, 60) + (String(d.markdown || "").length > 60 ? "…" : "");
    case "cta-banner":
      return String(d.heading || "—");
    case "event-grid":
      return d.source === "firestore" ? "Canlı etkinlikler" : "Manuel etkinlik listesi";
    case "report-list": {
      const count = (d.reports as unknown[] | undefined)?.length ?? 0;
      return `${count} rapor`;
    }
    case "team-grid":
      return d.source === "firestore" ? "Tüm ekip üyeleri" : "Manuel üye listesi";
    case "faq-accordion": {
      const count = (d.items as unknown[] | undefined)?.length ?? 0;
      return `${count} soru`;
    }
    case "stats-bar": {
      const count = (d.stats as unknown[] | undefined)?.length ?? 0;
      return `${count} istatistik`;
    }
  }
}

// ── Editor dispatcher ─────────────────────────────────────────────────────────

function BlockSpecificEditor({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}) {
  switch (section.type) {
    case "hero":
      return <HeroBlockEditor data={section.data} onChange={onChange} />;
    case "rich-text":
      return <RichTextBlockEditor data={section.data} onChange={onChange} />;
    case "cta-banner":
      return <CtaBannerBlockEditor data={section.data} onChange={onChange} />;
    case "event-grid":
      return <EventGridBlockEditor data={section.data} onChange={onChange} />;
    case "report-list":
      return <ReportListBlockEditor data={section.data} onChange={onChange} />;
    case "team-grid":
      return <TeamGridBlockEditor data={section.data} onChange={onChange} />;
    case "faq-accordion":
      return <FaqBlockEditor data={section.data} onChange={onChange} />;
    case "stats-bar":
      return <StatsBarBlockEditor data={section.data} onChange={onChange} />;
    default:
      return (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 border border-amber-200">
          <span className="font-semibold">{BLOCK_TYPE_LABELS[section.type]}</span> editörü yakında eklenecek.
        </p>
      );
  }
}

// ── Main canvas ───────────────────────────────────────────────────────────────

interface BlockEditorCanvasProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
}

export function BlockEditorCanvas({ sections, onChange }: BlockEditorCanvasProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sort ascending by order for display
  const sorted = [...sections].sort((a, b) => a.order - b.order);

  function updateSections(next: PageSection[]) {
    const renumbered = next.map((s, i) => ({ ...s, order: i }));
    onChange(renumbered);
  }

  function moveSection(id: string, dir: "up" | "down") {
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const next = [...sorted];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    updateSections(next);
  }

  function deleteSection(id: string) {
    updateSections(sorted.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
    setDeleteConfirmId(null);
  }

  function updateBlockData(id: string, data: Record<string, unknown>) {
    onChange(sections.map((s) => (s.id === id ? { ...s, data } : s)));
  }

  function addBlock(type: BlockType) {
    const newSection: PageSection = {
      id: makeId(),
      type,
      data: defaultDataForType(type),
      order: sorted.length,
      visible: true,
    };
    updateSections([...sorted, newSection]);
    // Auto-expand the new block
    setExpandedId(newSection.id);
  }

  return (
    <div className="space-y-2">
      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-14 text-center">
          <p className="text-sm font-medium text-gray-500">Bu sayfa henüz blok içermiyor.</p>
          <p className="text-xs text-gray-400">Aşağıdan ilk bloğunuzu ekleyin.</p>
        </div>
      )}

      {/* Block rows */}
      {sorted.map((section, idx) => {
        const isExpanded = expandedId === section.id;
        const isConfirmingDelete = deleteConfirmId === section.id;
        const Icon = TYPE_ICONS[section.type];

        return (
          <div
            key={section.id}
            className={`rounded-xl border bg-white shadow-sm transition-shadow ${
              isExpanded ? "border-teal-300 shadow-md" : "border-gray-200"
            }`}
          >
            {/* Block header row */}
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Reorder arrows */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveSection(section.id, "up")}
                  disabled={idx === 0}
                  className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  title="Yukarı taşı"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveSection(section.id, "down")}
                  disabled={idx === sorted.length - 1}
                  className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20"
                  title="Aşağı taşı"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <GripVertical className="h-4 w-4 shrink-0 text-gray-200" />

              {/* Type badge */}
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shrink-0 ${TYPE_COLORS[section.type]}`}>
                <Icon className="h-3.5 w-3.5" />
                {BLOCK_TYPE_LABELS[section.type]}
              </span>

              {/* Preview text */}
              <span className="flex-1 min-w-0 truncate text-sm text-gray-500">
                {previewText(section)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {isConfirmingDelete ? (
                  <>
                    <span className="text-xs text-red-600 font-medium">Silinsin mi?</span>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Evet
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-50"
                    >
                      Hayır
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(section.id)}
                    className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500"
                    title="Bloğu sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                {/* Expand / collapse toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : section.id)}
                  className={`rounded-lg p-1.5 transition-colors ${
                    isExpanded
                      ? "bg-teal-100 text-teal-600"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                  title={isExpanded ? "Kapat" : "Düzenle"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Inline editor panel */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-5">
                <BlockSpecificEditor
                  section={section}
                  onChange={(data) => updateBlockData(section.id, data)}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Add block button */}
      <button
        onClick={() => setShowSelector(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3.5 text-sm font-medium text-gray-400 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600"
      >
        <Plus className="h-4 w-4" />
        Blok Ekle
      </button>

      {/* Block type selector modal */}
      {showSelector && (
        <BlockTypeSelector
          onSelect={addBlock}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
