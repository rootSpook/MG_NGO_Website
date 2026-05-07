"use client";

import { useMemo } from "react";
import { useEditorPanel } from "@/context/EditorPanelContext";

export default function DashboardStats() {
  const { blogs, events } = useEditorPanel();

  const stats = useMemo(() => {
    const totalPublishedBlogs = blogs.filter(
      (blog) => blog.status === "published"
    ).length;

    const totalDraftBlogs = blogs.filter(
      (blog) => blog.status === "draft"
    ).length;

    const totalUpcomingEvents = events.filter(
      (event) => event.status === "planned"
    ).length;

    return [
      {
        title: "Toplam Blog Yazısı",
        value: totalPublishedBlogs,
        className: "bg-blue-50",
      },
      {
        title: "Yaklaşan Etkinlikler",
        value: totalUpcomingEvents,
        className: "bg-green-50",
      },
      {
        title: "Taslak Gönderiler",
        value: totalDraftBlogs,
        className: "bg-amber-50",
      },
    ];
  }, [blogs, events]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.title}
          className={`${item.className} rounded-xl p-5 shadow-sm`}
        >
          <div className="mt-2 text-3xl font-bold text-gray-900">{item.value}</div>
          <div className="text-sm font-medium text-gray-600">{item.title}</div>
        </div>
      ))}
    </div>
  );
}