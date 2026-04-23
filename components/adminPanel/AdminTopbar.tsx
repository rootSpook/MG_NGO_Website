"use client";

import { Search } from "lucide-react";

export default function AdminTopbar() {
  return (
    <header className="mb-4 flex items-center justify-between rounded-t-[18px] bg-[#f5f5f5] px-8 py-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-[#8a8a8a]" />
        <input
          placeholder="Quick search"
          className="bg-transparent text-[15px] outline-none placeholder:text-[#9a9a9a]"
        />
      </div>
    </header>
  );
}