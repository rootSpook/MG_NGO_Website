import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS, DOCUMENT_IDS } from "./constants";
import type { TemplateType } from "@/types/pageBuilder";

export interface NavItem {
  key: string;
  href: string;
  label: string;
  isVisible: boolean;
  sortOrder: number;
  isDonateButton?: boolean;
  /** Slug of the associated contentItem (type="page"). Null means no CMS page is linked. */
  pageSlug?: string | null;
  /**
   * 'cms'     = page is managed by the block-based Page Builder
   * 'special' = page has a hardcoded route (events, blogs, reports, etc.)
   * undefined = legacy item, treat as special
   */
  pageType?: "cms" | "special" | null;
  /** Template that was chosen when the CMS page was created. Only set when pageType='cms'. */
  templateType?: TemplateType | null;
  /**
   * Publish state of the linked page. Drafts are hidden from the public
   * navigation bar but remain accessible by URL. Defaults to 'published'.
   */
  pageStatus?: "draft" | "published" | null;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { key: "hakkimizda", href: "/about", label: "Hakkımızda", isVisible: true, sortOrder: 1, pageSlug: "hakkimizda", pageType: "cms", templateType: "general" },
  { key: "mg-hakkinda", href: "/mg", label: "MG Hakkında", isVisible: true, sortOrder: 2, pageSlug: "mg", pageType: "cms", templateType: "general" },
  { key: "bloglar", href: "/blogs", label: "Bloglar", isVisible: true, sortOrder: 3, pageSlug: null, pageType: "special" },
  { key: "etkinlikler", href: "/events", label: "Etkinlikler", isVisible: true, sortOrder: 4, pageSlug: null, pageType: "special" },
  { key: "raporlar", href: "/reports", label: "Raporlar", isVisible: true, sortOrder: 5, pageSlug: null, pageType: "special" },
  { key: "medya", href: "/media", label: "Medya", isVisible: true, sortOrder: 6, pageSlug: null, pageType: "special" },
  { key: "iletisim", href: "/contacts", label: "İletişim", isVisible: true, sortOrder: 7, pageSlug: null, pageType: "special" },
  { key: "bagis", href: "/donate", label: "Bağış Yap", isVisible: true, sortOrder: 8, isDonateButton: true, pageSlug: null, pageType: "special" },
];

export async function getNavConfig(): Promise<NavItem[]> {
  try {
    const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, DOCUMENT_IDS.NAVIGATION));
    if (snap.exists()) {
      const items = (snap.data().items ?? []) as NavItem[];
      if (items.length > 0) {
        return items.sort((a, b) => a.sortOrder - b.sortOrder);
      }
    }
  } catch (err) {
    console.error("[navServices] getNavConfig error:", err);
  }
  return DEFAULT_NAV_ITEMS;
}

export async function saveNavConfig(items: NavItem[]): Promise<void> {
  await setDoc(
    doc(db, COLLECTIONS.SETTINGS, DOCUMENT_IDS.NAVIGATION),
    { items },
    { merge: true }
  );
}

/** Append a new nav item to the current config and persist. */
export async function createNavItem(newItem: NavItem): Promise<void> {
  const current = await getNavConfig();
  const maxOrder = current.reduce((m, i) => Math.max(m, i.sortOrder), 0);
  const withOrder: NavItem = { ...newItem, sortOrder: maxOrder + 1 };
  await saveNavConfig([...current, withOrder]);
}

/** Remove a nav item by key and persist the updated list. */
export async function deleteNavItem(key: string): Promise<void> {
  const current = await getNavConfig();
  const filtered = current
    .filter((i) => i.key !== key)
    .map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
  await saveNavConfig(filtered);
}

/** Update a single field on a nav item (e.g. pageStatus) and persist. */
export async function patchNavItem(
  key: string,
  patch: Partial<NavItem>
): Promise<void> {
  const current = await getNavConfig();
  const next = current.map((item) =>
    item.key === key ? { ...item, ...patch } : item
  );
  await saveNavConfig(next);
}
