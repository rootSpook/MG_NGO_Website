"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import SupporterForm from "@/components/adminPanel/SupporterForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { SupporterItem } from "@/types/adminPanel";

export default function NewSupporterPage() {
  const router = useRouter();
  const { addSupporter } = useAdminPanel();

  function handleCreate(data: SupporterItem) {
    addSupporter(data);
    router.push("/adminPanel/supporters");
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">
          Add Supporter
        </h1>

        <SupporterForm mode="create" onSubmit={handleCreate} />
      </div>
    </AdminShell>
  );
}