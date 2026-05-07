"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { AnnouncementAudience } from "@/types/editorPanel";

function formatDateTR(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const statusOptions = ["published", "draft"];
const audienceOptions: { value: AnnouncementAudience; label: string }[] = [
  { value: "all", label: "Herkes" },
  { value: "members", label: "Üyeler" },
  { value: "volunteers", label: "Gönüllüler" },
  { value: "patients", label: "Hastalar" },
];

export default function AnnouncementsPage() {
  const { announcements, deleteAnnouncement } = useEditorPanel();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);

  function toggleSelection(
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  function clearFilters() {
    setSelectedStatuses([]);
    setSelectedAudiences([]);
    setSearchTerm("");
  }

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        `${item.title} ${item.content}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

      const matchesAudience =
        selectedAudiences.length === 0 ||
        selectedAudiences.includes(item.audience);

      return matchesSearch && matchesStatus && matchesAudience;
    });
  }, [announcements, searchTerm, selectedStatuses, selectedAudiences]);

  return (
    <EditorShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Duyurular</h1>

            <div className="relative mt-5 w-[320px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Duyurularda ara"
                className="h-10 w-full rounded-lg border border-gray-300 pl-11 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <Link
            href="/editorPanel/announcements/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            + Duyuru Ekle
          </Link>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-800">Filtrele</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">Durum</h4>
                  <div className="space-y-2">
                    {statusOptions.map((status) => {
                      const count = announcements.filter(
                        (item) => item.status === status
                      ).length;

                      return (
                        <label
                          key={status}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={() =>
                              toggleSelection(
                                status,
                                selectedStatuses,
                                setSelectedStatuses
                              )
                            }
                            className="h-4 w-4 accent-primary"
                          />
                          <span>
                            {status === "published" ? "Yayınlandı" : "Taslak"} ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Hedef Kitle
                  </h4>
                  <div className="space-y-2">
                    {audienceOptions.map((option) => {
                      const count = announcements.filter(
                        (item) => item.audience === option.value
                      ).length;

                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAudiences.includes(option.value)}
                            onChange={() =>
                              toggleSelection(
                                option.value,
                                selectedAudiences,
                                setSelectedAudiences
                              )
                            }
                            className="h-4 w-4 accent-primary"
                          />
                          <span>
                            {option.label} ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="mt-6 w-full rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Temizle
              </button>
            </div>

            <div>
              <div className="mb-3 flex justify-end text-sm text-gray-600">
                Bulundu: {filteredAnnouncements.length}
              </div>

              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-100 text-left text-xs font-medium text-gray-700">
                    <tr>
                      <th className="px-4 py-3">Başlık</th>
                      <th className="px-4 py-3">Hedef Kitle</th>
                      <th className="px-4 py-3">Yayın Tarihi</th>
                      <th className="px-4 py-3">Durum</th>
                      <th className="px-4 py-3">Sabit</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3"></th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAnnouncements.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-4">{item.title}</td>
                        <td className="px-4 py-4">
                          {audienceOptions.find((a) => a.value === item.audience)?.label}
                        </td>
                        <td className="px-4 py-4">{formatDateTR(item.publishedAt)}</td>
                        <td className="px-4 py-4">
                          {item.status === "published" ? "Yayınlandı" : "Taslak"}
                        </td>
                        <td className="px-4 py-4">{item.pinned ? "Evet" : "Hayır"}</td>
                        <td className="px-4 py-4">{item.id}</td>
                        <td className="px-4 py-4">
                          <Link href={`/editorPanel/announcements/${item.id}/edit`}>
                            <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => deleteAnnouncement(item.id)}>
                            <Trash2 className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </EditorShell>
  );
}