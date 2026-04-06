"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import EditorShell from "@/components/editorPanel/EditorShell";
import EventForm from "@/components/editorPanel/EventForm";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { EventItem } from "@/types/editorPanel";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { getEventById, updateEvent } = useEditorPanel();

  const eventId = String(params.id);
  const existingEvent = getEventById(eventId);

  function handleUpdateEvent(data: EventItem) {
    updateEvent(eventId, data);
    router.push("/editorPanel/events");
  }

  if (!existingEvent) {
    return (
      <EditorShell>
        <div className="mx-auto max-w-[1180px]">
          <h1 className="text-[48px] font-bold text-black">Etkinlik Bulunamadı</h1>
          <p className="mt-4 text-[16px] text-[#444]">
            Düzenlemek istediğiniz etkinlik bulunamadı.
          </p>
          <Link
            href="/editorPanel/events"
            className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
          >
            Etkinliklere Dön
          </Link>
        </div>
      </EditorShell>
    );
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">Etkinlik Düzenle</h1>

        <EventForm
          mode="edit"
          initialData={existingEvent}
          onSubmit={handleUpdateEvent}
        />
      </div>
    </EditorShell>
  );
}