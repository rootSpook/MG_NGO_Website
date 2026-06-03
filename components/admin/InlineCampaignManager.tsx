"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { CampaignItem } from "@/types/editorPanel";
import {
  createEditorCampaign,
  deleteEditorCampaign,
  getEditorCampaigns,
  updateEditorCampaign,
} from "@/lib/firebase/editorServices";
import { revalidatePublicPathAction } from "@/app/admin/actions";

const emptyCampaign: Omit<CampaignItem, "id"> = {
  title: "",
  description: "",
  goalAmount: 0,
  currency: "TRY",
  raisedAmount: 0,
  status: "active",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  coverImageUrl: "",
  featured: false,
};

function CampaignForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<CampaignItem, "id">;
  onSave: (data: Omit<CampaignItem, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const cls = "h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-teal-500";

  return (
    <div className="space-y-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input className={cls} placeholder="Başlık" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        <input className={cls} type="number" placeholder="Hedef Bütçe" value={form.goalAmount} onChange={(e) => setForm((p) => ({ ...p, goalAmount: Number(e.target.value) }))} />
        <input className={cls} type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
        <input className={cls} type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
        <select className={cls} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as CampaignItem["status"] }))}>
          <option value="active">Aktif</option>
          <option value="draft">Taslak</option>
          <option value="paused">Duraklatıldı</option>
          <option value="completed">Tamamlandı</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setForm((p) => ({ ...p, coverImageUrl: String(reader.result ?? "") }));
            reader.readAsDataURL(file);
          }}
          className="block w-full text-sm"
        />
      </div>
      <textarea
        value={form.description}
        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
        rows={3}
        placeholder="Açıklama"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
      />
      {form.coverImageUrl && (
        <img src={form.coverImageUrl} alt="Kampanya görseli" className="h-32 w-full rounded-lg object-cover" />
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">İptal</button>
        <button onClick={() => onSave(form)} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white">Kaydet</button>
      </div>
    </div>
  );
}

export function InlineCampaignManager() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getEditorCampaigns().then(setCampaigns).catch(console.error);
  }, []);

  async function refreshDonate() {
    await revalidatePublicPathAction("/donate");
  }

  async function handleCreate(data: Omit<CampaignItem, "id">) {
    const id = await createEditorCampaign(data);
    setCampaigns((prev) => [{ id, ...data }, ...prev]);
    setAdding(false);
    await refreshDonate();
  }

  async function handleUpdate(id: string, data: Omit<CampaignItem, "id">) {
    await updateEditorCampaign(id, data);
    setCampaigns((prev) => prev.map((item) => (item.id === id ? { id, ...data } : item)));
    setEditingId(null);
    await refreshDonate();
  }

  async function handleDelete(id: string) {
    await deleteEditorCampaign(id);
    setCampaigns((prev) => prev.filter((item) => item.id !== id));
    await refreshDonate();
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bağış Kampanyaları</p>
          <p className="mt-1 text-sm text-gray-500">Kampanya başlığı, açıklaması, hedef bütçesi, süresi ve görseli buradan yönetilir.</p>
        </div>
        <button onClick={() => { setAdding(true); setEditingId(null); }} className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white">
          <Plus className="h-4 w-4" />
          Kampanya Ekle
        </button>
      </div>

      {adding && <CampaignForm initial={emptyCampaign} onSave={handleCreate} onCancel={() => setAdding(false)} />}

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          editingId === campaign.id ? (
            <CampaignForm key={campaign.id} initial={campaign} onSave={(data) => handleUpdate(campaign.id, data)} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={campaign.id} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3">
              {campaign.coverImageUrl && <img src={campaign.coverImageUrl} alt={campaign.title} className="h-16 w-20 rounded object-cover" />}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{campaign.title}</p>
                <p className="text-sm text-gray-500">{campaign.description}</p>
                <p className="mt-1 text-xs text-gray-400">Hedef: {campaign.goalAmount} {campaign.currency} · {campaign.status}</p>
              </div>
              <button onClick={() => setEditingId(campaign.id)} className="rounded-lg border border-gray-200 p-2 text-gray-500"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(campaign.id)} className="rounded-lg border border-red-100 p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
