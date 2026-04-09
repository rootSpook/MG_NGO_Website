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
} from "lucide-react";

interface EditorSidebarProps {
  isOpen: boolean;
}

const items = [
  {
    label: "Dashboard",
    href: "/editorPanel/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Etkinlikler",
    href: "/editorPanel/events",
    icon: CalendarRange,
  },
  {
    label: "Blog Yazıları",
    href: "/editorPanel/blog-posts",
    icon: Newspaper,
  },
  {
    label: "Takvim",
    href: "/editorPanel/calendar",
    icon: CalendarDays,
  },
  {
    label: "Medya",
    href: "/editorPanel/media",
    icon: ImageIcon,
  },
  {
    label: "Duyurular",
    href: "/editorPanel/announcements",
    icon: Megaphone,
  },
];

export default function EditorSidebar({ isOpen }: EditorSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`border-r border-[#e7e7e7] bg-[#f5f5f5] transition-all duration-300 ${
        isOpen ? "w-[250px]" : "w-[86px]"
      }`}
    >
      <div className="flex h-full min-h-[calc(100vh-32px)] flex-col px-4 py-6">
        <div className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
                  isActive
                    ? "bg-[#dce8f7] text-[#2f80ed]"
                    : "text-[#272727] hover:bg-[#ececec]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <Link
          href="/editorPanel/help"
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#272727] transition hover:bg-[#ececec]"
        >
          <HelpCircle className="h-5 w-5 shrink-0" />
          {isOpen && <span>Yardım</span>}
        </Link>
      </div>
    </aside>
  );
}