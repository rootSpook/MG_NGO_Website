import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { db, auth } from "./config";
import { COLLECTIONS } from "./constants";
import type {
  BlogPost,
  EventItem,
  MediaItem,
  AnnouncementItem,
  NotificationItem,
} from "@/types/editorPanel";

// ── Helpers ───────────────────────────────────────────────────────────────────

function tsToDateString(ts: Timestamp | null | undefined): string {
  if (!ts) return new Date().toISOString().split("T")[0];
  return ts.toDate().toISOString().split("T")[0];
}

function tsToISOString(ts: Timestamp | null | undefined): string {
  if (!ts) return new Date().toISOString();
  return ts.toDate().toISOString();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function uid(): string | null {
  return auth.currentUser?.uid ?? null;
}

// ── Blog Posts (contentItems with type="post") ────────────────────────────────

export async function getEditorBlogs(): Promise<BlogPost[]> {
  const q = query(
    collection(db, COLLECTIONS.CONTENT_ITEMS),
    where("type", "==", "post"),
    where("deletedAt", "==", null),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      category: data.categoryId ?? data.category ?? "",
      publishedAt: tsToDateString(data.publishedAt),
      status: (data.status as BlogPost["status"]) ?? "draft",
      author: data.authorName ?? "",
      summary: data.excerpt ?? data.summary ?? "",
    };
  });
}

export async function createEditorBlog(blog: Omit<BlogPost, "id">): Promise<string> {
  const userId = uid();
  const ref = await addDoc(collection(db, COLLECTIONS.CONTENT_ITEMS), {
    type: "post",
    title: blog.title,
    slug: slugify(blog.title),
    excerpt: blog.summary,
    summary: blog.summary,
    categoryId: blog.category,
    category: blog.category,
    status: blog.status,
    authorName: blog.author,
    bodyMarkdown: "",
    bodyHtml: null,
    featured: false,
    sortOrder: null,
    categoryRef: null,
    tagRefs: [],
    tagIds: [],
    ogImageAssetRef: null,
    coverAssetRef: null,
    attachmentAssetRefs: [],
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    createdBy: userId,
    updatedBy: userId,
    publishedAt: blog.status === "published" ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    archivedAt: null,
    deletedAt: null,
  });
  return ref.id;
}

export async function updateEditorBlog(id: string, data: Partial<BlogPost>): Promise<void> {
  const update: DocumentData = {
    updatedAt: serverTimestamp(),
    updatedBy: uid(),
  };
  if (data.title !== undefined) {
    update.title = data.title;
    update.slug = slugify(data.title);
  }
  if (data.summary !== undefined) {
    update.excerpt = data.summary;
    update.summary = data.summary;
  }
  if (data.category !== undefined) {
    update.categoryId = data.category;
    update.category = data.category;
  }
  if (data.status !== undefined) {
    update.status = data.status;
    if (data.status === "published") update.publishedAt = serverTimestamp();
  }
  if (data.author !== undefined) update.authorName = data.author;

  await updateDoc(doc(db, COLLECTIONS.CONTENT_ITEMS, id), update);
}

export async function deleteEditorBlog(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CONTENT_ITEMS, id), {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ── Events ────────────────────────────────────────────────────────────────────

function firestoreToEventStatus(s: string): EventItem["status"] {
  const map: Record<string, EventItem["status"]> = {
    draft: "planned",
    published: "active",
    canceled: "cancelled",
    archived: "done",
  };
  return map[s] ?? "planned";
}

function eventStatusToFirestore(s: EventItem["status"]): string {
  const map: Record<EventItem["status"], string> = {
    planned: "draft",
    active: "published",
    cancelled: "canceled",
    done: "archived",
  };
  return map[s] ?? "draft";
}

export async function getEditorEvents(): Promise<EventItem[]> {
  const q = query(
    collection(db, COLLECTIONS.EVENTS),
    orderBy("startsAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      date: tsToDateString(data.startsAt),
      endDate: data.endsAt ? tsToDateString(data.endsAt) : undefined,
      location: data.locationName ?? "",
      city: data.city ?? "",
      venue: data.venue ?? "",
      type: data.eventType ?? "",
      capacity: data.capacity ?? 0,
      isOnline: data.isOnline ?? false,
      status: firestoreToEventStatus(data.status),
    };
  });
}

export async function createEditorEvent(event: Omit<EventItem, "id">): Promise<string> {
  const userId = uid();
  const ref = await addDoc(collection(db, COLLECTIONS.EVENTS), {
    title: event.title,
    slug: slugify(event.title),
    description: null,
    status: eventStatusToFirestore(event.status),
    startsAt: event.date ? Timestamp.fromDate(new Date(event.date)) : Timestamp.now(),
    endsAt: event.endDate ? Timestamp.fromDate(new Date(event.endDate)) : null,
    isOnline: event.isOnline,
    onlineUrl: null,
    locationName: event.location,
    locationAddress: null,
    city: event.city,
    venue: event.venue,
    eventType: event.type,
    capacity: event.capacity,
    coverAssetRef: null,
    createdBy: userId,
    updatedBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEditorEvent(id: string, data: Partial<EventItem>): Promise<void> {
  const update: DocumentData = {
    updatedAt: serverTimestamp(),
    updatedBy: uid(),
  };
  if (data.title !== undefined) {
    update.title = data.title;
    update.slug = slugify(data.title);
  }
  if (data.date !== undefined)
    update.startsAt = Timestamp.fromDate(new Date(data.date));
  if (data.endDate !== undefined)
    update.endsAt = data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : null;
  if (data.location !== undefined) update.locationName = data.location;
  if (data.city !== undefined) update.city = data.city;
  if (data.venue !== undefined) update.venue = data.venue;
  if (data.type !== undefined) update.eventType = data.type;
  if (data.capacity !== undefined) update.capacity = data.capacity;
  if (data.isOnline !== undefined) update.isOnline = data.isOnline;
  if (data.status !== undefined) update.status = eventStatusToFirestore(data.status);

  await updateDoc(doc(db, COLLECTIONS.EVENTS, id), update);
}

export async function deleteEditorEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.EVENTS, id));
}

// ── Media Assets ───────────────────────────────────────────────��──────────────

export async function getEditorMedia(): Promise<MediaItem[]> {
  const q = query(
    collection(db, COLLECTIONS.MEDIA_ASSETS),
    where("deletedAt", "==", null),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      pageKey: data.pageKey ?? "",
      title: data.altText ?? data.originalFilename ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      visibility: (data.visibility as MediaItem["visibility"]) ?? "public",
      featured: data.featured ?? false,
      imageUrl: data.downloadUrl ?? "",
      createdAt: tsToISOString(data.createdAt),
    };
  });
}

export async function createEditorMedia(item: Omit<MediaItem, "id">): Promise<string> {
  const userId = uid();
  const ref = await addDoc(collection(db, COLLECTIONS.MEDIA_ASSETS), {
    kind: "image",
    visibility: item.visibility,
    originalFilename: item.title,
    mimeType: "image/jpeg",
    byteSize: 0,
    checksumSha256: null,
    storageBucket: "",
    storagePath: "",
    downloadUrl: item.imageUrl,
    width: null,
    height: null,
    altText: item.title,
    description: item.description,
    tags: item.tags,
    featured: item.featured,
    pageKey: item.pageKey,
    uploadedBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deletedAt: null,
  });
  return ref.id;
}

export async function deleteEditorMedia(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.MEDIA_ASSETS, id), {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ── Announcements ─────────────────────────────────────────────────────────────

export async function getEditorAnnouncements(): Promise<AnnouncementItem[]> {
  const q = query(
    collection(db, COLLECTIONS.ANNOUNCEMENTS),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      content: data.content ?? "",
      audience: (data.audience as AnnouncementItem["audience"]) ?? "all",
      publishedAt: tsToDateString(data.publishedAt),
      status: (data.status as AnnouncementItem["status"]) ?? "draft",
      pinned: data.pinned ?? false,
    };
  });
}

export async function createEditorAnnouncement(
  item: Omit<AnnouncementItem, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
    title: item.title,
    content: item.content,
    audience: item.audience,
    publishedAt: item.publishedAt
      ? Timestamp.fromDate(new Date(item.publishedAt))
      : serverTimestamp(),
    status: item.status,
    pinned: item.pinned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateEditorAnnouncement(
  id: string,
  data: Partial<AnnouncementItem>
): Promise<void> {
  const update: DocumentData = { updatedAt: serverTimestamp() };
  if (data.title !== undefined) update.title = data.title;
  if (data.content !== undefined) update.content = data.content;
  if (data.audience !== undefined) update.audience = data.audience;
  if (data.status !== undefined) update.status = data.status;
  if (data.pinned !== undefined) update.pinned = data.pinned;
  if (data.publishedAt !== undefined)
    update.publishedAt = data.publishedAt
      ? Timestamp.fromDate(new Date(data.publishedAt))
      : null;

  await updateDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id), update);
}

export async function deleteEditorAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id));
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function getEditorNotifications(): Promise<NotificationItem[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where("staffId", "==", user.uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      isRead: data.isRead ?? false,
      createdAt: tsToISOString(data.createdAt),
    };
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { isRead: true });
}
