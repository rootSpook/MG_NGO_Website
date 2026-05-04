/**
 * Public page content functions — read live data from Firestore.
 * Falls back to seed data if Firestore returns nothing.
 */

import { getSiteSettings, getContentBySlug } from "@/lib/firebase/services";
import { seedPages, seedSettings } from "@/lib/firebase/seedData";
import { mergeEditablePageData } from "@/lib/pageContentConfig";

// ── Types (kept for existing imports) ─────────────────────────────────────────

export interface HomeQuickLink {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Icon key from IMPACT_ICONS — defaults to "sparkles" when missing. */
  icon?: string;
}

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
  quickLinksTitle?: string;
  quickLinks: HomeQuickLink[];
}

export interface AboutTeamMember {
  name: string;
  description: string;
  photoUrl?: string;
}

export interface AboutContentImage {
  id: string;
  url: string;
  caption?: string;
}

export interface AboutPageData {
  title: string;
  intro: string;
  vision: string[];
  mission: string[];
  team: AboutTeamMember[];
  /** Optional hero image displayed at the top of the page. */
  heroImage?: string;
  /** Optional gallery images shown alongside page content. */
  contentImages?: AboutContentImage[];
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

function normalizeQuickLinks(input: unknown): HomeQuickLink[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .map((entry, idx) => ({
      id: String(entry.id ?? `ql-${idx}`),
      icon: typeof entry.icon === "string" ? entry.icon : "sparkles",
      title: String(entry.title ?? ""),
      description: String(entry.description ?? ""),
      href: String(entry.href ?? "#"),
    }));
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const item = await getContentBySlug("anasayfa");
    if (item?.pageData) {
      const pageData = item.pageData as Record<string, unknown>;
      return {
        hero: (pageData.hero as HomePageData["hero"]) ?? homePageTemplate.hero,
        about: (pageData.about as HomePageData["about"]) ?? homePageTemplate.about,
        quickLinksTitle:
          typeof pageData.quickLinksTitle === "string"
            ? pageData.quickLinksTitle
            : homePageTemplate.quickLinksTitle,
        quickLinks:
          Array.isArray(pageData.quickLinks) && (pageData.quickLinks as unknown[]).length > 0
            ? normalizeQuickLinks(pageData.quickLinks)
            : homePageTemplate.quickLinks,
      };
    }
  } catch (err) {
    console.error("[publicPagesContent] getHomePageData error:", err);
  }
  return homePageTemplate;
}

export async function getAboutPageData(): Promise<AboutPageData> {
  try {
    const item = await getContentBySlug("hakkimizda");
    if (item?.pageData) {
      const pageData = item.pageData as unknown as Partial<AboutPageData>;
      return {
        title: pageData.title ?? aboutPageTemplate.title,
        intro: pageData.intro ?? aboutPageTemplate.intro,
        vision: pageData.vision ?? aboutPageTemplate.vision,
        mission: pageData.mission ?? aboutPageTemplate.mission,
        team: pageData.team ?? aboutPageTemplate.team,
        heroImage: pageData.heroImage ?? "",
        contentImages: pageData.contentImages ?? [],
      };
    }
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

export async function getEditablePageContent(key: string): Promise<Record<string, string>> {
  try {
    const item = await getContentBySlug(key);
    return mergeEditablePageData(key, item?.pageData as Record<string, unknown> | null | undefined);
  } catch (err) {
    console.error("[publicPagesContent] getEditablePageContent error:", err);
  }
  return mergeEditablePageData(key);
}
