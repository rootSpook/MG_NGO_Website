/**
 * Public content functions — read live data from Firestore.
 * All functions fall back to seed data if Firestore returns nothing,
 * so the site is never empty even on a fresh deployment before seeding.
 */

import {
  getPublishedContentByType,
  getContentBySlug,
  getActiveCampaigns,
  getPublicMediaAssets,
  getSiteSettings,
} from "@/lib/firebase/services";
import {
  seedBlogPosts,
  seedCampaigns,
  seedMediaAssets,
  seedReports,
  seedSettings,
} from "@/lib/firebase/seedData";

// ── Types (kept here so existing imports don't break) ─────────────────────────

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage: string;
  content: string[];
}

export interface DonationCampaign {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  currentAmount: number;
  targetAmount: number;
}

export interface DonationPageData {
  title: string;
  subtitle: string;
  bankName: string;
  accountName: string;
  iban: string;
  swiftCode: string;
  monthlyMessage: string;
  campaigns: DonationCampaign[];
}

export interface MediaListItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageClass: string;
  readTime: string;
}

export interface MediaGalleryItem {
  id: number;
  title: string;
  colorClass: string;
}

export interface MediaPageData {
  hero: {
    breadcrumbCurrent: string;
    title: string;
    description: string;
  };
  featured: {
    sectionTitle: string;
    badgeLabel: string;
    category: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    actionLabel: string;
    videoLabel: string;
  };
  listSectionTitle: string;
  categories: string[];
  items: MediaListItem[];
  loadMoreLabel: string;
  gallery: {
    title: string;
    viewAllLabel: string;
    images: MediaGalleryItem[];
  };
  cta: {
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterInputPlaceholder: string;
    newsletterButtonLabel: string;
    newsletterNote: string;
    pressTitle: string;
    pressDescription: string;
    pressButtonLabel: string;
    pressEmail: string;
    pressPhone: string;
    bannerTitle: string;
    bannerDescription: string;
    bannerButtonLabel: string;
    bannerButtonHref: string;
  };
}

export interface ReportListItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: string;
  pages: number;
  format: string;
}

export interface ReportsPageData {
  hero: {
    breadcrumbCurrent: string;
    title: string;
    description: string;
  };
  featured: {
    sectionTitle: string;
    badgeLabel: string;
    category: string;
    title: string;
    description: string;
    date: string;
    pagesLabel: string;
    formatLabel: string;
    downloadLabel: string;
    readOnlineLabel: string;
    coverCaption: string;
  };
  listSectionTitle: string;
  categories: string[];
  reports: ReportListItem[];
  searchPlaceholder: string;
  emptyStateText: string;
  loadMoreLabel: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1400&auto=format&fit=crop";

function firestoreTimestampToISO(ts: unknown): string {
  if (!ts) return new Date().toISOString();
  if (typeof (ts as { toDate?: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  return String(ts);
}

// ── Blogs ─────────────────────────────────────────────────────────────────────

export async function getPublishedBlogs(): Promise<PublicBlogPost[]> {
  try {
    const items = await getPublishedContentByType("post");
    if (items.length > 0) {
      return items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt ?? "",
        publishedAt: firestoreTimestampToISO(item.publishedAt).split("T")[0],
        coverImage: item.coverImageUrl ?? FALLBACK_COVER,
        content: item.bodyMarkdown ? item.bodyMarkdown.split("\n\n") : [],
      }));
    }
  } catch (err) {
    console.error("[publicContent] getPublishedBlogs Firestore error:", err);
  }

  // Fallback to seed data
  return seedBlogPosts
    .filter((b) => b.status === "published")
    .map((b) => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      publishedAt: b.publishedAt ?? new Date().toISOString().split("T")[0],
      coverImage: b.coverImageUrl ?? FALLBACK_COVER,
      content: b.bodyMarkdown ? b.bodyMarkdown.split("\n\n") : [],
    }));
}

export async function getBlogBySlug(
  slug: string
): Promise<PublicBlogPost | null> {
  try {
    const item = await getContentBySlug(slug);
    if (item) {
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt ?? "",
        publishedAt: firestoreTimestampToISO(item.publishedAt).split("T")[0],
        coverImage: item.coverImageUrl ?? FALLBACK_COVER,
        content: item.bodyMarkdown ? item.bodyMarkdown.split("\n\n") : [],
      };
    }
  } catch (err) {
    console.error("[publicContent] getBlogBySlug Firestore error:", err);
  }

  // Fallback to seed data
  const found = seedBlogPosts.find((b) => b.slug === slug);
  if (!found) return null;
  return {
    id: found.id,
    slug: found.slug,
    title: found.title,
    excerpt: found.excerpt,
    publishedAt: found.publishedAt ?? new Date().toISOString().split("T")[0],
    coverImage: found.coverImageUrl ?? FALLBACK_COVER,
    content: found.bodyMarkdown ? found.bodyMarkdown.split("\n\n") : [],
  };
}

// ── Donation page ─────────────────────────────────────────────────────────────

export async function getDonationPageData(): Promise<DonationPageData> {
  let campaigns: DonationCampaign[] = [];

  try {
    const firestoreCampaigns = await getActiveCampaigns();
    if (firestoreCampaigns.length > 0) {
      campaigns = firestoreCampaigns.map((c) => ({
        id: c.id,
        title: c.title,
        subtitle: c.subtitle ?? "",
        description: c.description ?? "",
        imageUrl: c.imageUrl ?? FALLBACK_COVER,
        currentAmount: c.raisedAmount ?? 0,
        targetAmount: c.goalAmount ?? 0,
      }));
    }
  } catch (err) {
    console.error("[publicContent] getDonationPageData Firestore error:", err);
  }

  if (campaigns.length === 0) {
    campaigns = seedCampaigns.map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      imageUrl: c.imageUrl,
      currentAmount: c.raisedAmount,
      targetAmount: c.goalAmount,
    }));
  }

  // Site settings supply bank details
  let bankName = seedSettings.bankName;
  let accountName = seedSettings.accountName;
  let iban = seedSettings.iban;
  let swiftCode = seedSettings.swiftCode;
  let monthlyMessage = seedSettings.monthlyMessage;

  try {
    const settings = await getSiteSettings();
    if (settings) {
      bankName = (settings as unknown as Record<string, string>).bankName ?? bankName;
      accountName = (settings as unknown as Record<string, string>).accountName ?? accountName;
      iban = (settings as unknown as Record<string, string>).iban ?? iban;
      swiftCode = (settings as unknown as Record<string, string>).swiftCode ?? swiftCode;
      monthlyMessage = (settings as unknown as Record<string, string>).monthlyMessage ?? monthlyMessage;
    }
  } catch {
    // use seed defaults
  }

  return {
    title: "Myasthenia Gravis Topluluğunu Destekleyin",
    subtitle:
      "Yapacaginiz bagislar; farkindalik calismalarina ve MG ile yasayan hastalara destek olmamiza yardimci olur.",
    bankName,
    accountName,
    iban,
    swiftCode,
    monthlyMessage,
    campaigns,
  };
}

// ── Media page ────────────────────────────────────────────────────────────────

export async function getMediaPageData(): Promise<MediaPageData> {
  let galleryImages: MediaGalleryItem[] = [];

  try {
    const assets = await getPublicMediaAssets();
    const galleryAssets = assets.filter((a) => a.pageKey === "media-gallery");
    if (galleryAssets.length > 0) {
      galleryImages = galleryAssets.map((a, i) => ({
        id: i + 1,
        title: a.altText ?? a.originalFilename,
        colorClass: "bg-gradient-to-br from-teal-400 to-teal-600",
      }));
    }
  } catch (err) {
    console.error("[publicContent] getMediaPageData Firestore error:", err);
  }

  if (galleryImages.length === 0) {
    galleryImages = seedMediaAssets
      .filter((a) => a.pageKey === "media-gallery")
      .map((a, i) => ({
        id: i + 1,
        title: a.altText,
        colorClass: "bg-gradient-to-br from-teal-400 to-teal-600",
      }));
  }

  return {
    hero: {
      breadcrumbCurrent: "Medya",
      title: "Medya ve Haberler",
      description:
        "Myasthenia Gravis topluluğundan en güncel haberleri, etkinlikleri ve medya içeriklerini takip edin. Galeri, basın materyalleri ve duyurulara buradan ulaşın.",
    },
    featured: {
      sectionTitle: "Öne Çıkan Hikaye",
      badgeLabel: "Öne Çıkan",
      category: "Haber",
      title: "MG Farkındalık Ayı 2025: Birlikte Daha Güçlüyüz",
      description:
        "Haziran ayı Myasthenia Gravis Farkındalık Ayı. Bu yıl şimdiye kadarki en kapsamlı kampanyamızı başlatıyoruz. Farkındalığı artırmak, hikayeleri paylaşmak ve daha güçlü bir topluluk oluşturmak için bize katılın.",
      date: "10 Mart 2025",
      readTime: "5 dk okuma",
      actionLabel: "Hikayeyi Oku",
      videoLabel: "Hikayemizi İzleyin",
    },
    listSectionTitle: "Son Güncellemeler",
    categories: ["Tümü", "Haber", "Etkinlik", "Basın", "Duyuru"],
    items: [
      { id: 1, title: "İstanbul'da Yeni Tedavi Merkezi Açıldı", excerpt: "Sabancı Üniversitesi Hastanesi bünyesinde kapsamlı bakım sunan yeni bir MG tedavi merkezi hizmete girdi.", date: "8 Mart 2025", category: "Haber", imageClass: "bg-gradient-to-br from-blue-400 to-blue-600", readTime: "3 dk okuma" },
      { id: 2, title: "2025 Bahar Topluluk Buluşması", excerpt: "Hastaları, yakınlarını ve sağlık profesyonellerini bir araya getiren yıllık bahar buluşmamıza katılın.", date: "5 Mart 2025", category: "Etkinlik", imageClass: "bg-gradient-to-br from-green-400 to-green-600", readTime: "2 dk okuma" },
      { id: 3, title: "Avrupa MG Vakfı ile Ortaklık", excerpt: "Avrupa genelinde araştırma iş birliklerini genişletmek için yeni ortaklığımızı duyurmaktan mutluluk duyuyoruz.", date: "28 Şubat 2025", category: "Basın", imageClass: "bg-gradient-to-br from-purple-400 to-purple-600", readTime: "4 dk okuma" },
      { id: 4, title: "Güncellenmiş Hasta Kaynakları Yayında", excerpt: "Hastalar ve bakım verenler için Türkçe indirilebilir yeni rehberler ve kaynaklar erişime açıldı.", date: "20 Şubat 2025", category: "Duyuru", imageClass: "bg-gradient-to-br from-orange-400 to-orange-600", readTime: "2 dk okuma" },
      { id: 5, title: "Dr. Ayşe Yılmaz Danışma Kuruluna Katıldı", excerpt: "Nöroloji alanında uzman Dr. Ayşe Yılmaz, yıllara dayanan MG deneyimiyle tıbbi danışma kurulumuza katıldı.", date: "15 Şubat 2025", category: "Haber", imageClass: "bg-gradient-to-br from-teal-400 to-teal-600", readTime: "3 dk okuma" },
      { id: 6, title: "Gönüllü Eğitim Programı Başladı", excerpt: "Nisan ayında başlayacak kapsamlı gönüllü eğitim programımız için başvurular açıldı.", date: "10 Şubat 2025", category: "Duyuru", imageClass: "bg-gradient-to-br from-pink-400 to-pink-600", readTime: "2 dk okuma" },
    ],
    loadMoreLabel: "Daha Fazla",
    gallery: {
      title: "Fotoğraf Galerisi",
      viewAllLabel: "Tüm Fotoğrafları Gör",
      images: galleryImages.length > 0 ? galleryImages : [
        { id: 1, title: "MG Farkındalık Ayı Yürüyüşü 2024", colorClass: "bg-gradient-to-br from-teal-400 to-teal-600" },
        { id: 2, title: "Yıllık Konferans 2024", colorClass: "bg-gradient-to-br from-blue-400 to-blue-600" },
        { id: 3, title: "Topluluk Destek Toplantısı", colorClass: "bg-gradient-to-br from-green-400 to-green-600" },
        { id: 4, title: "Gönüllü Takdir Etkinliği", colorClass: "bg-gradient-to-br from-purple-400 to-purple-600" },
      ],
    },
    cta: {
      newsletterTitle: "Güncel Kalın",
      newsletterDescription: "En güncel haberleri, etkinlik duyurularını ve kaynakları doğrudan e-posta kutunuza almak için bültenimize abone olun.",
      newsletterInputPlaceholder: "E-posta adresinizi girin",
      newsletterButtonLabel: "Bültene Abone Ol",
      newsletterNote: "Abone olarak tarafımızdan e-posta almayı kabul etmiş olursunuz. İstediğiniz zaman abonelikten çıkabilirsiniz.",
      pressTitle: "Basın ve Medya Kiti",
      pressDescription: "Medya kullanımı için logolar, marka kılavuzu, bilgi notları ve yüksek çözünürlüklü görseller içeren basın kitimizi indirin.",
      pressButtonLabel: "Basın Kitini İndir",
      pressEmail: "press@mg.org.tr",
      pressPhone: "+90 000 000 00 00",
      bannerTitle: "Paylaşmak istediğiniz bir hikaye mi var?",
      bannerDescription: "Sizden haber almayı çok isteriz. MG yolculuğunuzu topluluğumuzla paylaşın.",
      bannerButtonLabel: "Bize Ulaşın",
      bannerButtonHref: "/contacts",
    },
  };
}

// ── Reports page ──────────────────────────────────────────────────────────────

export async function getReportsPageData(): Promise<ReportsPageData> {
  let reports: ReportListItem[] = [];
  let featuredTitle = "";
  let featuredDescription = "";
  let featuredDate = "";
  let featuredPages = 0;
  let featuredFormat = "PDF";

  try {
    const items = await getPublishedContentByType("policy");
    if (items.length > 0) {
      const featuredItem = items.find((i) => i.featured) ?? items[0];
      featuredTitle = featuredItem.title;
      featuredDescription = featuredItem.excerpt ?? "";
      featuredDate = new Date(firestoreTimestampToISO(featuredItem.publishedAt))
        .toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
      featuredPages = featuredItem.pages ?? 0;
      featuredFormat = featuredItem.format ?? "PDF";

      reports = items.map((item, i) => ({
        id: i + 1,
        title: item.title,
        summary: item.excerpt ?? "",
        date: new Date(firestoreTimestampToISO(item.publishedAt)).toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
        category: item.categoryId ?? "Genel",
        pages: item.pages ?? 0,
        format: item.format ?? "PDF",
      }));
    }
  } catch (err) {
    console.error("[publicContent] getReportsPageData Firestore error:", err);
  }

  if (reports.length === 0) {
    const featured = seedReports.find((r) => r.featured) ?? seedReports[0];
    featuredTitle = featured.title;
    featuredDescription = featured.excerpt;
    featuredDate = new Date(featured.publishedAt).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    featuredPages = featured.pages;
    featuredFormat = featured.format;

    reports = seedReports.map((r, i) => ({
      id: i + 1,
      title: r.title,
      summary: r.excerpt,
      date: new Date(r.publishedAt).toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
      category: r.categoryId,
      pages: r.pages,
      format: r.format,
    }));
  }

  return {
    hero: {
      breadcrumbCurrent: "Raporlar",
      title: "Raporlar ve Yayınlar",
      description:
        "Myasthenia Gravis hakkında kapsamlı araştırma raporlarına, tıbbi yayınlara ve indirilebilir kaynaklara erişin.",
    },
    featured: {
      sectionTitle: "Öne Çıkan Rapor",
      badgeLabel: "Yeni",
      category: "Yıllık Rapor",
      title: featuredTitle,
      description: featuredDescription,
      date: featuredDate,
      pagesLabel: `${featuredPages} Sayfa`,
      formatLabel: `${featuredFormat} Formatı`,
      downloadLabel: "Raporu İndir",
      readOnlineLabel: "Çevrim İçi Oku",
      coverCaption: featuredTitle,
    },
    listSectionTitle: "Tüm Raporlar",
    categories: ["Tümü", "Yıllık Raporlar", "Araştırma", "Tıbbi Kılavuzlar", "Topluluk"],
    reports,
    searchPlaceholder: "Raporlarda ara...",
    emptyStateText: "Kriterlerinize uygun rapor bulunamadı.",
    loadMoreLabel: "Daha Fazla Rapor",
  };
}

