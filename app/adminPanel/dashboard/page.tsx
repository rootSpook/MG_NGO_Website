"use client";

import AdminShell from "@/components/adminPanel/AdminShell";
import AdminDashboardSections from "@/components/adminPanel/AdminDashboardSections";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-4 text-center text-[56px] font-bold uppercase text-black">
          Dashboard
        </h1>
        <AdminDashboardSections />
      </div>
    </AdminShell>
  );
}