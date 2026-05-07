"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const monthNames = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getWorkingSummaryForMonth(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let workingDays = 0;
  let nonWorkingDays = 0;
  for (let day = 1; day <= daysInMonth; day += 1) {
    if (isWeekend(new Date(year, monthIndex, day))) {
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
    const s = getWorkingSummaryForMonth(year, month);
    workingDays += s.workingDays;
    nonWorkingDays += s.nonWorkingDays;
  }
  return { workingDays, nonWorkingDays };
}

function buildMonthGrid(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const jsDay = firstDay.getDay();
  const mondayBasedStart = jsDay === 0 ? 6 : jsDay - 1;
  const cells: Array<number | null> = [];
  for (let i = 0; i < mondayBasedStart; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface MonthCardProps {
  monthName: string;
  monthIndex: number;
  year: number;
  cells: Array<number | null>;
  summary: { workingDays: number; nonWorkingDays: number };
}

function MonthCard({ monthName, monthIndex, year, cells, summary }: MonthCardProps) {
  const todayKey = formatDateKey(new Date());

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
          if (!day) return <div key={`empty-${monthName}-${index}`} className="h-9" />;
          const currentDate = new Date(year, monthIndex, day);
          const dateKey = formatDateKey(currentDate);
          const weekend = isWeekend(currentDate);
          const isToday = dateKey === todayKey;

          return (
            <div key={`${monthName}-${day}`} className="flex h-9 items-center justify-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                  isToday
                    ? "bg-primary text-white"
                    : weekend
                    ? "text-red-500"
                    : "text-gray-900"
                }`}
              >
                {day}
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

export default function AdminCalendarPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const yearSummary = useMemo(() => getYearSummary(selectedYear), [selectedYear]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Takvim</h1>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-900">Yıl seç</p>
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

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-2">
              <div className="min-w-[120px] border-r border-gray-200 px-8 py-5 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {yearSummary.workingDays}
                </div>
                <div className="mt-2 text-sm leading-5 text-gray-600">
                  çalışma<br />günleri
                </div>
              </div>
              <div className="min-w-[120px] px-8 py-5 text-center">
                <div className="text-2xl font-bold text-red-500">
                  {yearSummary.nonWorkingDays}
                </div>
                <div className="mt-2 text-sm leading-5 text-red-500">
                  çalışma dışı<br />günler
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {monthNames.map((monthName, monthIndex) => {
          const cells = buildMonthGrid(selectedYear, monthIndex);
          const summary = getWorkingSummaryForMonth(selectedYear, monthIndex);
          return (
            <MonthCard
              key={monthName}
              monthName={monthName}
              monthIndex={monthIndex}
              year={selectedYear}
              cells={cells}
              summary={summary}
            />
          );
        })}
      </div>
    </div>
  );
}
