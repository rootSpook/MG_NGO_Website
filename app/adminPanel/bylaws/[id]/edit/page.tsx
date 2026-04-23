"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import BylawForm from "@/components/adminPanel/BylawForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { BylawItem } from "@/types/adminPanel";

export default function EditBylawPage() {
  const params = useParams();
  const router = useRouter();
  const { getBylawById, updateBylaw } = useAdminPanel();

  const bylawId = String(params.id);
  const existingItem = getBylawById(bylawId);

  function handleUpdate(data: BylawItem) {
    updateBylaw(bylawId, data);
    router.push("/adminPanel/bylaws");
  }

  if (!existingItem) {
    return (
      <AdminShell>
        <h1 className="text-[40px] font-bold text-black">Bylaw Not Found</h1>
        <Link
          href="/adminPanel/bylaws"
          className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
        >
          Back to Bylaws
        </Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">Edit Bylaw</h1>
        <BylawForm
          mode="edit"
          initialData={existingItem}
          onSubmit={handleUpdate}
        />
      </div>
    </AdminShell>
  );
}