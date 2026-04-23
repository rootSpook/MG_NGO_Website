"use client";

import Link from "next/link";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";

export default function BoardMembersPage() {
  const { boardMembers, deleteBoardMember } = useAdminPanel();

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <h1 className="mb-6 text-center text-[48px] font-bold text-black">
          BOARD MEMBERS
        </h1>

        <div className="mb-5 flex justify-end">
          <Link
            href="/adminPanel/board-members/new"
            className="rounded-[12px] bg-[#27ae60] px-6 py-3 text-[18px] font-medium text-white"
          >
            + Add Member
          </Link>
        </div>

        <div className="overflow-hidden rounded-[18px] bg-[#e5e5e5] shadow-md">
          <div className="grid grid-cols-[0.7fr_2fr_1.8fr_1.3fr_1.8fr_1.6fr] gap-3 bg-[#d8d8d8] px-4 py-4 text-[15px] font-semibold text-black">
            <div>Photo</div>
            <div>Full Name</div>
            <div>Role / Title</div>
            <div>Period</div>
            <div>Specialization</div>
            <div>Actions</div>
          </div>

          <div className="space-y-2 p-2">
            {boardMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-[0.7fr_2fr_1.8fr_1.3fr_1.8fr_1.6fr] gap-3 rounded-[14px] bg-[#d8d8d8] px-4 py-4 shadow-sm"
              >
                <div>
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-[#cfcfcf]" />
                  )}
                </div>

                <div className="font-medium text-black">{member.fullName}</div>
                <div>{member.roleTitle}</div>
                <div>{member.period}</div>
                <div>{member.specialization}</div>

                <div className="flex gap-2">
                  <Link
                    href={`/adminPanel/board-members/${member.id}/edit`}
                    className="rounded-[8px] bg-[#27ae60] px-4 py-2 text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteBoardMember(member.id)}
                    className="rounded-[8px] bg-[#eb5757] px-4 py-2 text-white"
                  >
                    Remove
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