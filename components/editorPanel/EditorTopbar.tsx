"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserCircle2, CalendarDays, ChartNoAxesColumn, Bell } from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";

interface EditorTopbarProps {
  pageLabel: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function EditorTopbar({
  pageLabel,
  searchTerm,
  setSearchTerm,
}: EditorTopbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <span className="text-sm font-semibold text-gray-700">{pageLabel}</span>

      <div ref={profileRef} className="relative flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Bildirimler"
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          type="button"
        >
          <UserCircle2 className="h-5 w-5 text-gray-400" />
          <span className="max-w-[120px] truncate">{user?.email ?? "Editör"}</span>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 top-12 z-50 w-[220px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
            <Link
              href="/editorPanel/my-details"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <UserCircle2 className="h-4 w-4 text-gray-400" />
              <span>Bilgilerim</span>
            </Link>
            <Link
              href="/editorPanel/calendar"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <span>Takvim</span>
            </Link>
            <Link
              href="/editorPanel/performance-review"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ChartNoAxesColumn className="h-4 w-4 text-gray-400" />
              <span>Performans Değerlendirmesi</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}