"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BlogPost, EventItem } from "@/types/editorPanel";

function formatDateTR(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface LatestBlogPostsProps {
  blogPosts: BlogPost[];
}

export function LatestBlogPosts({ blogPosts }: LatestBlogPostsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Son Blog Yazıları</h2>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Düzenle
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 min-w-[220px] rounded-xl bg-white p-2 shadow-lg">
              <Link
                href="/editorPanel/blog-posts"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
              >
                Tüm blog yazılarını görüntüle
              </Link>
              <Link
                href="/editorPanel/blog-posts/new"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
              >
                Yeni blog yazısı oluştur
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <div>
              <h3 className="font-medium text-gray-900">{post.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Yayın tarihi: {formatDateTR(post.publishedAt)}
              </p>
            </div>

            <Link
              href={`/editorPanel/blog-posts/${post.id}/edit`}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
            >
              Düzenle
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

interface UpcomingEventsProps {
  events: EventItem[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Yaklaşan Etkinlikler</h2>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Düzenle
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 min-w-[220px] rounded-xl bg-white p-2 shadow-lg">
              <Link
                href="/editorPanel/events"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
              >
                Tüm etkinlikleri görüntüle
              </Link>
              <Link
                href="/editorPanel/events/new"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
              >
                Yeni etkinlik oluştur
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <h3 className="font-medium text-gray-900">{event.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{formatDateTR(event.date)}</p>
            <p className="mt-3 text-sm text-gray-500">{event.location}</p>

            <div className="mt-5">
              <Link
                href={`/editorPanel/events/${event.id}/edit`}
                className="inline-block rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
              >
                Düzenle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function QuickActions() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">Hızlı İşlemler</h2>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/editorPanel/blog-posts/new"
          className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-blue-100"
        >
          + Yeni Blog Yazısı
        </Link>

        <Link
          href="/editorPanel/events/new"
          className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-amber-100"
        >
          + Yeni Etkinlik
        </Link>

        <Link
          href="/editorPanel/announcements/new"
          className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-green-100"
        >
          + Yeni Duyuru
        </Link>

        <Link
          href="/editorPanel/media"
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
        >
          Medya Yükle
        </Link>
      </div>
    </section>
  );
}