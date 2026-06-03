"use client";

import {
  createContext,
  useContext,
  useEffect,
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
  getEditorBlogs,
  createEditorBlog,
  updateEditorBlog,
  deleteEditorBlog,
  getEditorEvents,
  createEditorEvent,
  updateEditorEvent,
  deleteEditorEvent,
  getEditorMedia,
  createEditorMedia,
  deleteEditorMedia,
  getEditorAnnouncements,
  createEditorAnnouncement,
  updateEditorAnnouncement,
  deleteEditorAnnouncement,
  getEditorNotifications,
  markNotificationRead,
} from "@/lib/firebase/editorServices";

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
  loading: boolean;

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

  markNotificationAsRead: (id: string) => void;
}

const EditorPanelContext = createContext<EditorPanelContextType | null>(null);

export function EditorPanelProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data from Firestore on mount
  useEffect(() => {
    async function loadAll() {
      try {
        const [blogsData, eventsData, mediaData, announcementsData, notificationsData] =
          await Promise.all([
            getEditorBlogs(),
            getEditorEvents(),
            getEditorMedia(),
            getEditorAnnouncements(),
            getEditorNotifications(),
          ]);
        setBlogs(blogsData);
        setEvents(eventsData);
        setMedia(mediaData);
        setAnnouncements(announcementsData);
        setNotifications(notificationsData);
      } catch (err) {
        console.error("EditorPanel: Failed to load data from Firestore", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  // ── Events ────────────────────────────────────────────────────────────────

  function addEvent(event: EventItem) {
    setEvents((prev) => [event, ...prev]);
    createEditorEvent(event).then((id) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, id } : e))
      );
    }).catch(console.error);
  }

  function updateEvent(eventId: string, updatedData: Partial<EventItem>) {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, ...updatedData } : event
      )
    );
    updateEditorEvent(eventId, updatedData).catch(console.error);
  }

  function deleteEvent(eventId: string) {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    deleteEditorEvent(eventId).catch(console.error);
  }

  function getEventById(eventId: string) {
    return events.find((event) => event.id === eventId);
  }

  // ── Blog Posts ────────────────────────────────────────────────────────────

  function addBlog(blog: BlogPost) {
    setBlogs((prev) => [blog, ...prev]);
    createEditorBlog(blog).then((id) => {
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, id } : b))
      );
    }).catch(console.error);
  }

  function updateBlog(blogId: string, updatedData: Partial<BlogPost>) {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? { ...blog, ...updatedData } : blog
      )
    );
    updateEditorBlog(blogId, updatedData).catch(console.error);
  }

  function deleteBlog(blogId: string) {
    setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
    deleteEditorBlog(blogId).catch(console.error);
  }

  function getBlogById(blogId: string) {
    return blogs.find((blog) => blog.id === blogId);
  }

  // ── Media ─────────────────────────────────────────────────────────────────

  function addMedia(item: MediaItem) {
    setMedia((prev) => [item, ...prev]);
    createEditorMedia(item).then((id) => {
      setMedia((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, id } : m))
      );
    }).catch(console.error);
  }

  function deleteMedia(mediaId: string) {
    setMedia((prev) => prev.filter((item) => item.id !== mediaId));
    deleteEditorMedia(mediaId).catch(console.error);
  }

  function getMediaByPage(pageKey: string) {
    return media.filter((item) => item.pageKey === pageKey);
  }

  // ── Announcements ─────────────────────────────────────────────────────────

  function addAnnouncement(item: AnnouncementItem) {
    setAnnouncements((prev) => [item, ...prev]);
    createEditorAnnouncement(item).then((id) => {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, id } : a))
      );
    }).catch(console.error);
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
    updateEditorAnnouncement(announcementId, updatedData).catch(console.error);
  }

  function deleteAnnouncement(announcementId: string) {
    setAnnouncements((prev) =>
      prev.filter((item) => item.id !== announcementId)
    );
    deleteEditorAnnouncement(announcementId).catch(console.error);
  }

  function getAnnouncementById(announcementId: string) {
    return announcements.find((item) => item.id === announcementId);
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  function markNotificationAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    markNotificationRead(id).catch(console.error);
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
      loading,
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
      markNotificationAsRead,
    }),
    [blogs, events, notifications, media, announcements, loading]
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
