"use client";

import { useRouter } from "next/navigation";
import EditorShell from "@/components/editorPanel/EditorShell";
import EventForm from "@/components/editorPanel/EventForm";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { EventItem } from "@/types/editorPanel";

export default function NewEventPage() {
  const router = useRouter();
  const { addEvent } = useEditorPanel();

  function handleCreateEvent(data: EventItem) {
    addEvent(data);
    router.push("/editorPanel/events");
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">Etkinlik Ekle</h1>

        <EventForm
          mode="create"
          onSubmit={handleCreateEvent}
        />
      </div>
    </EditorShell>
  );
}