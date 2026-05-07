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
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Etkinlikler</h1>

            <div className="mt-5">
              <p className="mb-2 text-sm text-gray-600">Tarih seç</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedYear((prev) => prev - 1)}
                  className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

                <div className="flex min-w-[120px] items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900">
                  {selectedYear}
                </div>

                <button
                  onClick={() => setSelectedYear((prev) => prev + 1)}
                  className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>

                <div className="rounded-lg border border-gray-200 p-2">
                  <CalendarDays className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/editorPanel/events/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            + Etkinlik Ekle
          </Link>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Planned Events</h2>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full overflow-hidden rounded-lg">
              <thead className="bg-gray-100 text-left text-xs font-medium text-gray-700">
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
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => deleteEvent(event.id)}>
                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-gray-50 font-medium text-gray-900">
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

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-800">Filtrele</h3>

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
                className="mt-6 w-full rounded-lg border border-gray-200 bg-white py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Temizle
              </button>
            </div>

            <div>
              <div className="mb-3 flex justify-end text-sm text-gray-600">
                Bulundu: {filteredEvents.length}
              </div>

              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-100 text-left text-xs font-medium text-gray-700">
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
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
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
      <h4 className="mb-2 text-sm font-medium text-gray-900">{title}</h4>

      <div className="space-y-2">
        {options.map((option) => {
          const count = getCount(allEvents, option);

          return (
            <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="h-4 w-4 accent-primary"
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