/**
 * Public page content functions — read live data from Firestore.
 * Falls back to seed data if Firestore returns nothing.
 */

import { getSiteSettings, getContentBySlug } from "@/lib/firebase/services";
import { seedPages, seedSettings } from "@/lib/firebase/seedData";

// ── Types (kept for existing imports) ─────────────────────────────────────────

export interface HomePageData {
  hero: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  about: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  quickLinks: Array<{
    title: string;
    description: string;
    href: string;
  }>;
}

export interface AboutPageData {
  title: string;
  intro: string;
  vision: string[];
  mission: string[];
  team: Array<{
    name: string;
    description: string;
  }>;
}

export interface ContactPageData {
  title: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

// ── Fallbacks from seed data ──────────────────────────────────────────────────

const homeSeed = seedPages.find((p) => p.slug === "anasayfa")!;
const aboutSeed = seedPages.find((p) => p.slug === "hakkimizda")!;
const contactSeed = seedPages.find((p) => p.slug === "iletisim")!;

export const homePageTemplate = homeSeed.pageData as unknown as HomePageData;
export const aboutPageTemplate = aboutSeed.pageData as unknown as AboutPageData;
export const contactPageTemplate = {
  ...(contactSeed.pageData as unknown as Omit<ContactPageData, "email" | "phone" | "location">),
  email: seedSettings.contactEmail ?? "",
  phone: seedSettings.contactPhone ?? "",
  location: seedSettings.addressText ?? "",
} satisfies ContactPageData;

// ── Live Firestore functions ───────────────────────────────────────────────────

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const item = await getContentBySlug("anasayfa");
    if (item?.pageData) return item.pageData as unknown as HomePageData;
  } catch (err) {
    console.error("[publicPagesContent] getHomePageData error:", err);
  }
  return homePageTemplate;
}

export async function getAboutPageData(): Promise<AboutPageData> {
  try {
    const item = await getContentBySlug("hakkimizda");
    if (item?.pageData) return item.pageData as unknown as AboutPageData;
  } catch (err) {
    console.error("[publicPagesContent] getAboutPageData error:", err);
  }
  return aboutPageTemplate;
}

export async function getContactPageData(): Promise<ContactPageData> {
  try {
    const [item, settings] = await Promise.all([
      getContentBySlug("iletisim"),
      getSiteSettings(),
    ]);
    const pageData = item?.pageData as unknown as Partial<ContactPageData> | undefined;
    return {
      title: pageData?.title ?? contactPageTemplate.title,
      intro: pageData?.intro ?? contactPageTemplate.intro,
      faq: pageData?.faq ?? contactPageTemplate.faq,
      email: settings?.contactEmail ?? contactPageTemplate.email,
      phone: settings?.contactPhone ?? contactPageTemplate.phone,
      location: settings?.addressText ?? contactPageTemplate.location,
    };
  } catch (err) {
    console.error("[publicPagesContent] getContactPageData error:", err);
  }
  return contactPageTemplate;
}
