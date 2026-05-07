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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <DashboardStats />

        <LatestBlogPosts blogPosts={filteredBlogs} />
        <UpcomingEvents events={filteredEvents} />
        <QuickActions />
      </div>
    </EditorShell>
  );
}