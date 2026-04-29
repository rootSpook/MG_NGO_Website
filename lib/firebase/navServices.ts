import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { COLLECTIONS, DOCUMENT_IDS } from "./constants";

export interface NavItem {
  key: string;
  href: string;
  label: string;
  isVisible: boolean;
  sortOrder: number;
  isDonateButton?: boolean;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { key: "hakkimizda", href: "/about", label: "Hakkımızda", isVisible: true, sortOrder: 1 },
  { key: "mg-hakkinda", href: "/mg", label: "MG Hakkında", isVisible: true, sortOrder: 2 },
  { key: "bloglar", href: "/blogs", label: "Bloglar", isVisible: true, sortOrder: 3 },
  { key: "etkinlikler", href: "/events", label: "Etkinlikler", isVisible: true, sortOrder: 4 },
  { key: "raporlar", href: "/reports", label: "Raporlar", isVisible: true, sortOrder: 5 },
  { key: "medya", href: "/media", label: "Medya", isVisible: true, sortOrder: 6 },
  { key: "iletisim", href: "/contacts", label: "İletişim", isVisible: true, sortOrder: 7 },
  { key: "bagis", href: "/donate", label: "Bağış Yap", isVisible: true, sortOrder: 8, isDonateButton: true },
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
