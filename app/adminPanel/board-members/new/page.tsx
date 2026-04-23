"use client";

import { useRouter } from "next/navigation";
import AdminShell from "@/components/adminPanel/AdminShell";
import BoardMemberForm from "@/components/adminPanel/BoardMemberForm";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { BoardMemberItem } from "@/types/adminPanel";

export default function NewBoardMemberPage() {
  const router = useRouter();
  const { addBoardMember } = useAdminPanel();

  function handleCreate(data: BoardMemberItem) {
    addBoardMember(data);
    router.push("/adminPanel/board-members");
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1100px]">
        <h1 className="mb-8 text-[48px] font-bold text-black">
          Add Board Member
        </h1>

        <BoardMemberForm mode="create" onSubmit={handleCreate} />
      </div>
    </AdminShell>
  );
}