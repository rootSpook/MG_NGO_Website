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
        className: "bg-[#dbe7f5]",
      },
      {
        title: "Yaklaşan Etkinlikler",
        value: totalUpcomingEvents,
        className: "bg-[#d8edcf]",
      },
      {
        title: "Taslak Gönderiler",
        value: totalDraftBlogs,
        className: "bg-[#e9dbc4]",
      },
    ];
  }, [blogs, events]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.title}
          className={`${item.className} rounded-[20px] px-8 py-7 shadow-md`}
        >
          <div className="text-[42px] font-bold text-black">{item.value}</div>
          <div className="mt-3 text-[16px] text-[#242424]">{item.title}</div>
        </div>
      ))}
    </div>
  );
}