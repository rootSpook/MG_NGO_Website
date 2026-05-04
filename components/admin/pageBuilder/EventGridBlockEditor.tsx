"use client";

import { Plus, Trash2 } from "lucide-react";
import type { EventGridBlockData } from "@/types/pageBuilder";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

interface EventGridBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function makeId() {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function EventGridBlockEditor({ data, onChange }: EventGridBlockEditorProps) {
  const d = data as unknown as EventGridBlockData;
  const events = d.manualEvents ?? [];

  function set(patch: Partial<EventGridBlockData>) {
    onChange({ ...d, ...patch });
  }

  function updateEvent(id: string, patch: Partial<NonNullable<EventGridBlockData["manualEvents"]>[number]>) {
    set({
      manualEvents: events.map((event) => (event.id === id ? { ...event, ...patch } : event)),
    });
  }

  function removeEvent(id: string) {
    set({ manualEvents: events.filter((event) => event.id !== id) });
  }

  function addEvent() {
    set({
      manualEvents: [
        ...events,
        { id: makeId(), title: "", date: "", location: "", imageUrl: "", href: "" },
      ],
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Veri Kaynağı
        </label>
        <div className="flex gap-2">
          {(["firestore", "manual"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => set({ source: option })}
              className={`flex-1 rounded-lg border py-2 text-sm font-medium ${
                (d.source ?? "firestore") === option
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {option === "firestore" ? "Canlı Etkinlikler" : "Manuel Liste"}
            </button>
          ))}
        </div>
      </div>

      {d.source !== "manual" && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Gösterilecek Etkinlik Sayısı
          </label>
          <input
            type="number"
            min={1}
            max={24}
            className={inputCls}
            value={d.limit ?? 6}
            onChange={(e) => set({ limit: Number(e.target.value) || 6 })}
          />
        </div>
      )}

      {d.source === "manual" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Manuel Etkinlikler
            </p>
            <span className="text-xs text-gray-400">{events.length} etkinlik</span>
          </div>

          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  Etkinlik
                </span>
                <button
                  type="button"
                  onClick={() => removeEvent(event.id)}
                  className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className={inputCls}
                  placeholder="Başlık"
                  value={event.title}
                  onChange={(e) => updateEvent(event.id, { title: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Tarih (örn. 12 Mayıs 2025)"
                  value={event.date}
                  onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Konum (Şehir / Mekan)"
                  value={event.location}
                  onChange={(e) => updateEvent(event.id, { location: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Bağlantı (örn. /events/...)"
                  value={event.href}
                  onChange={(e) => updateEvent(event.id, { href: e.target.value })}
                />
              </div>
              <div className="mt-2">
                <ImageUploadField
                  label="Etkinlik Görseli"
                  value={event.imageUrl}
                  onChange={(url) => updateEvent(event.id, { imageUrl: url })}
                  aspectClassName="aspect-[16/9]"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEvent}
            className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
          >
            <Plus className="h-4 w-4" />
            Etkinlik Ekle
          </button>
        </div>
      )}
    </div>
  );
}
