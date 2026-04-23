"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import ReportForm from "@/components/adminPanel/ReportForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { ReportItem } from "@/types/adminPanel";

export default function NewReportPage() {
  const router = useRouter();
  const { addReport } = useAdminPanel();

  function handleCreate(data: ReportItem) {
    addReport(data);
    router.push("/adminPanel/reports");
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">Upload Report</h1>
        <ReportForm mode="create" onSubmit={handleCreate} />
      </div>
    </AdminShell>
  );
}