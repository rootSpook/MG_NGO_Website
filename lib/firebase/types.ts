import type { Timestamp, DocumentReference } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

export type Role = "admin" | "editor";

export type ContentType = "page" | "post" | "news" | "faq" | "policy";

export type ContentStatus = "draft" | "inReview" | "published" | "archived";

export type MediaKind = "image" | "document" | "video" | "other";

export type MediaVisibility = "public" | "private";

export type ContactMessageStatus = "new" | "inProgress" | "resolved" | "spam";

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type DonationStatus =
  | "initiated"
  | "succeeded"
  | "failed"
  | "refunded"
  | "canceled";

export type EventStatus = "draft" | "published" | "canceled" | "archived";

// ─────────────────────────────────────────────────────────────────────────────
// settings/site
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  ngoName: string;
  ngoLegalName: string;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  addressText: string | null;
  logoAssetRef: DocumentReference | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  theme?: {
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
    fontFamily?: string | null;
    [key: string]: any;
  } | null;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageAssetRef: DocumentReference | null;
  donationProviders: string[];
  donationRedirectUrls: Record<string, string>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// staff/{uid}
// ─────────────────────────────────────────────────────────────────────────────

export interface StaffMember {
  email: string;
  role: Role;
  displayName: string;
  isActive: boolean;
  lastLoginAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// categories/{categoryId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Category {
  name: string;
  slug: string;
  description: string | null;
  parentCategoryRef: DocumentReference | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// tags/{tagId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Tag {
  name: string;
  slug: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// contentItems/{contentItemId}
// ─────────────────────────────────────────────────────────────────────────────

export interface ContentItem {
  type: ContentType;
  status: ContentStatus;
  title: string;
  slug: string;
  excerpt: string | null;
  bodyMarkdown: string;
  bodyHtml: string | null;
  publishedAt: Timestamp | null;
  featured: boolean;
  sortOrder: number | null;
  categoryRef: DocumentReference | null;
  categoryId: string | null;
  tagRefs: DocumentReference[];
  tagIds: string[];
  ogImageAssetRef: DocumentReference | null;
  coverAssetRef: DocumentReference | null;
  /** Direct image URL, used when no Firebase Storage asset is uploaded yet */
  coverImageUrl: string | null;
  attachmentAssetRefs: DocumentReference[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  /** Author display name, used by blog posts */
  authorName: string | null;
  /** Number of pages, used by reports (type == "policy") */
  pages: number | null;
  /** File format label, used by reports (type == "policy") */
  format: string | null;
  /** Arbitrary structured data for CMS-managed pages (type == "page") */
  pageData: Record<string, unknown> | null;
  createdBy: DocumentReference | string | null;
  updatedBy: DocumentReference | string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archivedAt: Timestamp | null;
  deletedAt: Timestamp | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// contentItems/{contentItemId}/revisions/{revisionId}
// ─────────────────────────────────────────────────────────────────────────────

export interface ContentRevision {
  contentSnapshot: Omit<
    ContentItem,
    "createdBy" | "updatedBy" | "createdAt" | "updatedAt" | "archivedAt" | "deletedAt"
  >;
  createdBy: DocumentReference;
  createdAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// mediaAssets/{assetId}
// ─────────────────────────────────────────────────────────────────────────────

export interface MediaAsset {
  kind: MediaKind;
  visibility: MediaVisibility;
  originalFilename: string;
  mimeType: string;
  byteSize: number;
  checksumSha256: string | null;
  storageBucket: string;
  storagePath: string;
  downloadUrl: string;
  width: number | null;
  height: number | null;
  altText: string | null;
  description: string | null;
  tags: string[];
  featured: boolean;
  /** Associates asset with a specific page slot (e.g. "home-slider", "about-gallery") */
  pageKey: string | null;
  uploadedBy: DocumentReference | string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// contactMessages/{messageId}
// ───────────────────────────────────────────────────────────────────��─────────

export interface ContactMessage {
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  subject: string;
  messageBody: string;
  status: ContactMessageStatus;
  handledBy: DocumentReference | null;
  handledAt: Timestamp | null;
  internalNotes: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// campaigns/{campaignId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Campaign {
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  status: CampaignStatus;
  goalAmount: number | null;
  raisedAmount: number;
  currency: string;
  imageUrl: string | null;
  startsAt: Timestamp | null;
  endsAt: Timestamp | null;
  coverAssetRef: DocumentReference | null;
  createdBy: DocumentReference | string | null;
  updatedBy: DocumentReference | string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archivedAt: Timestamp | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// donations/{donationId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Donation {
  provider: string;
  providerReferenceId: string | null;
  status: DonationStatus;
  amount: number;
  currency: string;
  campaignRef: DocumentReference | null;
  campaignId: string | null;
  donorName: string | null;
  donorEmail: string | null;
  donorMessage: string | null;
  isAnonymous: boolean;
  occurredAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// events/{eventId}
// ─────────────────────────────────────────────────────────────────────────────

export interface Event {
  title: string;
  slug: string;
  description: string | null;
  status: EventStatus;
  startsAt: Timestamp;
  endsAt: Timestamp | null;
  isOnline: boolean;
  onlineUrl: string | null;
  locationName: string | null;
  locationAddress: string | null;
  capacity: number | null;
  coverAssetRef: DocumentReference | null;
  createdBy: DocumentReference;
  updatedBy: DocumentReference;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─────────────────────────────────────────────────────────────────────────────
// events/{eventId}/registrations/{registrationId}
// ─────────────────────────────────────────────────────────────────────────────

export interface EventRegistration {
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: Timestamp;
  canceledAt: Timestamp | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// auditLogs/{auditId}
// ─────────────────────────────────────────────────────────────────────────────

export interface AuditLog {
  actorRef: DocumentReference;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: Timestamp;
}
