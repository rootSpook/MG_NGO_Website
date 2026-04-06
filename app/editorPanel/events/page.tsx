"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Trash2, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { EventItem } from "@/types/editorPanel";

function formatDateTR(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getDurationInDays(start: string, end?: string) {
  if (!start || !end) return 1;
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : 1;
}

const locationFilterOptions = ["İzmir", "İstanbul", "Ankara", "Online"];
const venueFilterOptions = [
  "Hastane",
  "STK Ofisi",
  "Konferans Salonu",
  "Online",
  "Üniversite Kampüsü",
  "Toplum Merkezi",
];
const typeFilterOptions = [
  "Webinar",
  "Farkındalık",
  "Workshop",
  "Konferans",
  "Destek Grubu",
];

export default function EventsPage() {
  const { events, deleteEvent } = useEditorPanel();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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
    setSelectedLocations([]);
    setSelectedVenues([]);
    setSelectedTypes([]);
  }

  const plannedEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.status === "planned" &&
        new Date(event.date).getFullYear() === selectedYear
    );
  }, [events, selectedYear]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesYear = new Date(event.date).getFullYear() === selectedYear;

      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.includes(event.city) ||
        selectedLocations.includes(event.location);

      const matchesVenue =
        selectedVenues.length === 0 || selectedVenues.includes(event.venue);

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(event.type);

      return matchesYear && matchesLocation && matchesVenue && matchesType;
    });
  }, [events, selectedYear, selectedLocations, selectedVenues, selectedTypes]);

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[52px] font-bold text-black">Etkinlikler</h1>

            <div className="mt-5">
              <p className="mb-2 text-[14px] text-[#333]">Tarih seç</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedYear((prev) => prev - 1)}
                  className="rounded-[10px] bg-[#efefef] p-3 hover:bg-[#e3e3e3]"
                >
                  <ChevronLeft className="h-4 w-4 text-[#2f80ed]" />
                </button>

                <div className="flex min-w-[120px] items-center justify-center rounded-[10px] bg-[#efefef] px-4 py-3 text-[16px] font-medium text-[#222]">
                  {selectedYear}
                </div>

                <button
                  onClick={() => setSelectedYear((prev) => prev + 1)}
                  className="rounded-[10px] bg-[#efefef] p-3 hover:bg-[#e3e3e3]"
                >
                  <ChevronRight className="h-4 w-4 text-[#2f80ed]" />
                </button>

                <div className="rounded-[10px] bg-[#efefef] p-3">
                  <CalendarDays className="h-5 w-5 text-[#2f80ed]" />
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/editorPanel/events/new"
            className="mt-8 rounded-full border-2 border-[#2f80ed] px-6 py-3 text-[18px] font-medium text-[#2f80ed] transition hover:bg-[#eef5ff]"
          >
            + Etkinlik Ekle
          </Link>
        </div>

        <section className="rounded-[24px] bg-[#e8e8e8] p-5 shadow-md">
          <h2 className="mb-4 text-[18px] font-semibold text-black">Planned Events</h2>

          <div className="overflow-x-auto rounded-[14px]">
            <table className="min-w-full overflow-hidden rounded-[14px]">
              <thead className="bg-[#d6d6da] text-left text-[13px] text-[#2f2f2f]">
                <tr>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Süre (gün)</th>
                  <th className="px-4 py-3">Kapasite</th>
                  <th className="px-4 py-3">Konum</th>
                  <th className="px-4 py-3">Etkinlik Adı</th>
                  <th className="px-4 py-3">Tür</th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {plannedEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className={index % 2 === 0 ? "bg-[#efefef]" : "bg-[#dcdcdc]"}
                  >
                    <td className="px-4 py-4">
                      <span className="inline-block h-4 w-4 rounded-full bg-[#27ae60]" />
                    </td>
                    <td className="px-4 py-4">
                      {formatDateTR(event.date)} - {formatDateTR(event.endDate ?? event.date)}
                    </td>
                    <td className="px-4 py-4">
                      {getDurationInDays(event.date, event.endDate)}
                    </td>
                    <td className="px-4 py-4">{event.capacity}</td>
                    <td className="px-4 py-4">{event.city}</td>
                    <td className="px-4 py-4">{event.title}</td>
                    <td className="px-4 py-4">{event.type}</td>
                    <td className="px-4 py-4">
                      <Link href={`/editorPanel/events/${event.id}/edit`}>
                        <Pencil className="h-5 w-5 text-[#2f80ed]" />
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => deleteEvent(event.id)}>
                        <Trash2 className="h-5 w-5 text-[#2f80ed]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-[#efefef] font-medium text-[#222]">
                <tr>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3">Toplam</td>
                  <td className="px-4 py-3">
                    {plannedEvents.reduce(
                      (sum, event) =>
                        sum + getDurationInDays(event.date, event.endDate),
                      0
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {plannedEvents.reduce((sum, event) => sum + event.capacity, 0)}
                  </td>
                  <td className="px-4 py-3" colSpan={5}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] bg-[#e8e8e8] p-5 shadow-md">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <div className="rounded-[18px] bg-[#f1f1f1] p-5">
              <h3 className="mb-4 text-[18px] font-semibold text-black">Filtrele</h3>

              <div className="space-y-5">
                <FilterGroup
                  title="Lokasyon"
                  options={locationFilterOptions}
                  selected={selectedLocations}
                  onToggle={(value) =>
                    toggleSelection(value, selectedLocations, setSelectedLocations)
                  }
                  allEvents={events}
                  getCount={(items, option) =>
                    items.filter(
                      (event) => event.city === option || event.location === option
                    ).length
                  }
                />

                <FilterGroup
                  title="Mekan"
                  options={venueFilterOptions}
                  selected={selectedVenues}
                  onToggle={(value) =>
                    toggleSelection(value, selectedVenues, setSelectedVenues)
                  }
                  allEvents={events}
                  getCount={(items, option) =>
                    items.filter((event) => event.venue === option).length
                  }
                />

                <FilterGroup
                  title="Tür"
                  options={typeFilterOptions}
                  selected={selectedTypes}
                  onToggle={(value) =>
                    toggleSelection(value, selectedTypes, setSelectedTypes)
                  }
                  allEvents={events}
                  getCount={(items, option) =>
                    items.filter((event) => event.type === option).length
                  }
                />
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
                Bulundu: {filteredEvents.length}
              </div>

              <div className="overflow-x-auto rounded-[14px]">
                <table className="min-w-full">
                  <thead className="bg-[#d6d6da] text-left text-[13px] text-[#2f2f2f]">
                    <tr>
                      <th className="px-4 py-3">Etkinlik Adı</th>
                      <th className="px-4 py-3">Lokasyon</th>
                      <th className="px-4 py-3">Tür</th>
                      <th className="px-4 py-3">Mekan</th>
                      <th className="px-4 py-3">Durum</th>
                      <th className="px-4 py-3">Başlangıç Tarihi</th>
                      <th className="px-4 py-3">ID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEvents.map((event, index) => (
                      <tr
                        key={event.id}
                        className={index % 2 === 0 ? "bg-[#efefef]" : "bg-[#dcdcdc]"}
                      >
                        <td className="px-4 py-4">{event.title}</td>
                        <td className="px-4 py-4">{event.city}</td>
                        <td className="px-4 py-4">{event.type}</td>
                        <td className="px-4 py-4">{event.venue}</td>
                        <td className="px-4 py-4">{event.status}</td>
                        <td className="px-4 py-4">{formatDateTR(event.date)}</td>
                        <td className="px-4 py-4">{event.id}</td>
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

interface FilterGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  allEvents: EventItem[];
  getCount: (items: EventItem[], option: string) => number;
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  allEvents,
  getCount,
}: FilterGroupProps) {
  return (
    <div>
      <h4 className="mb-2 text-[14px] font-medium text-[#222]">{title}</h4>

      <div className="space-y-2">
        {options.map((option) => {
          const count = getCount(allEvents, option);

          return (
            <label key={option} className="flex items-center gap-2 text-[14px] text-[#444]">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="h-4 w-4 accent-[#2f80ed]"
              />
              <span>
                {option} ({count})
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}