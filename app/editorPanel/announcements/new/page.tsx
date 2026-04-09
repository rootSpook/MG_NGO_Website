"use client";

import { useRouter } from "next/navigation";
import EditorShell from "@/components/editorPanel/EditorShell";
import AnnouncementForm from "@/components/editorPanel/AnnouncementForm";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { AnnouncementItem } from "@/types/editorPanel";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { addAnnouncement } = useEditorPanel();

  function handleCreate(data: AnnouncementItem) {
    addAnnouncement(data);
    router.push("/editorPanel/announcements");
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">Yeni Duyuru</h1>
        <AnnouncementForm mode="create" onSubmit={handleCreate} />
      </div>
    </EditorShell>
  );
}