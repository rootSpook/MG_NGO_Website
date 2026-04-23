"use client";

import Link from "next/link";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const { reports, deleteReport } = useAdminPanel();

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-center text-[48px] font-bold text-black">
          REPORTS
        </h1>

        <div className="mb-5 flex justify-end">
          <Link
            href="/adminPanel/reports/new"
            className="rounded-[12px] bg-[#27ae60] px-6 py-3 text-[18px] font-medium text-white"
          >
            + Upload Report
          </Link>
        </div>

        <div className="overflow-hidden rounded-[18px] bg-[#e5e5e5] shadow-md">
          <div className="grid grid-cols-[0.7fr_2.4fr_1fr_1fr_1.1fr_1fr_1.7fr] gap-3 bg-[#d8d8d8] px-4 py-4 text-[15px] font-semibold text-black">
            <div>Year</div>
            <div>Report Title</div>
            <div>Category</div>
            <div>File Size</div>
            <div>Upload Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          <div className="space-y-2 p-2">
            {reports.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[0.7fr_2.4fr_1fr_1fr_1.1fr_1fr_1.7fr] gap-3 rounded-[14px] bg-[#d8d8d8] px-4 py-4 shadow-sm"
              >
                <div>{item.year}</div>
                <div className="font-medium text-black">{item.title}</div>
                <div>{item.category}</div>
                <div>{item.fileSize}</div>
                <div>{formatDate(item.uploadDate)}</div>
                <div
                  className={
                    item.status === "published" ? "text-[#27ae60]" : "text-[#888]"
                  }
                >
                  ● {item.status === "published" ? "Published" : "Archived"}
                </div>

                <div className="flex gap-2">
                  <a
                    href={item.fileUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[8px] bg-[#4a90e2] px-4 py-2 text-white"
                  >
                    View
                  </a>
                  <Link
                    href={`/adminPanel/reports/${item.id}/edit`}
                    className="rounded-[8px] bg-[#27ae60] px-4 py-2 text-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteReport(item.id)}
                    className="rounded-[8px] bg-[#eb5757] px-4 py-2 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}