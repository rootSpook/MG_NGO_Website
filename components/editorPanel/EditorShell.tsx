"use client";

import { useState } from "react";
import EditorSidebar from "./EditorSidebar";
import EditorTopbar from "./EditorTopbar";

interface EditorShellProps {
  children: React.ReactNode;
  onSearchChange?: (value: string) => void;
}

export default function EditorShell({
  children,
  onSearchChange,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    onSearchChange?.(value);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="flex">
          <EditorSidebar isOpen={isSidebarOpen} />

          <div className="flex-1">
            <EditorTopbar
              onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
              searchTerm={searchTerm}
              setSearchTerm={handleSearchChange}
            />

            <main className="px-6 pb-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}