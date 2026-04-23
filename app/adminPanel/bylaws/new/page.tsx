"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import BylawForm from "@/components/adminPanel/BylawForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { BylawItem } from "@/types/adminPanel";

export default function NewBylawPage() {
  const router = useRouter();
  const { addBylaw } = useAdminPanel();

  function handleCreate(data: BylawItem) {
    addBylaw(data);
    router.push("/adminPanel/bylaws");
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">Upload Bylaws</h1>
        <BylawForm mode="create" onSubmit={handleCreate} />
      </div>
    </AdminShell>
  );
}