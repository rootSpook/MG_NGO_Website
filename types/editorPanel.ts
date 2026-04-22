export type EditorNavKey =
  | "dashboard"
  | "events"
  | "blog-posts"
  | "calendar"
  | "media"
  | "announcements"
  | "help"
  | "my-details"
  | "performance-review";

export type BlogStatus = "published" | "draft" | "archived";

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  status: BlogStatus;
  author: string;
  summary: string;
}

export type EventStatus = "planned" | "active" | "done" | "cancelled";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  city: string;
  venue: string;
  type: string;
  capacity: number;
  isOnline: boolean;
  status: EventStatus;
}

export interface NotificationItem {
  id: string;
  title: string;
  isRead: boolean;
  createdAt: string;
}

export type MediaVisibility = "public" | "private";

export interface MediaItem {
  id: string;
  pageKey: string;
  title: string;
  description: string;
  tags: string[];
  visibility: MediaVisibility;
  featured: boolean;
  imageUrl: string;
  createdAt: string;
}

export type AnnouncementStatus = "published" | "draft";
export type AnnouncementAudience = "all" | "members" | "volunteers" | "patients";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  publishedAt: string;
  status: AnnouncementStatus;
  pinned: boolean;
}

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "archived";

export interface CampaignItem {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currency: string;
  raisedAmount: number;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  coverImageUrl: string;
  featured: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  sortOrder: number;
}

export interface TagItem {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface StaffMember {
  id: string;
  displayName: string;
  email: string;
  role: "admin" | "editor";
  photoUrl: string;
  isActive: boolean;
  createdAt: string;
}