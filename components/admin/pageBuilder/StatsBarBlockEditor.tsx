"use client";

import { Plus, Trash2 } from "lucide-react";
import type { StatsBarBlockData } from "@/types/pageBuilder";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

interface StatsBarBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function makeId() {
  return `stat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function StatsBarBlockEditor({ data, onChange }: StatsBarBlockEditorProps) {
  const d = data as unknown as StatsBarBlockData;
  const stats = d.stats ?? [];

  function setStats(next: StatsBarBlockData["stats"]) {
    onChange({ ...d, stats: next });
  }

  function update(id: string, patch: Partial<NonNullable<StatsBarBlockData["stats"]>[number]>) {
    setStats(stats.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function remove(id: string) {
    setStats(stats.filter((s) => s.id !== id));
  }

  function add() {
    setStats([...stats, { id: makeId(), value: "", label: "" }]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          İstatistikler
        </p>
        <span className="text-xs text-gray-400">{stats.length} adet</span>
      </div>

      {stats.map((stat) => (
        <div key={stat.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
              İstatistik
            </span>
            <button
              type="button"
              onClick={() => remove(stat.id)}
              className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              className={`${inputCls} font-semibold`}
              placeholder="Değer (örn. 1.200+)"
              value={stat.value}
              onChange={(e) => update(stat.id, { value: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder="Etiket (örn. Aktif Üye)"
              value={stat.label}
              onChange={(e) => update(stat.id, { label: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
      >
        <Plus className="h-4 w-4" />
        İstatistik Ekle
      </button>
    </div>
  );
}
