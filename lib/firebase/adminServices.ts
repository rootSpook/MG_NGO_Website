import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db, auth } from "./config";
import { COLLECTIONS } from "./constants";

export interface AdminDashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  totalEvents: number;
  totalAnnouncements: number;
  pendingMessages: number;
  pendingVolunteers: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [blogsSnap, eventsSnap, announcementsSnap, messagesSnap, volunteersSnap] =
    await Promise.all([
      getDocs(
        query(
          collection(db, COLLECTIONS.CONTENT_ITEMS),
          where("type", "==", "post"),
          where("deletedAt", "==", null)
        )
      ),
      getDocs(collection(db, COLLECTIONS.EVENTS)),
      getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS)),
      getDocs(
        query(
          collection(db, COLLECTIONS.CONTACT_MESSAGES),
          where("status", "==", "new")
        )
      ),
      getDocs(
        query(
          collection(db, COLLECTIONS.VOLUNTEER_APPLICATIONS),
          where("status", "==", "new")
        )
      ),
    ]);

  const publishedBlogs = blogsSnap.docs.filter(
    (d) => d.data().status === "published"
  ).length;

  return {
    totalBlogs: blogsSnap.size,
    publishedBlogs,
    totalEvents: eventsSnap.size,
    totalAnnouncements: announcementsSnap.size,
    pendingMessages: messagesSnap.size,
    pendingVolunteers: volunteersSnap.size,
  };
}

// ── Board members ─────────────────────────────────────────────────────────────

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  sortOrder: number;
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  const snap = await getDocs(collection(db, COLLECTIONS.BOARD_MEMBERS));
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name ?? "",
        title: data.title ?? "",
        bio: data.bio ?? "",
        photoUrl: data.photoUrl ?? "",
        sortOrder: data.sortOrder ?? 0,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createBoardMember(
  member: Omit<BoardMember, "id">
): Promise<string> {
  const uid = auth.currentUser?.uid ?? null;
  const ref = await addDoc(collection(db, COLLECTIONS.BOARD_MEMBERS), {
    ...member,
    createdBy: uid,
    updatedBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBoardMember(
  id: string,
  data: Partial<Omit<BoardMember, "id">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.BOARD_MEMBERS, id), {
    ...data,
    updatedBy: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBoardMember(id: string): Promise<void> {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, COLLECTIONS.BOARD_MEMBERS, id));
}

// ── Supporters ────────────────────────────────────────────────────────────────

export interface Supporter {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
}

export async function getSupporters(): Promise<Supporter[]> {
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

export async function createSupporter(
  supporter: Omit<Supporter, "id">
): Promise<string> {
  const uid = auth.currentUser?.uid ?? null;
  const ref = await addDoc(collection(db, COLLECTIONS.SUPPORTERS), {
    ...supporter,
    createdBy: uid,
    updatedBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSupporter(
  id: string,
  data: Partial<Omit<Supporter, "id">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.SUPPORTERS, id), {
    ...data,
    updatedBy: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSupporter(id: string): Promise<void> {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, COLLECTIONS.SUPPORTERS, id));
}

// ── IBAN entries ──────────────────────────────────────────────────────────────

export interface IbanEntry {
  id: string;
  bankName: string;
  accountHolder: string;
  iban: string;
  currency: string;
  sortOrder: number;
}

export async function getIbanEntries(): Promise<IbanEntry[]> {
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

export async function createIbanEntry(entry: Omit<IbanEntry, "id">): Promise<string> {
  const uid = auth.currentUser?.uid ?? null;
  const ref = await addDoc(collection(db, COLLECTIONS.IBAN_ENTRIES), {
    ...entry,
    createdBy: uid,
    updatedBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateIbanEntry(
  id: string,
  data: Partial<Omit<IbanEntry, "id">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.IBAN_ENTRIES, id), {
    ...data,
    updatedBy: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIbanEntry(id: string): Promise<void> {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, COLLECTIONS.IBAN_ENTRIES, id));
}

// ── Reports (contentItems type="policy") ─────────────────────────────────────

export interface AdminReport {
  id: string;
  title: string;
  excerpt: string;
  year: string;
  category: string;
  fileUrl: string;
  featured: boolean;
}

export async function getAdminReports(): Promise<AdminReport[]> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.CONTENT_ITEMS),
      where("type", "==", "policy"),
      where("deletedAt", "==", null)
    )
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      excerpt: data.excerpt ?? "",
      year: data.year ?? "",
      category: data.categoryId ?? "",
      fileUrl: data.coverImageUrl ?? "",
      featured: data.featured ?? false,
    };
  });
}

export async function createAdminReport(report: Omit<AdminReport, "id">): Promise<string> {
  const uid = auth.currentUser?.uid ?? null;
  const ref = await addDoc(collection(db, COLLECTIONS.CONTENT_ITEMS), {
    type: "policy",
    status: "published",
    title: report.title,
    slug: report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80),
    excerpt: report.excerpt,
    year: report.year,
    categoryId: report.category,
    coverImageUrl: report.fileUrl,
    featured: report.featured,
    bodyMarkdown: "",
    bodyHtml: null,
    publishedAt: serverTimestamp(),
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
    authorName: null,
    pages: null,
    format: "PDF",
    pageData: null,
    createdBy: uid,
    updatedBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    archivedAt: null,
    deletedAt: null,
  });
  return ref.id;
}

export async function updateAdminReport(
  id: string,
  data: Partial<Omit<AdminReport, "id">>
): Promise<void> {
  const update: DocumentData = {
    updatedBy: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  };
  if (data.title !== undefined) update.title = data.title;
  if (data.excerpt !== undefined) update.excerpt = data.excerpt;
  if (data.year !== undefined) update.year = data.year;
  if (data.category !== undefined) update.categoryId = data.category;
  if (data.fileUrl !== undefined) update.coverImageUrl = data.fileUrl;
  if (data.featured !== undefined) update.featured = data.featured;
  await updateDoc(doc(db, COLLECTIONS.CONTENT_ITEMS, id), update);
}

export async function deleteAdminReport(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CONTENT_ITEMS, id), {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ── Contact messages ──────────────────────────────────────────────────────────

export interface AdminContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  messageBody: string;
  status: "new" | "inProgress" | "resolved" | "spam";
  internalNotes: string;
  createdAt: string;
}

export async function getContactMessages(): Promise<AdminContactMessage[]> {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.CONTACT_MESSAGES),
      where("deletedAt", "==", null)
    )
  );
  return snap.docs
    .map((d) => {
      const data = d.data();
      const ts = data.createdAt;
      const createdAt = ts?.toDate ? ts.toDate().toISOString() : String(ts ?? "");
      return {
        id: d.id,
        senderName: data.senderName ?? "",
        senderEmail: data.senderEmail ?? "",
        senderPhone: data.senderPhone ?? "",
        subject: data.subject ?? "",
        messageBody: data.messageBody ?? "",
        status: (data.status as AdminContactMessage["status"]) ?? "new",
        internalNotes: data.internalNotes ?? "",
        createdAt,
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateContactMessageStatus(
  id: string,
  status: AdminContactMessage["status"],
  internalNotes?: string
): Promise<void> {
  const uid = auth.currentUser?.uid ?? null;
  await updateDoc(doc(db, COLLECTIONS.CONTACT_MESSAGES, id), {
    status,
    ...(internalNotes !== undefined ? { internalNotes } : {}),
    handledBy: uid,
    handledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ── Page content upsert ───────────────────────────────────────────────────────
// Finds the contentItems doc by slug and updates its pageData field.
// Creates a new doc if none exists yet.

export async function upsertPageContent(
  slug: string,
  pageData: Record<string, unknown>
): Promise<void> {
  const uid = auth.currentUser?.uid ?? null;
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.CONTENT_ITEMS), where("slug", "==", slug))
  );

  if (!snap.empty) {
    await updateDoc(doc(db, COLLECTIONS.CONTENT_ITEMS, snap.docs[0].id), {
      pageData,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  } else {
    await addDoc(collection(db, COLLECTIONS.CONTENT_ITEMS), {
      type: "page",
      status: "published",
      slug,
      title: slug,
      pageData,
      excerpt: null,
      bodyMarkdown: "",
      bodyHtml: null,
      publishedAt: serverTimestamp(),
      featured: false,
      sortOrder: null,
      categoryRef: null,
      categoryId: null,
      tagRefs: [],
      tagIds: [],
      ogImageAssetRef: null,
      coverAssetRef: null,
      coverImageUrl: null,
      attachmentAssetRefs: [],
      seoTitle: null,
      seoDescription: null,
      canonicalUrl: null,
      authorName: null,
      pages: null,
      format: null,
      createdBy: uid,
      updatedBy: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      archivedAt: null,
      deletedAt: null,
    });
  }
}
