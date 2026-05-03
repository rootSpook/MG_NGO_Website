"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";
import {
  BoardMember,
  getBoardMembers,
  createBoardMember,
  updateBoardMember,
  deleteBoardMember,
} from "@/lib/firebase/adminServices";

const emptyMember: Omit<BoardMember, "id"> = {
  name: "",
  title: "",
  bio: "",
  photoUrl: "",
  sortOrder: 0,
};

function MemberForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Omit<BoardMember, "id">;
  onSave: (data: Omit<BoardMember, "id">) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (field: keyof typeof form, value: string | number) =>
    setForm((p) => ({ ...p, [field]: value }));

  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="space-y-3 rounded-xl border border-primary bg-secondary/50 p-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Ad Soyad</label>
          <input className={cls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Ünvan / Görev</label>
          <input className={cls} value={form.title} onChange={(e) => set("title", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Biyografi</label>
        <textarea
          rows={3}
          className={`${cls} resize-none`}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Fotoğraf URL</label>
          <input className={cls} value={form.photoUrl} onChange={(e) => set("photoUrl", e.target.value)} placeholder="https://…" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Sıralama</label>
          <input
            type="number"
            className={cls}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
          <X className="h-4 w-4" /> İptal
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name.trim()}
          className="flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
        >
          <Check className="h-4 w-4" /> {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

export default function BoardMembersPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBoardMembers()
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: Omit<BoardMember, "id">) {
    setSaving(true);
    try {
      const id = await createBoardMember(data);
      setMembers((prev) => [...prev, { id, ...data }]);
      setAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, data: Omit<BoardMember, "id">) {
    setSaving(true);
    try {
      await updateBoardMember(id, data);
      setMembers((prev) => prev.map((m) => (m.id === id ? { id, ...data } : m)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) return;
    try {
      await deleteBoardMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yönetim Kurulu</h1>
          <p className="mt-1 text-sm text-gray-500">
            Hakkımızda sayfasında gösterilecek üyeler.
          </p>
        </div>
        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditingId(null); }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            <Plus className="h-4 w-4" /> Üye Ekle
          </button>
        )}
      </div>

      {adding && (
        <MemberForm
          initial={emptyMember}
          onSave={handleCreate}
          onCancel={() => setAdding(false)}
          saving={saving}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : members.length === 0 && !adding ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          Henüz üye eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) =>
            editingId === member.id ? (
              <MemberForm
                key={member.id}
                initial={member}
                onSave={(data) => handleUpdate(member.id, data)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-primary">{member.title}</p>
                  {member.bio && (
                    <p className="mt-1 truncate text-xs text-gray-500">{member.bio}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingId(member.id); setAdding(false); }}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
