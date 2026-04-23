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

export default function BylawsPage() {
  const { bylaws, deleteBylaw } = useAdminPanel();

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-center text-[48px] font-bold text-black">
          BYLAWS
        </h1>

        <div className="mb-5 flex justify-end">
          <Link
            href="/adminPanel/bylaws/new"
            className="rounded-[12px] bg-[#27ae60] px-6 py-3 text-[18px] font-medium text-white"
          >
            + Upload Bylaws
          </Link>
        </div>

        <div className="overflow-hidden rounded-[18px] bg-[#e5e5e5] shadow-md">
          <div className="grid grid-cols-[1.1fr_2.8fr_0.8fr_0.8fr_1fr_1fr_1.5fr] gap-3 bg-[#d8d8d8] px-4 py-4 text-[15px] font-semibold text-black">
            <div>Date</div>
            <div>Title / Description</div>
            <div>Version</div>
            <div>Type</div>
            <div>Uploaded By</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          <div className="space-y-2 p-2">
            {bylaws.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.1fr_2.8fr_0.8fr_0.8fr_1fr_1fr_1.5fr] gap-3 rounded-[14px] bg-[#d8d8d8] px-4 py-4 shadow-sm"
              >
                <div>{formatDate(item.date)}</div>
                <div className="font-medium text-black">{item.title}</div>
                <div>{item.version}</div>
                <div>{item.type}</div>
                <div>{item.uploadedBy}</div>
                <div
                  className={
                    item.status === "active" ? "text-[#27ae60]" : "text-[#888]"
                  }
                >
                  ● {item.status === "active" ? "Active" : "Archived"}
                </div>

                <div className="flex gap-2">
                  <button className="rounded-[8px] bg-[#4a90e2] px-4 py-2 text-white">
                    View
                  </button>
                  <Link
                    href={`/adminPanel/bylaws/${item.id}/edit`}
                    className="rounded-[8px] bg-[#27ae60] px-4 py-2 text-white"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteBylaw(item.id)}
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