"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import EditorShell from "@/components/editorPanel/EditorShell";
import AnnouncementForm from "@/components/editorPanel/AnnouncementForm";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { AnnouncementItem } from "@/types/editorPanel";

export default function EditAnnouncementPage() {
  const params = useParams();
  const router = useRouter();
  const { getAnnouncementById, updateAnnouncement } = useEditorPanel();

  const announcementId = String(params.id);
  const existingItem = getAnnouncementById(announcementId);

  function handleUpdate(data: AnnouncementItem) {
    updateAnnouncement(announcementId, data);
    router.push("/editorPanel/announcements");
  }

  if (!existingItem) {
    return (
      <EditorShell>
        <div className="mx-auto max-w-[1180px]">
          <h1 className="text-[48px] font-bold text-black">Duyuru Bulunamadı</h1>
          <p className="mt-4 text-[16px] text-[#444]">
            Düzenlemek istediğiniz duyuru bulunamadı.
          </p>
          <Link
            href="/editorPanel/announcements"
            className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
          >
            Duyurulara Dön
          </Link>
        </div>
      </EditorShell>
    );
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">Duyuru Düzenle</h1>
        <AnnouncementForm
          mode="edit"
          initialData={existingItem}
          onSubmit={handleUpdate}
        />
      </div>
    </EditorShell>
  );
}