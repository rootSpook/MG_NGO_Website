"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import EditorSidebar from "./EditorSidebar";
import EditorTopbar from "./EditorTopbar";

interface EditorShellProps {
  children: React.ReactNode;
  onSearchChange?: (value: string) => void;
}

const NAV_LABELS: Record<string, string> = {
  "/editorPanel/dashboard": "Dashboard",
  "/editorPanel/events": "Etkinlikler",
  "/editorPanel/blog-posts": "Blog Yazıları",
  "/editorPanel/calendar": "Takvim",
  "/editorPanel/media": "Medya",
  "/editorPanel/announcements": "Duyurular",
  "/editorPanel/help": "Yardım",
  "/editorPanel/my-details": "Bilgilerim",
  "/editorPanel/performance-review": "Performans Değerlendirmesi",
};

export default function EditorShell({
  children,
  onSearchChange,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    onSearchChange?.(value);
  }

  const pageLabel =
    Object.entries(NAV_LABELS).find(([key]) =>
      pathname === key || pathname.startsWith(key + "/")
    )?.[1] ?? "Editör Paneli";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EditorSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1 flex-col">
        <EditorTopbar
          pageLabel={pageLabel}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}