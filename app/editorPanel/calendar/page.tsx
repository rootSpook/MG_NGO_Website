"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { EventItem } from "@/types/editorPanel";

const branchOptions = ["Tümü", "İstanbul", "İzmir", "Ankara", "Online"];

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getEventsForDate(events: EventItem[], dateKey: string, branch: string) {
  return events.filter((event) => {
    const sameDay = event.date === dateKey;
    const matchesBranch =
      branch === "Tümü" ||
      event.city === branch ||
      event.location.includes(branch);

    return sameDay && matchesBranch;
  });
}

function getWorkingSummaryForMonth(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let workingDays = 0;
  let nonWorkingDays = 0;

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(year, monthIndex, day);
    if (isWeekend(current)) {
      nonWorkingDays += 1;
    } else {
      workingDays += 1;
    }
  }

  return { workingDays, nonWorkingDays };
}

function getYearSummary(year: number) {
  let workingDays = 0;
  let nonWorkingDays = 0;

  for (let month = 0; month < 12; month += 1) {
    const monthSummary = getWorkingSummaryForMonth(year, month);
    workingDays += monthSummary.workingDays;
    nonWorkingDays += monthSummary.nonWorkingDays;
  }

  return { workingDays, nonWorkingDays };
}

function buildMonthGrid(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const jsDay = firstDay.getDay();
  const mondayBasedStart = jsDay === 0 ? 6 : jsDay - 1;

  const cells: Array<number | null> = [];

  for (let i = 0; i < mondayBasedStart; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export default function CalendarPage() {
  const { events } = useEditorPanel();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedBranch, setSelectedBranch] = useState("Tümü");

  const yearSummary = useMemo(() => getYearSummary(selectedYear), [selectedYear]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventYear = new Date(event.date).getFullYear();
      const matchesYear = eventYear === selectedYear;
      const matchesBranch =
        selectedBranch === "Tümü" ||
        event.city === selectedBranch ||
        event.location.includes(selectedBranch);

      return matchesYear && matchesBranch;
    });
  }, [events, selectedYear, selectedBranch]);

  return (
    <EditorShell>
      <div className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Takvim</h1>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Şube
                  </label>
                  <div className="relative w-[220px]">
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-gray-300 px-3 pr-10 text-sm outline-none focus:border-primary"
                    >
                      {branchOptions.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-900">
                    Tarih seç
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedYear((prev) => prev - 1)}
                      className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>

                    <div className="flex min-w-[120px] items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900">
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
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Link
                href="/editorPanel/events/new"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                Etkinlik Ekle
              </Link>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-2">
                  <div className="min-w-[120px] border-r border-gray-200 px-8 py-5 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {yearSummary.workingDays}
                    </div>
                    <div className="mt-2 text-sm leading-5 text-gray-600">
                      çalışma
                      <br />
                      günleri
                    </div>
                  </div>

                  <div className="min-w-[120px] px-8 py-5 text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {yearSummary.nonWorkingDays}
                    </div>
                    <div className="mt-2 text-sm leading-5 text-red-500">
                      çalışma dışı
                      <br />
                      günler
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {monthNames.map((monthName, monthIndex) => {
              const monthCells = buildMonthGrid(selectedYear, monthIndex);
              const summary = getWorkingSummaryForMonth(selectedYear, monthIndex);

              return (
                <MonthCard
                  key={monthName}
                  monthName={monthName}
                  monthIndex={monthIndex}
                  year={selectedYear}
                  cells={monthCells}
                  events={filteredEvents}
                  summary={summary}
                  selectedBranch={selectedBranch}
                />
              );
            })}
        </div>
      </div>
    </EditorShell>
  );
}

interface MonthCardProps {
  monthName: string;
  monthIndex: number;
  year: number;
  cells: Array<number | null>;
  events: EventItem[];
  summary: {
    workingDays: number;
    nonWorkingDays: number;
  };
  selectedBranch: string;
}

function MonthCard({
  monthName,
  monthIndex,
  year,
  cells,
  events,
  summary,
  selectedBranch,
}: MonthCardProps) {
  const today = new Date();
  const todayKey = formatDateKey(today);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-center text-base font-semibold text-gray-900">
        {monthName}
      </h3>

      <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-gray-600">
        {weekDays.map((day) => (
          <div key={day} className="pb-2">
            {day}
          </div>
        ))}

        {cells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${monthName}-${index}`} className="h-9" />;
          }

          const currentDate = new Date(year, monthIndex, day);
          const dateKey = formatDateKey(currentDate);
          const weekend = isWeekend(currentDate);
          const dayEvents = getEventsForDate(events, dateKey, selectedBranch);
          const hasEvent = dayEvents.length > 0;
          const isToday = dateKey === todayKey;

          return (
            <div
              key={`${monthName}-${day}`}
              className="flex h-9 items-center justify-center"
            >
              <div className="group relative flex h-8 w-8 items-center justify-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                    isToday
                      ? "bg-primary text-white"
                      : hasEvent
                      ? "cursor-pointer bg-blue-100 text-primary ring-2 ring-primary"
                      : weekend
                      ? "text-red-500"
                      : "text-gray-900"
                  }`}
                >
                  {day}
                </div>

                {hasEvent && (
                  <div className="pointer-events-none absolute bottom-10 left-1/2 z-50 hidden min-w-[180px] -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-center text-xs text-white shadow-lg group-hover:block">
                    {dayEvents.map((event) => (
                      <div key={event.id}>{event.title}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
          <span>Çalışma günleri:</span>
          <span>{summary.workingDays}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-sm text-red-600">
          <span>Çalışma dışı günler:</span>
          <span>{summary.nonWorkingDays}</span>
        </div>
      </div>
    </section>
  );
}