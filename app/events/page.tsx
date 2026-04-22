import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getPublicEvents, PublicEvent } from "@/lib/publicContent";
import { MapPin, Monitor, Calendar, Users } from "lucide-react";

export const metadata = {
  title: "Etkinlikler | MG Yaşam Derneği",
  description:
    "Myasthenia Gravis Yaşam Derneği'nin yaklaşan ve geçmiş etkinliklerini inceleyin.",
};

function formatDateTR(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTimeTR(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventCard({ event }: { event: PublicEvent }) {
  const start = new Date(event.startsAt);
  const isPast = start < new Date();

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={`rounded-t-xl px-5 py-3 text-sm font-semibold ${isPast ? "bg-gray-200 text-gray-600" : "bg-teal-600 text-white"}`}>
        {event.eventType}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-lg font-bold leading-snug text-teal-700">
          {event.title}
        </h2>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0 text-teal-500" />
            <span>
              {formatDateTR(event.startsAt)}{" "}
              <span className="text-gray-400">·</span>{" "}
              {formatTimeTR(event.startsAt)}
              {event.endsAt && ` – ${formatTimeTR(event.endsAt)}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {event.isOnline ? (
              <Monitor className="h-4 w-4 flex-shrink-0 text-teal-500" />
            ) : (
              <MapPin className="h-4 w-4 flex-shrink-0 text-teal-500" />
            )}
            <span>
              {event.isOnline
                ? "Çevrim İçi"
                : `${event.locationName}, ${event.city}`}
            </span>
          </div>

          {event.capacity > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0 text-teal-500" />
              <span>Kapasite: {event.capacity} kişi</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          {isPast ? (
            <span className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-sm text-gray-500">
              Tamamlandı
            </span>
          ) : (
            <Link
              href="/contacts"
              className="inline-block rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              Bilgi Al
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const events = await getPublicEvents();

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startsAt) >= now);
  const past = events.filter((e) => new Date(e.startsAt) < now);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Header />

      <main className="flex-1">
        <section className="bg-teal-700 py-12 px-4 md:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              Etkinlikler
            </h1>
            <p className="mt-4 text-teal-100 md:text-lg">
              Toplantılar, webinarlar ve destek grubu buluşmalarımıza katılın.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          {upcoming.length > 0 ? (
            <>
              <h2 className="mb-6 text-2xl font-bold text-teal-700">
                Yaklaşan Etkinlikler
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
              Şu anda planlanmış etkinlik bulunmuyor.
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 text-2xl font-bold text-gray-600">
                Geçmiş Etkinlikler
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
