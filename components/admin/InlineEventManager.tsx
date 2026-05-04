"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, RotateCcw, Search } from "lucide-react";
import EventForm from "@/components/editorPanel/EventForm";
import type { EventItem } from "@/types/editorPanel";
import {
  createEditorEvent,
  getEditorEvents,
  updateEditorEvent,
} from "@/lib/firebase/editorServices";
import { revalidatePublicPathAction } from "@/app/admin/actions";

type SortMode = "newest" | "oldest";

function formatDateTR(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function publicStatusLabel(status: EventItem["status"]) {
  if (status === "active") return "Yayında";
  if (status === "planned") return "Taslak";
  if (status === "done") return "Tamamlandı";
  return "İptal";
}

export function InlineEventManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getEditorEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (!query.trim()) return true;
        return `${event.title} ${event.type} ${event.city} ${event.venue} ${event.location}`
          .toLowerCase()
          .includes(query.toLowerCase());
      })
      .sort((a, b) => {
        const left = new Date(a.date).getTime();
        const right = new Date(b.date).getTime();
        return sortMode === "newest" ? right - left : left - right;
      });
  }, [events, query, sortMode]);

  async function refreshPublicEvents() {
    await revalidatePublicPathAction("/events");
  }

  async function handleCreate(event: EventItem) {
    const { id: _id, ...payload } = event;
    const id = await createEditorEvent(payload);
    const next = { ...event, id };
    setEvents((prev) => [next, ...prev]);
    setCreating(false);
    await refreshPublicEvents();
  }

  async function handleUpdate(event: EventItem) {
    await updateEditorEvent(event.id, event);
    setEvents((prev) => prev.map((item) => (item.id === event.id ? event : item)));
    setEditingEvent(null);
    await refreshPublicEvents();
  }

  async function setStatus(event: EventItem, status: EventItem["status"]) {
    await updateEditorEvent(event.id, { status });
    setEvents((prev) => prev.map((item) => (item.id === event.id ? { ...item, status } : item)));
    await refreshPublicEvents();
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Etkinlikler</p>
          <p className="mt-1 text-sm text-gray-500">
            Etkinlik ekleme, düzenleme, yayına alma ve taslağa çekme işlemleri bu sayfadan yapılır.
          </p>
        </div>
        <button
          onClick={() => {
            setCreating((prev) => !prev);
            setEditingEvent(null);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Etkinlik Ekle
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_190px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Etkinliklerde ara"
            className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
          />
        </label>
        <select
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value as SortMode)}
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-teal-500"
        >
          <option value="newest">Yeniden eskiye</option>
          <option value="oldest">Eskiden yeniye</option>
        </select>
      </div>

      {creating && (
        <EventForm mode="create" onSubmit={handleCreate} onClear={() => setCreating(false)} />
      )}

      {editingEvent && (
        <EventForm
          mode="edit"
          initialData={editingEvent}
          onSubmit={handleUpdate}
          onClear={() => setEditingEvent(null)}
        />
      )}

      {loading ? (
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Etkinlik</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Konum</th>
                <th className="px-4 py-3">Tür</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{event.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-teal-500" />
                      {formatDateTR(event.date)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{event.city}</td>
                  <td className="px-4 py-3 text-gray-600">{event.type}</td>
                  <td className="px-4 py-3">
                    <span className={event.status === "active" ? "text-green-700" : "text-amber-700"}>
                      {publicStatusLabel(event.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setCreating(false);
                        }}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                        title="Düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setStatus(event, event.status === "active" ? "planned" : "active")}
                        className="flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        {event.status === "active" ? "Taslağa Al" : "Yayınla"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Etkinlik bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
