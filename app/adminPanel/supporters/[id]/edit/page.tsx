"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import SupporterForm from "@/components/adminPanel/SupporterForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { SupporterItem } from "@/types/adminPanel";

export default function EditSupporterPage() {
  const params = useParams();
  const router = useRouter();

  const { getSupporterById, updateSupporter } = useAdminPanel();

  const supporterId = String(params.id);
  const existingSupporter = getSupporterById(supporterId);

  function handleUpdate(data: SupporterItem) {
    updateSupporter(supporterId, data);
    router.push("/adminPanel/supporters");
  }

  if (!existingSupporter) {
    return (
      <AdminShell>
        <h1 className="text-[40px] font-bold text-black">
          Supporter Not Found
        </h1>

        <Link
          href="/adminPanel/supporters"
          className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
        >
          Back to Supporters
        </Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">
          Edit Supporter
        </h1>

        <SupporterForm
          mode="edit"
          initialData={existingSupporter}
          onSubmit={handleUpdate}
        />
      </div>
    </AdminShell>
  );
}