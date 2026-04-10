/**
 * Canonical seed data for all Firestore collections.
 * Used by autoSeed.server.ts on startup and as fallback defaults.
 * All data is sourced from the original mock files in lib/.
 */

// ── Settings ──────────────────────────────────────────────────────────────────

export const seedSettings = {
  ngoName: "Miyastenia Gravis Vakfı",
  ngoLegalName: "Miyastenia Gravis Hastaları ve Yakınları Yardımlaşma Vakfı",
  websiteUrl: null,
  contactEmail: "info@MG.org.tr",
  contactPhone: "+90 000000000",
  addressText: "Orta Mahalle, Universite Caddesi No:27 Tuzla, 34956 Istanbul",
  logoAssetRef: null,
  primaryColor: null,
  secondaryColor: null,
  defaultSeoTitle: "Miyastenia Gravis Vakfı",
  defaultSeoDescription:
    "Miyastenia Gravis hastalığı hakkında bilgi, etkinlikler ve destek",
  defaultOgImageAssetRef: null,
  donationProviders: [],
  donationRedirectUrls: {},
  bankName: "Turkiye Is Bankasi",
  accountName: "MG Yasam Dernegi",
  iban: "TR00 0000 0000 0000 0000 0000 00",
  swiftCode: "ISBKTRIS",
  monthlyMessage: "Aylık bağış ile sürekli destek olabilirsiniz.",
};

// ── Categories ────────────────────────────────────────────────────────────────

export const seedCategories: Array<{ id: string; name: string; slug: string; description: string | null; parentCategoryRef: null }> = [
  { id: "genel",    name: "Genel",    slug: "genel",    description: null, parentCategoryRef: null },
  { id: "saglik",   name: "Sağlık",   slug: "saglik",   description: null, parentCategoryRef: null },
  { id: "topluluk", name: "Topluluk", slug: "topluluk", description: null, parentCategoryRef: null },
  { id: "etkinlik", name: "Etkinlik", slug: "etkinlik", description: null, parentCategoryRef: null },
  { id: "duyuru",   name: "Duyuru",   slug: "duyuru",   description: null, parentCategoryRef: null },
  { id: "destek",   name: "Destek",   slug: "destek",   description: null, parentCategoryRef: null },
];

// ── Tags ──────────────────────────────────────────────────────────────────────

export const seedTags: Array<{ id: string; name: string; slug: string }> = [
  { id: "mg",          name: "MG",          slug: "mg" },
  { id: "farkindalik", name: "Farkındalık", slug: "farkindalik" },
  { id: "tedavi",      name: "Tedavi",      slug: "tedavi" },
  { id: "etkinlik",    name: "Etkinlik",    slug: "etkinlik" },
];

// ── Content items — pages ─────────────────────────────────────────────────────

export const seedPages: Array<{
  id: string;
  type: "page";
  status: "published";
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  featured: boolean;
  // page-specific structured data stored as extra fields
  pageData: Record<string, unknown>;
}> = [
  {
    id: "anasayfa",
    type: "page",
    status: "published",
    title: "Myasthenia Gravis Farkındalık Ayı",
    slug: "anasayfa",
    excerpt:
      "Myasthenia Gravis ile yasayan milyonlarca insan icin farkindalik olusturma zamani. Dogru bilgiyi yaymayi ve dayanismayi guclendirmeyi hedefliyoruz.",
    bodyMarkdown: "",
    featured: false,
    pageData: {
      hero: {
        title: "Myasthenia Gravis Farkındalık Ayı",
        description:
          "Myasthenia Gravis ile yasayan milyonlarca insan icin farkindalik olusturma zamani. Dogru bilgiyi yaymayi ve dayanismayi guclendirmeyi hedefliyoruz.",
        ctaLabel: "Daha Fazla Bilgi",
        ctaHref: "/about",
      },
      about: {
        title: "Myasthenia Gravis Yasam Dernegi Nedir?",
        description:
          "MG hastalari ve yakinlarina yonelik farkindalik olusturmak, dogru bilgi saglamak ve destekleyici bir topluluk olusturmak amaciyla calisiyoruz.",
        ctaLabel: "Daha Fazla Bilgi",
        ctaHref: "/about",
      },
      quickLinks: [
        {
          title: "Raporlar ve Yayınlar",
          description:
            "Araştırma raporları, tıbbi kılavuzlar ve indirilebilir kaynaklara ulaşın.",
          href: "/reports",
        },
        {
          title: "Medya ve Haberler",
          description:
            "Güncel haberleri, etkinlikleri ve topluluk hikayelerini takip edin.",
          href: "/media",
        },
        {
          title: "Amacımıza Destek Olun",
          description:
            "Bağışlarınız MG topluluğuna yönelik çalışmalarımızı sürdürmemizi sağlar.",
          href: "/donate",
        },
      ],
    },
  },
  {
    id: "hakkimizda",
    type: "page",
    status: "published",
    title: "Hakkımızda",
    slug: "hakkimizda",
    excerpt:
      "Dernegimiz, MG ile yasayan bireylerin ve yakinlarinin yasam kalitesini artirmak, dogru bilgiye erisim saglamak ve guclu bir topluluk olusturmak icin calisir.",
    bodyMarkdown: "",
    featured: false,
    pageData: {
      title: "Hakkımızda",
      intro:
        "Dernegimiz, MG ile yasayan bireylerin ve yakinlarinin yasam kalitesini artirmak, dogru bilgiye erisim saglamak ve guclu bir topluluk olusturmak icin calisir.",
      vision: [
        "Hasta ve yakinlarinin her yerde guvenilir bilgiye erisebildigi bir topluluk olusturmak.",
        "Farkindalik ve erken tani bilincini toplum genelinde guclendirmek.",
      ],
      mission: [
        "Egitim, farkindalik ve destek programlari duzenlemek.",
        "Hastalar, yakinlar ve uzmanlar arasinda kopru kurmak.",
        "Kaynaklara erisimi kolaylastiracak topluluk aglari olusturmak.",
      ],
      team: [
        {
          name: "Person1",
          description:
            "Topluluk iletisimini ve hasta destek programlarini koordine eder.",
        },
        {
          name: "Person2",
          description:
            "Farkindalik kampanyalari ve gonullu sureclerinin yonetimini destekler.",
        },
      ],
    },
  },
  {
    id: "iletisim",
    type: "page",
    status: "published",
    title: "İletişim",
    slug: "iletisim",
    excerpt:
      "Sorulariniz, gonulluluk talepleriniz veya is birligi onerileriniz icin bizimle iletisime gecin.",
    bodyMarkdown: "",
    featured: false,
    pageData: {
      title: "İletişim",
      intro:
        "Sorulariniz, gonulluluk talepleriniz veya is birligi onerileriniz icin bizimle iletisime gecin.",
      faq: [
        {
          question: "MG topluluğunu nasıl destekleyebilirim?",
          answer:
            "Bağış yapabilir, gönüllü olabilir, etkinliklere katılabilir veya farkındalık çalışmalarına destek verebilirsiniz.",
        },
        {
          question: "Nasıl gönüllü olabilirim?",
          answer:
            "Web sitemizdeki gönüllü formunu doldurarak ya da doğrudan bizimle iletişime geçerek sürece katılabilirsiniz.",
        },
        {
          question: "Topluluk etkinliklerine nasıl katılabilirim?",
          answer:
            "Etkinlik takvimimizi takip ederek duyurulan kayıt adımlarıyla katılım sağlayabilirsiniz.",
        },
      ],
    },
  },
];

// ── Content items — blog posts ────────────────────────────────────────────────

export const seedBlogPosts: Array<{
  id: string;
  type: "post";
  status: "published" | "draft";
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  categoryId: string;
  authorName: string;
  publishedAt: string | null; // ISO date string; null for drafts
  featured: boolean;
  coverImageUrl: string | null;
}> = [
  {
    id: "blog-1",
    type: "post",
    status: "published",
    title: "MG İçin Yeni Tedavi Seçenekleri",
    slug: "mg-icin-yeni-tedavi-secenekleri",
    excerpt:
      "MG alanındaki güncel tedavi yaklaşımlarını özetleyen bilgilendirici içerik.",
    bodyMarkdown: [
      "Myasthenia Gravis belirtileri kisiden kisiye degisebilir. En yaygin belirtiler arasinda goz kapaginda dusme, cift gorme, cigneme ve yutma guclugu yer alir.",
      "Semptomlar gun icinde degisiklik gosterebilir ve yorgunlukla artabilir. Erken tani ve dogru takip, yasam kalitesini belirgin sekilde artirir.",
      "Dernegimiz bu surecte hastalarin ve yakinlarinin guvenilir bilgiye ulasmasi icin egitim ve destek calismalari yurutmektedir.",
    ].join("\n\n"),
    categoryId: "saglik",
    authorName: "Editor 1",
    publishedAt: "2023-01-01",
    featured: true,
    coverImageUrl:
      "https://images.unsplash.com/photo-1576765607924-b18f0c4f4f77?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "blog-2",
    type: "post",
    status: "published",
    title: "Yıllık Bağış Kampanyası Öne Çıkanlar",
    slug: "yillik-bagis-kampanyasi-one-cikanlar",
    excerpt: "Yıllık bağış kampanyasında öne çıkan gelişmeler ve sonuçlar.",
    bodyMarkdown: [
      "Yillik bagis kampanyamizda elde edilen katkiyla daha fazla hastaya ulasilmasi, yeni egitim iceriklerinin hazirlanmasi ve yerel etkinliklerin guclendirilmesi hedeflenmistir.",
      "Toplanan kaynaklarin seffaf bir sekilde raporlanmasi, bagiscilarimizin surece duydugu guveni artirmaktadir.",
      "Onumuzdeki donemde odagimiz, hasta destek gruplarini farkli sehirlere yaymak ve gonullu agini guclendirmek olacak.",
    ].join("\n\n"),
    categoryId: "topluluk",
    authorName: "Editor 1",
    publishedAt: "2023-01-01",
    featured: false,
    coverImageUrl:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "blog-3",
    type: "post",
    status: "published",
    title: "İstanbul'da MG Farkındalık Etkinliği",
    slug: "istanbul-da-mg-farkindalik-etkinligi",
    excerpt: "İstanbul'da düzenlenen farkındalık etkinliğine dair kısa özet.",
    bodyMarkdown: [
      "Istanbul'da duzenlenen farkindalik etkinligimizde hekimler, hastalar, hasta yakinlari ve gonulluler bir araya geldi.",
      "Program kapsaminda erken tani, guncel tedavi secenekleri ve sosyal destek mekanizmalari uzerine oturumlar gerceklestirildi.",
      "Bu bulusmalar, toplumsal farkindaligi artirmanin yani sira hastalarin yalniz olmadigini gosteren guclu bir dayanisma ortami olusturuyor.",
    ].join("\n\n"),
    categoryId: "etkinlik",
    authorName: "Editor 1",
    publishedAt: "2023-01-01",
    featured: false,
    coverImageUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "blog-4",
    type: "post",
    status: "draft",
    title: "Yeni Gönüllü Programı Duyurusu",
    slug: "yeni-gonullu-programi-duyurusu",
    excerpt: "Yeni gönüllü programı için hazırlanan taslak gönderi.",
    bodyMarkdown: "",
    categoryId: "duyuru",
    authorName: "Editor 1",
    publishedAt: null,
    featured: false,
    coverImageUrl: null,
  },
  {
    id: "blog-5",
    type: "post",
    status: "draft",
    title: "Hasta Destek Rehberi Taslağı",
    slug: "hasta-destek-rehberi-taslagi",
    excerpt: "Hasta ve yakınları için hazırlanan destek rehberi taslağı.",
    bodyMarkdown: "",
    categoryId: "destek",
    authorName: "Editor 1",
    publishedAt: null,
    featured: false,
    coverImageUrl: null,
  },
];

// ── Content items — reports (policy type) ────────────────────────────────────

export const seedReports: Array<{
  id: string;
  type: "policy";
  status: "published";
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  categoryId: string;
  publishedAt: string;
  featured: boolean;
  pages: number;
  format: string;
}> = [
  {
    id: "report-annual-2024",
    type: "policy",
    status: "published",
    title: "Myasthenia Gravis Yaşam Derneği 2024 Yıllık Raporu",
    slug: "mg-yasam-dernegi-2024-yillik-raporu",
    excerpt:
      "Yıllık raporumuz; topluluk girişimlerini, araştırma ortaklıklarını, farkındalık kampanyalarını ve birlikte oluşturduğumuz etkiyi kapsar.",
    bodyMarkdown: "",
    categoryId: "yillik-raporlar",
    publishedAt: "2025-01-01",
    featured: true,
    pages: 48,
    format: "PDF",
  },
  {
    id: "report-patient-guide-2024",
    type: "policy",
    status: "published",
    title: "Myasthenia Gravis'i Anlamak: Hasta Rehberi",
    slug: "myasthenia-gravisi-anlamak-hasta-rehberi",
    excerpt:
      "Tedavi seçenekleri ve günlük yönetim stratejileri dahil olmak üzere MG ile yaşam hakkında hastalar ve aileler için kapsamlı bir rehber.",
    bodyMarkdown: "",
    categoryId: "tibbi-klavuzlar",
    publishedAt: "2024-12-01",
    featured: false,
    pages: 32,
    format: "PDF",
  },
  {
    id: "report-research-2024",
    type: "policy",
    status: "published",
    title: "2024 Araştırma Ortaklıkları Özeti",
    slug: "2024-arastirma-ortakliklari-ozeti",
    excerpt:
      "Türkiye genelindeki önde gelen nöroloji kurumlarıyla yürüttüğümüz ortak araştırma girişimlerinin özeti.",
    bodyMarkdown: "",
    categoryId: "arastirma",
    publishedAt: "2024-11-01",
    featured: false,
    pages: 24,
    format: "PDF",
  },
  {
    id: "report-community-q3-2024",
    type: "policy",
    status: "published",
    title: "Topluluk Etki Raporu 2024 3. Çeyrek",
    slug: "topluluk-etki-raporu-2024-3-ceyrek",
    excerpt:
      "Topluluk etkinlikleri, destek grubu faaliyetleri ve hasta erişim programlarına dair çeyreklik rapor.",
    bodyMarkdown: "",
    categoryId: "topluluk",
    publishedAt: "2024-10-01",
    featured: false,
    pages: 18,
    format: "PDF",
  },
  {
    id: "report-campaign-2024",
    type: "policy",
    status: "published",
    title: "MG Farkındalık Ayı Kampanya Sonuçları",
    slug: "mg-farkindalik-ayi-kampanya-sonuclari",
    excerpt:
      "Farkındalık kampanyamızın erişim, etkileşim ve temel çıktılar açısından analizi.",
    bodyMarkdown: "",
    categoryId: "topluluk",
    publishedAt: "2024-08-01",
    featured: false,
    pages: 16,
    format: "PDF",
  },
  {
    id: "report-treatment-2024",
    type: "policy",
    status: "published",
    title: "Myasthenia Gravis Tedavisinde 2024 Gelişmeleri",
    slug: "myasthenia-gravis-tedavisinde-2024-gelismeleri",
    excerpt:
      "Yeni tedaviler ve klinik çalışma sonuçları dahil MG tedavi seçeneklerindeki en güncel gelişmeler.",
    bodyMarkdown: "",
    categoryId: "arastirma",
    publishedAt: "2024-07-01",
    featured: false,
    pages: 28,
    format: "PDF",
  },
  {
    id: "report-annual-2023",
    type: "policy",
    status: "published",
    title: "Yıllık Rapor 2023",
    slug: "yillik-rapor-2023",
    excerpt:
      "Kurumsal faaliyetleri, mali özeti ve stratejik hedefleri kapsayan kapsamlı yıllık rapor.",
    bodyMarkdown: "",
    categoryId: "yillik-raporlar",
    publishedAt: "2024-01-01",
    featured: false,
    pages: 52,
    format: "PDF",
  },
];

// ── Events ─────────────────────────────────────────────────────────────────────

export const seedEvents: Array<{
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  startsAt: string; // ISO date string
  endsAt: string | null;
  isOnline: boolean;
  onlineUrl: string | null;
  locationName: string;
  city: string;
  venue: string;
  eventType: string;
  capacity: number;
}> = [
  {
    id: "event-1",
    title: "İstanbul MG Farkındalık Etkinliği",
    slug: "istanbul-mg-farkindalik-etkinligi",
    status: "published",
    startsAt: "2026-05-05T10:00:00",
    endsAt: "2026-05-05T18:00:00",
    isOnline: false,
    onlineUrl: null,
    locationName: "İstanbul Toplum Merkezi",
    city: "İstanbul",
    venue: "Toplum Merkezi",
    eventType: "Farkındalık",
    capacity: 120,
  },
  {
    id: "event-2",
    title: "İzmir MG Farkındalık Etkinliği",
    slug: "izmir-mg-farkindalik-etkinligi",
    status: "published",
    startsAt: "2026-07-17T10:00:00",
    endsAt: "2026-07-17T18:00:00",
    isOnline: false,
    onlineUrl: null,
    locationName: "İzmir Toplum Merkezi",
    city: "İzmir",
    venue: "Toplum Merkezi",
    eventType: "Webinar",
    capacity: 90,
  },
  {
    id: "event-3",
    title: "Ankara Destek Grubu Toplantısı",
    slug: "ankara-destek-grubu-toplantisi",
    status: "published",
    startsAt: "2026-08-19T10:00:00",
    endsAt: "2026-08-19T14:00:00",
    isOnline: false,
    onlineUrl: null,
    locationName: "Ankara Toplum Merkezi",
    city: "Ankara",
    venue: "Toplum Merkezi",
    eventType: "Destek Grubu",
    capacity: 60,
  },
  {
    id: "event-4",
    title: "Hasta Hakları Webinarı",
    slug: "hasta-haklari-webinari",
    status: "published",
    startsAt: "2026-09-10T14:00:00",
    endsAt: "2026-09-10T16:00:00",
    isOnline: true,
    onlineUrl: null,
    locationName: "Online",
    city: "Online",
    venue: "Zoom",
    eventType: "Webinar",
    capacity: 200,
  },
];

// ── Media assets ──────────────────────────────────────────────────────────────

export const seedMediaAssets: Array<{
  id: string;
  kind: "image";
  visibility: "public" | "private";
  originalFilename: string;
  mimeType: string;
  byteSize: number;
  checksumSha256: null;
  storageBucket: string;
  storagePath: string;
  downloadUrl: string;
  width: null;
  height: null;
  altText: string;
  description: string;
  tags: string[];
  featured: boolean;
  pageKey: string;
}> = [
  {
    id: "media-1",
    kind: "image",
    visibility: "public",
    originalFilename: "home-slider-1.jpg",
    mimeType: "image/jpeg",
    byteSize: 0,
    checksumSha256: null,
    storageBucket: "",
    storagePath: "",
    downloadUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
    width: null,
    height: null,
    altText: "Ana Sayfa Slider 1",
    description: "Ana sayfada kullanılan slider görseli.",
    tags: ["slider", "anasayfa"],
    featured: true,
    pageKey: "home-slider",
  },
  {
    id: "media-2",
    kind: "image",
    visibility: "public",
    originalFilename: "about-gallery-1.jpg",
    mimeType: "image/jpeg",
    byteSize: 0,
    checksumSha256: null,
    storageBucket: "",
    storagePath: "",
    downloadUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop",
    width: null,
    height: null,
    altText: "Hakkımızda Galerisi 1",
    description: "Destek çalışmaları görseli.",
    tags: ["hakkımızda"],
    featured: false,
    pageKey: "about-gallery",
  },
  {
    id: "media-3",
    kind: "image",
    visibility: "public",
    originalFilename: "blog-gallery-1.jpg",
    mimeType: "image/jpeg",
    byteSize: 0,
    checksumSha256: null,
    storageBucket: "",
    storagePath: "",
    downloadUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop",
    width: null,
    height: null,
    altText: "Blog Galerisi 1",
    description: "Blog detay görseli.",
    tags: ["blog"],
    featured: false,
    pageKey: "blog-gallery",
  },
  {
    id: "media-4",
    kind: "image",
    visibility: "public",
    originalFilename: "awareness-walk-2024.jpg",
    mimeType: "image/jpeg",
    byteSize: 0,
    checksumSha256: null,
    storageBucket: "",
    storagePath: "",
    downloadUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    width: null,
    height: null,
    altText: "MG Farkındalık Ayı Yürüyüşü 2024",
    description: "MG Farkındalık Ayı Yürüyüşü 2024",
    tags: ["galeri", "farkindalik"],
    featured: true,
    pageKey: "media-gallery",
  },
  {
    id: "media-5",
    kind: "image",
    visibility: "public",
    originalFilename: "conference-2024.jpg",
    mimeType: "image/jpeg",
    byteSize: 0,
    checksumSha256: null,
    storageBucket: "",
    storagePath: "",
    downloadUrl:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1200&auto=format&fit=crop",
    width: null,
    height: null,
    altText: "Yıllık Konferans 2024",
    description: "Yıllık Konferans 2024",
    tags: ["galeri", "konferans"],
    featured: false,
    pageKey: "media-gallery",
  },
];

// ── Campaigns ─────────────────────────────────────────────────────────────────

export const seedCampaigns: Array<{
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  status: "active";
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  imageUrl: string;
  startsAt: null;
  endsAt: null;
  coverAssetRef: null;
}> = [
  {
    id: "campaign-1",
    title: "Gorunmeyen Yorgunlukla Mucadele",
    slug: "gorunmeyen-yorgunlukla-mucadele",
    subtitle: "Gorunmeyeni gor",
    description:
      "Psikososyal destek gruplari ile hastalarin yasam kalitesini guclendirmeyi hedefliyoruz.",
    status: "active",
    goalAmount: 25000,
    raisedAmount: 14250,
    currency: "TRY",
    imageUrl:
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1200&auto=format&fit=crop",
    startsAt: null,
    endsAt: null,
    coverAssetRef: null,
  },
  {
    id: "campaign-2",
    title: "Tedaviye Erisim Icin Destek",
    slug: "tedaviye-erisim-icin-destek",
    subtitle: "Boslugu kapat",
    description:
      "Ilac ve tedavi sureclerinde ihtiyac duyan ailelere yonelik destek fonu olusturuyoruz.",
    status: "active",
    goalAmount: 20000,
    raisedAmount: 9800,
    currency: "TRY",
    imageUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop",
    startsAt: null,
    endsAt: null,
    coverAssetRef: null,
  },
  {
    id: "campaign-3",
    title: "Bir Nefese Bir Umut",
    slug: "bir-nefese-bir-umut",
    subtitle: "Bir nefese bir umut",
    description:
      "MG hastalari icin uzman destegi, egitim ve topluluk bulusmalarina katki sagliyoruz.",
    status: "active",
    goalAmount: 15000,
    raisedAmount: 5210,
    currency: "TRY",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    startsAt: null,
    endsAt: null,
    coverAssetRef: null,
  },
];

// ── Announcements ─────────────────────────────────────────────────────────────

export const seedAnnouncements: Array<{
  id: string;
  title: string;
  content: string;
  audience: "all" | "members" | "volunteers" | "patients";
  publishedAt: string;
  status: "published" | "draft";
  pinned: boolean;
}> = [
  {
    id: "announcement-1",
    title: "Nisan Ayı Destek Toplantısı Duyurusu",
    content: "Nisan ayı destek toplantımız bu hafta sonu gerçekleştirilecektir.",
    audience: "all",
    publishedAt: "2026-04-08",
    status: "published",
    pinned: true,
  },
  {
    id: "announcement-2",
    title: "Gönüllü Eğitim Programı",
    content:
      "Yeni gönüllüler için eğitim programı kayıtları açılmıştır.",
    audience: "volunteers",
    publishedAt: "2026-04-10",
    status: "published",
    pinned: false,
  },
  {
    id: "announcement-3",
    title: "Üyelik Yenileme Hatırlatması",
    content:
      "Dernek üyelik yenileme süreci bu ay sonunda tamamlanacaktır.",
    audience: "members",
    publishedAt: "2026-04-12",
    status: "draft",
    pinned: false,
  },
];
