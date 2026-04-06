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
      <div className="mx-auto max-w-[1180px]">
        <section className="rounded-[24px] bg-[#d9d9d9] p-6 shadow-md">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-[52px] font-bold text-black">Takvim</h1>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#222]">
                    Şube
                  </label>
                  <div className="relative w-[220px]">
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="h-[46px] w-full appearance-none rounded-[10px] bg-[#efefef] px-4 pr-10 outline-none"
                    >
                      {branchOptions.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[14px] font-medium text-[#222]">
                    Tarih seç
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedYear((prev) => prev - 1)}
                      className="rounded-[10px] bg-[#efefef] p-3 hover:bg-[#e7e7e7]"
                    >
                      <ChevronLeft className="h-4 w-4 text-[#2f80ed]" />
                    </button>

                    <div className="flex min-w-[120px] items-center justify-center rounded-[10px] bg-[#efefef] px-4 py-3 text-[16px] font-medium text-[#222]">
                      {selectedYear}
                    </div>

                    <button
                      onClick={() => setSelectedYear((prev) => prev + 1)}
                      className="rounded-[10px] bg-[#efefef] p-3 hover:bg-[#e7e7e7]"
                    >
                      <ChevronRight className="h-4 w-4 text-[#2f80ed]" />
                    </button>

                    <div className="rounded-[10px] bg-[#efefef] p-3">
                      <CalendarDays className="h-5 w-5 text-[#2f80ed]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Link
                href="/editorPanel/events/new"
                className="rounded-[12px] bg-[#27ae60] px-10 py-4 text-[18px] font-semibold text-white transition hover:opacity-90"
              >
                Etkinlik Ekle
              </Link>

              <div className="overflow-hidden rounded-[18px] border-2 border-[#2f80ed] bg-white">
                <div className="grid grid-cols-2">
                  <div className="min-w-[120px] border-r border-[#2f80ed] px-8 py-5 text-center">
                    <div className="text-[28px] font-bold text-black">
                      {yearSummary.workingDays}
                    </div>
                    <div className="mt-2 text-[14px] leading-5 text-[#222]">
                      çalışma
                      <br />
                      günleri
                    </div>
                  </div>

                  <div className="min-w-[120px] px-8 py-5 text-center">
                    <div className="text-[28px] font-bold text-[#ff5b5b]">
                      {yearSummary.nonWorkingDays}
                    </div>
                    <div className="mt-2 text-[14px] leading-5 text-[#ff5b5b]">
                      çalışma dışı
                      <br />
                      günler
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
        </section>
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
    <div>
      <h3 className="mb-4 text-center text-[18px] font-semibold text-[#222]">
        {monthName}
      </h3>

      <div className="grid grid-cols-7 gap-y-2 text-center text-[13px] text-[#8a8a8a]">
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] transition ${
                    isToday
                      ? "bg-[#2f80ed] text-white"
                      : hasEvent
                      ? "cursor-pointer bg-[#cfe3ff] text-[#1d5fcc] ring-2 ring-[#2f80ed]"
                      : weekend
                      ? "text-[#ff6a6a]"
                      : "text-[#222]"
                  }`}
                >
                  {day}
                </div>

                {hasEvent && (
                  <div className="pointer-events-none absolute bottom-10 left-1/2 z-50 hidden min-w-[180px] -translate-x-1/2 rounded-[10px] bg-black px-3 py-2 text-center text-[12px] text-white shadow-lg group-hover:block">
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

      <div className="mt-4 overflow-hidden rounded-[12px] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-2 text-[14px] text-[#333]">
          <span>Çalışma günleri:</span>
          <span>{summary.workingDays}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-[14px] text-[#ff6a6a]">
          <span>Çalışma dışı günler:</span>
          <span>{summary.nonWorkingDays}</span>
        </div>
      </div>
    </div>
  );
}