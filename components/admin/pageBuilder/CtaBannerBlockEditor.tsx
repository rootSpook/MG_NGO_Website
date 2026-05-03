"use client";

import type { CtaBannerBlockData } from "@/types/pageBuilder";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

interface CtaBannerBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

export function CtaBannerBlockEditor({ data, onChange }: CtaBannerBlockEditorProps) {
  const d = data as unknown as CtaBannerBlockData;

  function set(patch: Partial<CtaBannerBlockData>) {
    onChange({ ...d, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Başlık
        </label>
        <input
          className={inputCls}
          value={d.heading ?? ""}
          placeholder="Bağış yaparak destek olun…"
          onChange={(e) => set({ heading: e.target.value })}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Açıklama
        </label>
        <textarea
          rows={3}
          className={`${inputCls} resize-none`}
          value={d.body ?? ""}
          placeholder="Kısa açıklama metni…"
          onChange={(e) => set({ body: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Buton Metni
          </label>
          <input
            className={inputCls}
            value={d.buttonLabel ?? ""}
            placeholder="Bağış Yap…"
            onChange={(e) => set({ buttonLabel: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Buton Bağlantısı
          </label>
          <input
            className={inputCls}
            value={d.buttonHref ?? ""}
            placeholder="/bagis veya https://…"
            onChange={(e) => set({ buttonHref: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Renk Teması
        </label>
        <div className="flex gap-3">
          {(["teal", "dark", "light"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set({ variant: v })}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                (d.variant ?? "teal") === v
                  ? "border-primary bg-secondary/50 text-primary"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {v === "teal" ? "Teal" : v === "dark" ? "Koyu" : "Açık"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
