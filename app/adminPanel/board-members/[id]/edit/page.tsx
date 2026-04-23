"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import BoardMemberForm from "@/components/adminPanel/BoardMemberForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { BoardMemberItem } from "@/types/adminPanel";

export default function EditBoardMemberPage() {
  const params = useParams();
  const router = useRouter();

  const { getBoardMemberById, updateBoardMember } = useAdminPanel();

  const memberId = String(params.id);
  const existingMember = getBoardMemberById(memberId);

  function handleUpdate(data: BoardMemberItem) {
    updateBoardMember(memberId, data);
    router.push("/adminPanel/board-members");
  }

  if (!existingMember) {
    return (
      <AdminShell>
        <h1 className="text-[40px] font-bold text-black">
          Board Member Not Found
        </h1>

        <Link
          href="/adminPanel/board-members"
          className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
        >
          Back to Board Members
        </Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">
          Edit Board Member
        </h1>

        <BoardMemberForm
          mode="edit"
          initialData={existingMember}
          onSubmit={handleUpdate}
        />
      </div>
    </AdminShell>
  );
}