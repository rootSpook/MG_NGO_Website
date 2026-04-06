"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  BlogPost,
  EventItem,
  NotificationItem,
  MediaItem,
  AnnouncementItem,
} from "@/types/editorPanel";
import {
  mockBlogs,
  mockEvents,
  mockNotifications,
  mockMedia,
  mockAnnouncements,
} from "@/lib/editorPanelMockData";

interface EditorPanelContextType {
  blogs: BlogPost[];
  setBlogs: Dispatch<SetStateAction<BlogPost[]>>;
  events: EventItem[];
  setEvents: Dispatch<SetStateAction<EventItem[]>>;
  notifications: NotificationItem[];
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
  media: MediaItem[];
  setMedia: Dispatch<SetStateAction<MediaItem[]>>;
  announcements: AnnouncementItem[];
  setAnnouncements: Dispatch<SetStateAction<AnnouncementItem[]>>;

  addEvent: (event: EventItem) => void;
  updateEvent: (eventId: string, updatedData: Partial<EventItem>) => void;
  deleteEvent: (eventId: string) => void;
  getEventById: (eventId: string) => EventItem | undefined;

  addBlog: (blog: BlogPost) => void;
  updateBlog: (blogId: string, updatedData: Partial<BlogPost>) => void;
  deleteBlog: (blogId: string) => void;
  getBlogById: (blogId: string) => BlogPost | undefined;

  addMedia: (item: MediaItem) => void;
  deleteMedia: (mediaId: string) => void;
  getMediaByPage: (pageKey: string) => MediaItem[];

  addAnnouncement: (item: AnnouncementItem) => void;
  updateAnnouncement: (
    announcementId: string,
    updatedData: Partial<AnnouncementItem>
  ) => void;
  deleteAnnouncement: (announcementId: string) => void;
  getAnnouncementById: (announcementId: string) => AnnouncementItem | undefined;
}

const EditorPanelContext = createContext<EditorPanelContextType | null>(null);

export function EditorPanelProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);
  const [media, setMedia] = useState<MediaItem[]>(mockMedia);
  const [announcements, setAnnouncements] =
    useState<AnnouncementItem[]>(mockAnnouncements);

  function addEvent(event: EventItem) {
    setEvents((prev) => [event, ...prev]);
  }

  function updateEvent(eventId: string, updatedData: Partial<EventItem>) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updatedData } : event
      )
    );
  }

  function deleteEvent(eventId: string) {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }

  function getEventById(eventId: string) {
    return events.find((event) => event.id === eventId);
  }

  function addBlog(blog: BlogPost) {
    setBlogs((prev) => [blog, ...prev]);
  }

  function updateBlog(blogId: string, updatedData: Partial<BlogPost>) {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? { ...blog, ...updatedData } : blog
      )
    );
  }

  function deleteBlog(blogId: string) {
    setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
  }

  function getBlogById(blogId: string) {
    return blogs.find((blog) => blog.id === blogId);
  }

  function addMedia(item: MediaItem) {
    setMedia((prev) => [item, ...prev]);
  }

  function deleteMedia(mediaId: string) {
    setMedia((prev) => prev.filter((item) => item.id !== mediaId));
  }

  function getMediaByPage(pageKey: string) {
    return media.filter((item) => item.pageKey === pageKey);
  }

  function addAnnouncement(item: AnnouncementItem) {
    setAnnouncements((prev) => [item, ...prev]);
  }

  function updateAnnouncement(
    announcementId: string,
    updatedData: Partial<AnnouncementItem>
  ) {
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === announcementId ? { ...item, ...updatedData } : item
      )
    );
  }

  function deleteAnnouncement(announcementId: string) {
    setAnnouncements((prev) =>
      prev.filter((item) => item.id !== announcementId)
    );
  }

  function getAnnouncementById(announcementId: string) {
    return announcements.find((item) => item.id === announcementId);
  }

  const value = useMemo(
    () => ({
      blogs,
      setBlogs,
      events,
      setEvents,
      notifications,
      setNotifications,
      media,
      setMedia,
      announcements,
      setAnnouncements,
      addEvent,
      updateEvent,
      deleteEvent,
      getEventById,
      addBlog,
      updateBlog,
      deleteBlog,
      getBlogById,
      addMedia,
      deleteMedia,
      getMediaByPage,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      getAnnouncementById,
    }),
    [blogs, events, notifications, media, announcements]
  );

  return (
    <EditorPanelContext.Provider value={value}>
      {children}
    </EditorPanelContext.Provider>
  );
}

export function useEditorPanel() {
  const context = useContext(EditorPanelContext);
  if (!context) {
    throw new Error("useEditorPanel must be used within EditorPanelProvider");
  }
  return context;
}