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
    <section className="mt-7 rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-black">Son Blog Yazıları</h2>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[15px] font-medium shadow-sm"
          >
            Düzenle
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 min-w-[220px] rounded-xl bg-white p-2 shadow-lg">
              <Link
                href="/editorPanel/blog-posts"
                className="block rounded-lg px-3 py-2 text-[14px] hover:bg-[#f3f3f3]"
              >
                Tüm blog yazılarını görüntüle
              </Link>
              <Link
                href="/editorPanel/blog-posts/new"
                className="block rounded-lg px-3 py-2 text-[14px] hover:bg-[#f3f3f3]"
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
            className="flex items-center justify-between rounded-[16px] bg-[#d8d8d8] px-6 py-5 shadow-sm"
          >
            <div>
              <h3 className="text-[18px] font-medium text-black">{post.title}</h3>
              <p className="mt-1 text-[15px] text-[#3f3f3f]">
                Yayın tarihi: {formatDateTR(post.publishedAt)}
              </p>
            </div>

            <Link
              href={`/editorPanel/blog-posts/${post.id}/edit`}
              className="rounded-[10px] bg-[#27ae60] px-7 py-3 text-[15px] font-medium text-white transition hover:opacity-90"
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
    <section className="mt-7 rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-black">Yaklaşan Etkinlikler</h2>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[15px] font-medium shadow-sm"
          >
            Düzenle
            <ChevronDown className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-20 min-w-[220px] rounded-xl bg-white p-2 shadow-lg">
              <Link
                href="/editorPanel/events"
                className="block rounded-lg px-3 py-2 text-[14px] hover:bg-[#f3f3f3]"
              >
                Tüm etkinlikleri görüntüle
              </Link>
              <Link
                href="/editorPanel/events/new"
                className="block rounded-lg px-3 py-2 text-[14px] hover:bg-[#f3f3f3]"
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
            className="rounded-[16px] bg-[#d8d8d8] px-6 py-5 shadow-sm"
          >
            <h3 className="text-[18px] font-medium text-black">{event.title}</h3>
            <p className="mt-2 text-[15px] text-[#333]">{formatDateTR(event.date)}</p>
            <p className="mt-3 text-[15px] text-[#333]">{event.location}</p>

            <div className="mt-5">
              <Link
                href={`/editorPanel/events/${event.id}/edit`}
                className="inline-block rounded-[10px] bg-[#27ae60] px-7 py-3 text-[15px] font-medium text-white transition hover:opacity-90"
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
    <section className="mt-7 rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
      <h2 className="mb-5 text-[22px] font-semibold text-black">Hızlı İşlemler</h2>

      <div className="flex flex-wrap gap-5">
        <Link
          href="/editorPanel/blog-posts/new"
          className="rounded-[12px] bg-[#dbe7f5] px-8 py-4 text-center text-[16px] font-medium text-black shadow-sm"
        >
          + Yeni Blog Yazısı
        </Link>

        <Link
          href="/editorPanel/events/new"
          className="rounded-[12px] bg-[#eadbc2] px-8 py-4 text-center text-[16px] font-medium text-black shadow-sm"
        >
          + Yeni Etkinlik
        </Link>

        <Link
          href="/editorPanel/announcements/new"
          className="rounded-[12px] bg-[#d9efd1] px-8 py-4 text-center text-[16px] font-medium text-black shadow-sm"
        >
          + Yeni Duyuru
        </Link>

        <Link
          href="/editorPanel/media"
          className="rounded-[12px] bg-[#d9d9d9] px-8 py-4 text-center text-[16px] font-medium text-black shadow-sm"
        >
          Medya Yükle
        </Link>
      </div>
    </section>
  );
}