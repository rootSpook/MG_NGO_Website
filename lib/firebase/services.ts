import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS, CONTENT_STATUS, EVENT_STATUS, CONTACT_STATUS, CAMPAIGN_STATUS } from "./constants";
import type {
  SiteSettings,
  ContentItem,
  Event,
  Category,
  Tag,
  ContactMessage,
  MediaAsset,
  Campaign,
} from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Casts a Firestore document snapshot to T, injecting the document id. */
function fromDoc<T>(snap: { id: string; data: () => Record<string, unknown> }): T & { id: string } {
  return { id: snap.id, ...(snap.data() as T) };
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, "site"));
  if (!snap.exists()) return null;
  return snap.data() as SiteSettings;
}

// ── Content items ─────────────────────────────────────────────────────────────

export async function getPublishedContentByType(
  type: ContentItem["type"]
): Promise<(ContentItem & { id: string })[]> {
  const q = query(
    collection(db, COLLECTIONS.CONTENT_ITEMS),
    where("type", "==", type),
    where("status", "==", CONTENT_STATUS.PUBLISHED),
    where("deletedAt", "==", null),
    orderBy("publishedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<ContentItem>(d));
}

export async function getContentBySlug(
  slug: string
): Promise<(ContentItem & { id: string }) | null> {
  const q = query(
    collection(db, COLLECTIONS.CONTENT_ITEMS),
    where("slug", "==", slug),
    where("status", "==", CONTENT_STATUS.PUBLISHED),
    where("deletedAt", "==", null)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return fromDoc<ContentItem>(snap.docs[0]);
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function getPublishedEvents(): Promise<(Event & { id: string })[]> {
  const q = query(
    collection(db, COLLECTIONS.EVENTS),
    where("status", "==", EVENT_STATUS.PUBLISHED),
    orderBy("startsAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<Event>(d));
}

// ── Categories & Tags ─────────────────────────────────────────────────────────

export async function getCategories(): Promise<(Category & { id: string })[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
  return snap.docs.map((d) => fromDoc<Category>(d));
}

export async function getTags(): Promise<(Tag & { id: string })[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.TAGS));
  return snap.docs.map((d) => fromDoc<Tag>(d));
}

// ── Media assets ──────────────────────────────────────────────────────────────

export async function getPublicMediaAssets(): Promise<(MediaAsset & { id: string })[]> {
  const q = query(
    collection(db, COLLECTIONS.MEDIA_ASSETS),
    where("visibility", "==", "public"),
    where("deletedAt", "==", null),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<MediaAsset>(d));
}

// ── Campaigns ─────────────────────────────────────────────────────────────────

export async function getActiveCampaigns(): Promise<(Campaign & { id: string })[]> {
  const q = query(
    collection(db, COLLECTIONS.CAMPAIGNS),
    where("status", "==", CAMPAIGN_STATUS.ACTIVE)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => fromDoc<Campaign>(d));
}

// ── IBAN entries (public read) ────────────────────────────────────────────────

export interface PublicIbanEntry {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  currency: string;
  sortOrder: number;
}

export async function getPublicIbanEntries(): Promise<PublicIbanEntry[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.IBAN_ENTRIES));
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        bankName: data.bankName ?? "",
        accountHolder: data.accountHolder ?? "",
        iban: data.iban ?? "",
        currency: data.currency ?? "TRY",
        sortOrder: data.sortOrder ?? 0,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ── Supporters (public read) ──────────────────────────────────────────────────

export interface PublicSupporter {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
}

export async function getPublicSupporters(): Promise<PublicSupporter[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.SUPPORTERS));
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name ?? "",
        logoUrl: data.logoUrl ?? "",
        websiteUrl: data.websiteUrl ?? "",
        sortOrder: data.sortOrder ?? 0,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ── Contact messages ──────────────────────────────────────────────────────────

export interface ContactMessageInput {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  messageBody: string;
}

// ── Volunteer applications ────────────────────────────────────────────────────

export interface VolunteerApplicationInput {
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  motivation: string;
}

export async function submitVolunteerApplication(
  data: VolunteerApplicationInput
): Promise<string> {
  const ref = await addDoc(
    collection(db, COLLECTIONS.VOLUNTEER_APPLICATIONS),
    {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone ?? null,
      city: data.city ?? null,
      motivation: data.motivation,
      status: "new",
      createdAt: serverTimestamp(),
    }
  );
  return ref.id;
}

// ── Contact messages ──────────────────────────────────────────────────────────

export async function submitContactMessage(
  data: ContactMessageInput
): Promise<string> {
  const payload: Omit<ContactMessage, "id"> = {
    senderName: data.senderName,
    senderEmail: data.senderEmail,
    senderPhone: data.senderPhone ?? null,
    subject: data.subject,
    messageBody: data.messageBody,
    status: CONTACT_STATUS.NEW,
    handledBy: null,
    handledAt: null,
    internalNotes: null,
    ipAddress: null,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : null,
    // Firestore will set these server-side; cast needed because the function
    // signature expects Timestamp but we're sending FieldValue at runtime.
    createdAt: serverTimestamp() as unknown as import("firebase/firestore").Timestamp,
    updatedAt: serverTimestamp() as unknown as import("firebase/firestore").Timestamp,
    deletedAt: null,
  };

  const ref = await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), payload);
  return ref.id;
}
