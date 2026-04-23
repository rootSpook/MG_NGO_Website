"use client";

import Link from "next/link";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";

export default function SupportersPage() {
  const { supporters, deleteSupporter } = useAdminPanel();

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-center text-[48px] font-bold text-black">
          SUPPORTERS
        </h1>

        <div className="mb-5 flex justify-end">
          <Link
            href="/adminPanel/supporters/new"
            className="rounded-[12px] bg-[#27ae60] px-6 py-3 text-[18px] font-medium text-white"
          >
            + Add Supporter
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {supporters.map((supporter) => (
            <div
              key={supporter.id}
              className="rounded-[20px] bg-[#e5e5e5] p-4 shadow-md"
            >
              <div className="flex gap-4">
                <div className="flex h-[90px] w-[120px] shrink-0 items-center justify-center rounded-[14px] bg-[#d8d8d8] shadow-sm">
                  {supporter.logoUrl ? (
                    <img
                      src={supporter.logoUrl}
                      alt={supporter.name}
                      className="h-full w-full rounded-[14px] object-cover"
                    />
                  ) : (
                    <span className="text-[14px] text-[#888]">Logo</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-[17px] font-semibold text-black">
                    {supporter.name}
                  </h3>

                  <p className="mt-2 text-[14px] text-[#777]">
                    {supporter.category}
                  </p>

                  <p className="mt-1 text-[13px] text-[#777]">
                    Since:{" "}
                    {supporter.since
                      ? new Date(supporter.since).toLocaleDateString("tr-TR")
                      : "-"}
                  </p>

                  {supporter.description && (
                    <p className="mt-2 line-clamp-2 text-[14px] text-[#666]">
                      {supporter.description}
                    </p>
                  )}

                  <div className="mt-6 flex gap-2">
                    <Link
                      href={`/adminPanel/supporters/${supporter.id}/edit`}
                      className="rounded-[8px] bg-[#27ae60] px-5 py-2 text-white"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteSupporter(supporter.id)}
                      className="rounded-[8px] bg-[#eb5757] px-5 py-2 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}