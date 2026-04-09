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
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[52px] font-bold text-black">Duyurular</h1>

            <div className="relative mt-5 w-[320px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Duyurularda ara"
                className="h-[46px] w-full rounded-[12px] bg-[#efefef] pl-11 pr-4 text-[15px] outline-none"
              />
            </div>
          </div>

          <Link
            href="/editorPanel/announcements/new"
            className="mt-8 rounded-full border-2 border-[#2f80ed] px-6 py-3 text-[18px] font-medium text-[#2f80ed] transition hover:bg-[#eef5ff]"
          >
            + Duyuru Ekle
          </Link>
        </div>

        <section className="rounded-[24px] bg-[#e8e8e8] p-5 shadow-md">
          <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
            <div className="rounded-[18px] bg-[#f1f1f1] p-5">
              <h3 className="mb-4 text-[18px] font-semibold text-black">Filtrele</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-[14px] font-medium text-[#222]">Durum</h4>
                  <div className="space-y-2">
                    {statusOptions.map((status) => {
                      const count = announcements.filter(
                        (item) => item.status === status
                      ).length;

                      return (
                        <label
                          key={status}
                          className="flex items-center gap-2 text-[14px] text-[#444]"
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
                            className="h-4 w-4 accent-[#2f80ed]"
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
                  <h4 className="mb-2 text-[14px] font-medium text-[#222]">
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
                          className="flex items-center gap-2 text-[14px] text-[#444]"
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
                            className="h-4 w-4 accent-[#2f80ed]"
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
                className="mt-6 w-full rounded-full border border-[#4d4d4d] bg-white py-2 text-[15px] font-medium text-[#333]"
              >
                Temizle
              </button>
            </div>

            <div>
              <div className="mb-3 flex justify-end text-[15px] text-[#5a5a5a]">
                Bulundu: {filteredAnnouncements.length}
              </div>

              <div className="overflow-x-auto rounded-[14px]">
                <table className="min-w-full">
                  <thead className="bg-[#d6d6da] text-left text-[13px] text-[#2f2f2f]">
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
                        className={index % 2 === 0 ? "bg-[#efefef]" : "bg-[#dcdcdc]"}
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
                            <Pencil className="h-5 w-5 text-[#2f80ed]" />
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => deleteAnnouncement(item.id)}>
                            <Trash2 className="h-5 w-5 text-[#2f80ed]" />
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