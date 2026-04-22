"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Mail, Phone } from "lucide-react";
import {
  AdminContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "@/lib/firebase/adminServices";

const STATUS_LABELS: Record<AdminContactMessage["status"], string> = {
  new: "Yeni",
  inProgress: "İşlemde",
  resolved: "Çözüldü",
  spam: "Spam",
};

const STATUS_COLORS: Record<AdminContactMessage["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  inProgress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  spam: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<AdminContactMessage["status"] | "all">("all");
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getContactMessages()
      .then((msgs) => {
        setMessages(msgs);
        const n: Record<string, string> = {};
        msgs.forEach((m) => { n[m.id] = m.internalNotes; });
        setNotes(n);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(
    id: string,
    status: AdminContactMessage["status"]
  ) {
    setSaving(id);
    try {
      await updateContactMessageStatus(id, status, notes[id]);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  async function handleNotesSave(id: string) {
    setSaving(id);
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    try {
      await updateContactMessageStatus(id, msg.status, notes[id]);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  }

  const filtered =
    filter === "all" ? messages : messages.filter((m) => m.status === filter);

  const counts = messages.reduce(
    (acc, m) => { acc[m.status] = (acc[m.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İletişim Mesajları</h1>
        <p className="mt-1 text-sm text-gray-500">
          Web sitesi iletişim formundan gelen mesajlar.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "new", "inProgress", "resolved", "spam"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s === "all" ? "Tümü" : STATUS_LABELS[s]}
            {s !== "all" && counts[s] ? (
              <span className="ml-1.5 rounded-full bg-white/30 px-1.5 py-0.5 text-xs">
                {counts[s]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400">
          Bu kategoride mesaj yok.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Row header */}
              <div
                className="flex cursor-pointer items-center gap-4 p-4"
                onClick={() =>
                  setExpandedId(expandedId === msg.id ? null : msg.id)
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{msg.senderName}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[msg.status]}`}>
                      {STATUS_LABELS[msg.status]}
                    </span>
                  </div>
                  <p className="truncate text-sm text-gray-500">{msg.subject}</p>
                </div>
                <p className="shrink-0 text-xs text-gray-400">{formatDate(msg.createdAt)}</p>
                {expandedId === msg.id ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                )}
              </div>

              {/* Expanded details */}
              {expandedId === msg.id && (
                <div className="border-t border-gray-100 p-4 space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> {msg.senderEmail}
                    </span>
                    {msg.senderPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" /> {msg.senderPhone}
                      </span>
                    )}
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 whitespace-pre-wrap">
                    {msg.messageBody}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      İç Notlar
                    </label>
                    <textarea
                      rows={2}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={notes[msg.id] ?? ""}
                      onChange={(e) =>
                        setNotes((p) => ({ ...p, [msg.id]: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["new", "inProgress", "resolved", "spam"] as const).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(msg.id, s)}
                          disabled={saving === msg.id || msg.status === s}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                            msg.status === s
                              ? `${STATUS_COLORS[s]} ring-1 ring-current`
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {STATUS_LABELS[s]}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handleNotesSave(msg.id)}
                      disabled={saving === msg.id}
                      className="ml-auto rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:opacity-60"
                    >
                      {saving === msg.id ? "Kaydediliyor…" : "Notu Kaydet"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
