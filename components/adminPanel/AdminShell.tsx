"use client";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f3f3] p-4">
      <div className="flex gap-4">
        <AdminSidebar />

        <div className="flex-1">
          <AdminTopbar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}