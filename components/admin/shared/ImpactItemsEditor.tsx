"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { IconPicker, getImpactIcon } from "./IconPicker";

export interface ImpactItemEntry {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ImpactItemsEditorProps {
  items: ImpactItemEntry[];
  onChange: (next: ImpactItemEntry[]) => void;
  label?: string;
  hint?: string;
  addLabel?: string;
}

function makeId() {
  return `impact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

const textareaCls =
  "w-full min-h-16 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

/** Reusable editor for the Donation page's "Etki" cards. */
export function ImpactItemsEditor({
  items,
  onChange,
  label = "Etki Kartları",
  hint = "Bağışların yansımalarını anlatan kartları yönetin. Her karta bir sembol seçin.",
  addLabel = "Etki Kartı Ekle",
}: ImpactItemsEditorProps) {
  function update(id: string, patch: Partial<ImpactItemEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function move(id: string, dir: "up" | "down") {
    const idx = items.findIndex((item) => item.id === id);
    if (idx < 0) return;
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= items.length) return;
    const next = [...items];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  }

  function add() {
    onChange([
      ...items,
      { id: makeId(), icon: "sparkles", title: "", description: "" },
    ]);
  }

  return (
    <div>
      {label && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>
      )}
      {hint && <p className="mb-3 text-xs text-gray-400">{hint}</p>}

      <div className="space-y-3">
        {items.map((item, idx) => {
          const Icon = getImpactIcon(item.icon);
          return (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  #{idx + 1}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(item.id, "up")}
                    disabled={idx === 0}
                    className="rounded p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30"
                    title="Yukarı taşı"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item.id, "down")}
                    disabled={idx === items.length - 1}
                    className="rounded p-1 text-gray-300 hover:text-gray-600 disabled:opacity-30"
                    title="Aşağı taşı"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  className={`${inputCls} font-medium`}
                  placeholder="Başlık (örn. Tıbbi Erişim)"
                  value={item.title}
                  onChange={(e) => update(item.id, { title: e.target.value })}
                />
                <textarea
                  className={textareaCls}
                  placeholder="Bu kartta gösterilecek kısa açıklama"
                  value={item.description}
                  onChange={(e) => update(item.id, { description: e.target.value })}
                />
                <IconPicker
                  value={item.icon}
                  onChange={(icon) => update(item.id, { icon })}
                />
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-6 text-center text-xs text-gray-400">
            Henüz etki kartı eklenmedi.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

export function makeImpactId() {
  return makeId();
}
