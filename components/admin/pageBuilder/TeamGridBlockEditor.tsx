"use client";

import { Plus, Trash2 } from "lucide-react";
import type { TeamGridBlockData } from "@/types/pageBuilder";
import { ImageUploadField } from "@/components/admin/shared/ImageUploadField";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

interface TeamGridBlockEditorProps {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

function makeId() {
  return `team-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function TeamGridBlockEditor({ data, onChange }: TeamGridBlockEditorProps) {
  const d = data as unknown as TeamGridBlockData;
  const members = d.manualMembers ?? [];

  function set(patch: Partial<TeamGridBlockData>) {
    onChange({ ...d, ...patch });
  }

  function update(id: string, patch: Partial<NonNullable<TeamGridBlockData["manualMembers"]>[number]>) {
    set({
      manualMembers: members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  }

  function remove(id: string) {
    set({ manualMembers: members.filter((m) => m.id !== id) });
  }

  function add() {
    set({
      manualMembers: [
        ...members,
        { id: makeId(), name: "", title: "", bio: "", photoUrl: "" },
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
              {option === "firestore" ? "Yönetim Kurulu Listesi" : "Manuel Üye Listesi"}
            </button>
          ))}
        </div>
      </div>

      {d.source === "manual" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Üye Listesi
            </p>
            <span className="text-xs text-gray-400">{members.length} kişi</span>
          </div>

          {members.map((m) => (
            <div key={m.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  Üye
                </span>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <input
                  className={inputCls}
                  placeholder="İsim"
                  value={m.name}
                  onChange={(e) => update(m.id, { name: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Görev / Ünvan"
                  value={m.title}
                  onChange={(e) => update(m.id, { title: e.target.value })}
                />
              </div>
              <textarea
                className={`${inputCls} mt-2 min-h-16`}
                placeholder="Kısa biyografi"
                value={m.bio}
                onChange={(e) => update(m.id, { bio: e.target.value })}
              />
              <div className="mt-2">
                <ImageUploadField
                  label="Profil Fotoğrafı"
                  value={m.photoUrl}
                  onChange={(url) => update(m.id, { photoUrl: url })}
                  aspectClassName="aspect-square"
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
            Üye Ekle
          </button>
        </div>
      )}
    </div>
  );
}
