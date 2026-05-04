import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { EventGridBlockData } from "@/types/pageBuilder";
import { getPublicEvents } from "@/lib/publicContent";

interface EventGridBlockProps {
  data: Record<string, unknown>;
}

interface DisplayEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  href: string;
}

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function EventGridBlock({ data }: EventGridBlockProps) {
  const d = data as unknown as EventGridBlockData;

  let events: DisplayEvent[] = [];

  if (d.source === "manual") {
    events = (d.manualEvents ?? []).map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      location: event.location,
      imageUrl: event.imageUrl,
      href: event.href,
    }));
  } else {
    // Live source — pull from published events list and apply optional limit.
    try {
      const publicEvents = await getPublicEvents();
      const limit = d.limit && d.limit > 0 ? d.limit : 6;
      events = publicEvents.slice(0, limit).map((event) => ({
        id: event.id,
        title: event.title,
        date: formatDate(event.startsAt),
        location:
          event.locationName ||
          [event.city, event.venue].filter(Boolean).join(" · ") ||
          (event.isOnline ? "Online" : ""),
        imageUrl: "",
        href: event.slug ? `/events#${event.slug}` : "/events",
      }));
    } catch (err) {
      console.error("[EventGridBlock] failed to load live events:", err);
    }
  }

  if (events.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Şu anda gösterilecek etkinlik bulunmuyor.{" "}
          <Link href="/events" className="font-medium text-teal-700 underline">
            Tüm etkinlikleri gör
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100"
          >
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title || "Etkinlik"}
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-teal-400 to-teal-600 text-white">
                <CalendarDays className="h-10 w-10" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                {event.date && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {event.date}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </span>
                )}
              </div>
              {event.href && (
                <Link
                  href={event.href}
                  className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
                >
                  Detayları gör →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
