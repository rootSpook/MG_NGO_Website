"use client";

import { useMemo, useState } from "react";
import EditorShell from "@/components/editorPanel/EditorShell";
import DashboardStats from "@/components/editorPanel/DashboardStats";
import {
  LatestBlogPosts,
  QuickActions,
  UpcomingEvents,
} from "@/components/editorPanel/DashboardSections";
import { useEditorPanel } from "@/context/EditorPanelContext";

export default function EditorDashboardPage() {
  const { blogs, events } = useEditorPanel();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = useMemo(() => {
    const published = blogs.filter((blog) => blog.status === "published");

    if (!searchTerm.trim()) return published.slice(0, 3);

    return published
      .filter((blog) =>
        `${blog.title} ${blog.category} ${blog.summary}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .slice(0, 3);
  }, [blogs, searchTerm]);

  const filteredEvents = useMemo(() => {
    const upcoming = events.filter((event) => event.status === "planned");

    if (!searchTerm.trim()) return upcoming.slice(0, 3);

    return upcoming
      .filter((event) =>
        `${event.title} ${event.location} ${event.city} ${event.type}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .slice(0, 3);
  }, [events, searchTerm]);

  return (
    <EditorShell onSearchChange={setSearchTerm}>
      <section className="mx-auto max-w-[1100px]">
        <h1 className="mb-6 text-[56px] font-bold uppercase leading-none text-black">
          Dashboard
        </h1>

        <section className="rounded-[22px] bg-[#e5e5e5] p-6 shadow-md">
          <h2 className="mb-5 text-[22px] font-semibold text-black">Quick Stats</h2>
          <DashboardStats />
        </section>

        <LatestBlogPosts blogPosts={filteredBlogs} />
        <UpcomingEvents events={filteredEvents} />
        <QuickActions />
      </section>
    </EditorShell>
  );
}