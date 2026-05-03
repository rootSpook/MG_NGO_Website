// ─────────────────────────────────────────────────────────────────────────────
// Block types supported by the Page Builder
// ─────────────────────────────────────────────────────────────────────────────

export type BlockType =
  | "hero"
  | "rich-text"
  | "event-grid"
  | "report-list"
  | "team-grid"
  | "faq-accordion"
  | "cta-banner"
  | "stats-bar";

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  "hero": "Hero Bölümü",
  "rich-text": "Metin İçeriği",
  "event-grid": "Etkinlik Kartları",
  "report-list": "Rapor Listesi",
  "team-grid": "Ekip Üyeleri",
  "faq-accordion": "SSS Akordeon",
  "cta-banner": "Eylem Çağrısı Bandı",
  "stats-bar": "İstatistik Şeridi",
};

// ─────────────────────────────────────────────────────────────────────────────
// Page templates — pre-seed the section array when creating a new page
// ─────────────────────────────────────────────────────────────────────────────

export type TemplateType = "general" | "event-hub" | "report-list" | "blog-hub" | "custom";

export const TEMPLATE_LABELS: Record<TemplateType, string> = {
  general: "Genel Bilgi Sayfası",
  "event-hub": "Etkinlik Merkezi",
  "report-list": "Rapor / Belge Merkezi",
  "blog-hub": "Blog Merkezi",
  custom: "Boş Sayfa (Özel)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Core section / block schema stored in ContentItem.pageData.sections
// ─────────────────────────────────────────────────────────────────────────────

export interface PageSection {
  id: string;       // stable nanoid — never changes on reorder
  type: BlockType;
  data: Record<string, unknown>;
  order: number;
  visible?: boolean; // defaults to true when absent
}

/** The shape written to ContentItem.pageData for block-managed pages */
export interface PageBlockData {
  templateType: TemplateType;
  sections: PageSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-block data shapes
// Each editor component casts block.data to the matching interface.
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroBlockData {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  overlayDark?: boolean;
}

export interface RichTextBlockData {
  markdown: string;
}

export interface EventGridBlockData {
  /** 'firestore' = pull live from events collection, 'manual' = curated list below */
  source: "firestore" | "manual";
  limit?: number;
  manualEvents?: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    href: string;
  }>;
}

export interface ReportListBlockData {
  reports: Array<{
    id: string;
    title: string;
    year: string;
    fileUrl: string;
    category: string;
    excerpt: string;
  }>;
}

export interface TeamGridBlockData {
  /** 'firestore' = pull from boardMembers collection, 'manual' = local list */
  source: "firestore" | "manual";
  manualMembers?: Array<{
    id: string;
    name: string;
    title: string;
    bio: string;
    photoUrl: string;
  }>;
}

export interface FaqBlockData {
  items: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

export interface CtaBannerBlockData {
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  variant?: "teal" | "dark" | "light";
}

export interface StatsBarBlockData {
  stats: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template seed data — what sections are pre-created per template choice
// ─────────────────────────────────────────────────────────────────────────────

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function seedSectionsForTemplate(template: TemplateType): PageSection[] {
  switch (template) {
    case "general":
      return [
        {
          id: makeId(),
          type: "hero",
          order: 0,
          data: { title: "", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "" } satisfies HeroBlockData,
        },
        {
          id: makeId(),
          type: "rich-text",
          order: 1,
          data: { markdown: "" } satisfies RichTextBlockData,
        },
      ];

    case "event-hub":
      return [
        {
          id: makeId(),
          type: "hero",
          order: 0,
          data: { title: "", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "" } satisfies HeroBlockData,
        },
        {
          id: makeId(),
          type: "event-grid",
          order: 1,
          data: { source: "firestore", limit: 6 } satisfies EventGridBlockData,
        },
      ];

    case "report-list":
      return [
        {
          id: makeId(),
          type: "hero",
          order: 0,
          data: { title: "", subtitle: "", imageUrl: "", ctaLabel: "", ctaHref: "" } satisfies HeroBlockData,
        },
        {
          id: makeId(),
          type: "report-list",
          order: 1,
          data: { reports: [] } satisfies ReportListBlockData,
        },
      ];

    case "blog-hub":
      return [
        {
          id: makeId(),
          type: "hero",
          order: 0,
          data: { title: "", subtitle: "", imageUrl: "", ctaLabel: "Tüm Yazılar", ctaHref: "/blogs" } satisfies HeroBlockData,
        },
        {
          id: makeId(),
          type: "rich-text",
          order: 1,
          data: { markdown: "Derneğimizin blog yazılarına aşağıdaki bağlantıdan ulaşabilirsiniz." } satisfies RichTextBlockData,
        },
      ];

    case "custom":
    default:
      return [];
  }
}
