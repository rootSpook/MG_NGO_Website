// ─────────────────────────────────────────────────────────────────────────────
// Firestore collection name constants
// ─────────────────────────────────────────────────────────────────────────────

export const COLLECTIONS = {
  SETTINGS: "settings",
  STAFF: "staff",
  CATEGORIES: "categories",
  TAGS: "tags",
  CONTENT_ITEMS: "contentItems",
  MEDIA_ASSETS: "mediaAssets",
  CONTACT_MESSAGES: "contactMessages",
  CAMPAIGNS: "campaigns",
  DONATIONS: "donations",
  EVENTS: "events",
  AUDIT_LOGS: "auditLogs",
  ANNOUNCEMENTS: "announcements",
  NOTIFICATIONS: "notifications",
  VOLUNTEER_APPLICATIONS: "volunteerApplications",
  BOARD_MEMBERS: "boardMembers",
  SUPPORTERS: "supporters",
  IBAN_ENTRIES: "ibanEntries",
} as const;

// Sub-collection names
export const SUB_COLLECTIONS = {
  REVISIONS: "revisions",
  REGISTRATIONS: "registrations",
} as const;

// Well-known document IDs
export const DOCUMENT_IDS = {
  SITE_SETTINGS: "site",
  NAVIGATION: "navigation",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Role constants
// ─────────────────────────────────────────────────────────────────────────────

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Content type constants
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENT_TYPE = {
  PAGE: "page",
  POST: "post",
  NEWS: "news",
  FAQ: "faq",
  POLICY: "policy",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Content status constants
// ─────────────────────────────────────────────────────────────────────────────

export const CONTENT_STATUS = {
  DRAFT: "draft",
  IN_REVIEW: "inReview",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Media constants
// ─────────────────────────────────────────────────────────────────────────────

export const MEDIA_KIND = {
  IMAGE: "image",
  DOCUMENT: "document",
  VIDEO: "video",
  OTHER: "other",
} as const;

export const MEDIA_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Contact message status constants
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACT_STATUS = {
  NEW: "new",
  IN_PROGRESS: "inProgress",
  RESOLVED: "resolved",
  SPAM: "spam",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Campaign status constants
// ─────────────────────────────────────────────────────────────────────────────

export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Donation status constants
// ─────────────────────────────────────────────────────────────────────────────

export const DONATION_STATUS = {
  INITIATED: "initiated",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELED: "canceled",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Event status constants
// ─────────────────────────────────────────────────────────────────────────────

export const EVENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  CANCELED: "canceled",
  ARCHIVED: "archived",
} as const;
