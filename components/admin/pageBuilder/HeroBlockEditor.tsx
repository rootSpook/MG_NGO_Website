"use client";

import type { HeroBlockData } from "@/types/pageBuilder";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

interface HeroBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function HeroBlockEditor({ data, onChange }: HeroBlockEditorProps) {
  const d = data as unknown as HeroBlockData;

  function set(patch: Partial<HeroBlockData>) {
    onChange({ ...d, ...patch });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Başlık
          </label>
          <input
            className={inputCls}
            value={d.title ?? ""}
            placeholder="Hero başlığı…"
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Alt Başlık
          </label>
          <input
            className={inputCls}
            value={d.subtitle ?? ""}
            placeholder="Kısa açıklama…"
            onChange={(e) => set({ subtitle: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Arkaplan Görseli URL
        </label>
        <input
          className={inputCls}
          value={d.imageUrl ?? ""}
          placeholder="https://…"
          onChange={(e) => set({ imageUrl: e.target.value })}
        />
        {d.imageUrl && (
          <img
            src={d.imageUrl}
            alt="önizleme"
            className="mt-2 h-28 w-full rounded-lg object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Buton Metni
          </label>
          <input
            className={inputCls}
            value={d.ctaLabel ?? ""}
            placeholder="Daha fazla bilgi…"
            onChange={(e) => set({ ctaLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Buton Bağlantısı
          </label>
          <input
            className={inputCls}
            value={d.ctaHref ?? ""}
            placeholder="/sayfa veya https://…"
            onChange={(e) => set({ ctaHref: e.target.value })}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-primary focus:ring-primary"
          checked={Boolean(d.overlayDark)}
          onChange={(e) => set({ overlayDark: e.target.checked })}
        />
        Daha koyu karartma katmanı kullan
      </label>
    </div>
  );
}
