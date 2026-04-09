"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  UserCircle2,
  CalendarDays,
  ChartNoAxesColumn,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

interface EditorTopbarProps {
  onToggleSidebar: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function EditorTopbar({
  onToggleSidebar,
  searchTerm,
  setSearchTerm,
}: EditorTopbarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

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
    <header className="flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 transition hover:bg-[#ececec]"
          type="button"
        >
          <Menu className="h-5 w-5 text-[#333]" />
        </button>

        <div className="flex w-[320px] items-center gap-2 rounded-full px-2 py-2">
          <Search className="h-4 w-4 text-[#2f80ed]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hızlı arama"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9b9b9b]"
          />
        </div>
      </div>

      <div ref={profileRef} className="relative flex items-center gap-4">
        <button
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className="text-[16px] font-semibold text-[#202020]"
          type="button"
        >
          Editor 1
        </button>

        <NotificationDropdown />

        {isProfileMenuOpen && (
          <div className="absolute right-10 top-12 z-50 w-[250px] rounded-[22px] bg-white p-3 shadow-xl">
            <Link
              href="/editorPanel/my-details"
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#f3f3f3]"
            >
              <UserCircle2 className="h-5 w-5 text-[#7c7c7c]" />
              <span>Bilgilerim</span>
            </Link>

            <Link
              href="/editorPanel/calendar"
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#f3f3f3]"
            >
              <CalendarDays className="h-5 w-5 text-[#7c7c7c]" />
              <span>Takvim</span>
            </Link>

            <Link
              href="/editorPanel/performance-review"
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#f3f3f3]"
            >
              <ChartNoAxesColumn className="h-5 w-5 text-[#7c7c7c]" />
              <span>Performans Değerlendirmesi</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}