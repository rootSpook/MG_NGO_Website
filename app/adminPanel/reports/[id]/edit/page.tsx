"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import ReportForm from "@/components/adminPanel/ReportForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { ReportItem } from "@/types/adminPanel";

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const { getReportById, updateReport } = useAdminPanel();

  const reportId = String(params.id);
  const existingItem = getReportById(reportId);

  function handleUpdate(data: ReportItem) {
    updateReport(reportId, data);
    router.push("/adminPanel/reports");
  }

  if (!existingItem) {
    return (
      <AdminShell>
        <h1 className="text-[40px] font-bold text-black">Report Not Found</h1>
        <Link
          href="/adminPanel/reports"
          className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
        >
          Back to Reports
        </Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">Edit Report</h1>
        <ReportForm
          mode="edit"
          initialData={existingItem}
          onSubmit={handleUpdate}
        />
      </div>
    </AdminShell>
  );
}