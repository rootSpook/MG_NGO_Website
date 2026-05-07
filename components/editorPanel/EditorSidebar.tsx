"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  CalendarRange,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/AuthContext";

interface EditorSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const items = [
  { label: "Dashboard", href: "/editorPanel/dashboard", icon: LayoutDashboard },
  { label: "Etkinlikler", href: "/editorPanel/events", icon: CalendarRange },
  { label: "Blog Yazıları", href: "/editorPanel/blog-posts", icon: Newspaper },
  { label: "Takvim", href: "/editorPanel/calendar", icon: CalendarDays },
  { label: "Medya", href: "/editorPanel/media", icon: ImageIcon },
  { label: "Duyurular", href: "/editorPanel/announcements", icon: Megaphone },
];

export default function EditorSidebar({ isOpen, onToggle }: EditorSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        isOpen ? "w-60" : "w-[72px]"
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
        {isOpen && (
          <span className="text-sm font-bold text-primary">Editör Paneli</span>
        )}
        <button
          onClick={onToggle}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={!isOpen ? label : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-secondary/50 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && <span>{label}</span>}
            </Link>
          );
        })}

        <Link
          href="/editorPanel/help"
          title={!isOpen ? "Yardım" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            pathname === "/editorPanel/help"
              ? "bg-secondary/50 text-primary"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {isOpen && <span>Yardım</span>}
        </Link>
      </nav>

      <div className="border-t border-gray-200 px-2 py-4">
        {isOpen && (
          <p className="mb-2 truncate px-3 text-xs text-gray-400">
            {user?.email}
          </p>
        )}
        <button
          onClick={logout}
          title={!isOpen ? "Çıkış Yap" : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span>Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  );
}