import { mockBlogs } from "@/lib/editorPanelMockData";

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

function slugify(value: string) {
  return value
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const blogCoverById: Record<string, string> = {
  "blog-1":
    "https://images.unsplash.com/photo-1576765607924-b18f0c4f4f77?q=80&w=1400&auto=format&fit=crop",
  "blog-2":
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1400&auto=format&fit=crop",
  "blog-3":
    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1400&auto=format&fit=crop",
};

const blogBodyById: Record<string, string[]> = {
  "blog-1": [
    "Myasthenia Gravis belirtileri kisiden kisiye degisebilir. En yaygin belirtiler arasinda goz kapaginda dusme, cift gorme, cigneme ve yutma guclugu yer alir.",
    "Semptomlar gun icinde degisiklik gosterebilir ve yorgunlukla artabilir. Erken tani ve dogru takip, yasam kalitesini belirgin sekilde artirir.",
    "Dernegimiz bu surecte hastalarin ve yakinlarinin guvenilir bilgiye ulasmasi icin egitim ve destek calismalari yurutmektedir.",
  ],
  "blog-2": [
    "Yillik bagis kampanyamizda elde edilen katkiyla daha fazla hastaya ulasilmasi, yeni egitim iceriklerinin hazirlanmasi ve yerel etkinliklerin guclendirilmesi hedeflenmistir.",
    "Toplanan kaynaklarin seffaf bir sekilde raporlanmasi, bagiscilarimizin surece duydugu guveni artirmaktadir.",
    "Onumuzdeki donemde odagimiz, hasta destek gruplarini farkli sehirlere yaymak ve gonullu agini guclendirmek olacak.",
  ],
  "blog-3": [
    "Istanbul'da duzenlenen farkindalik etkinligimizde hekimler, hastalar, hasta yakinlari ve gonulluler bir araya geldi.",
    "Program kapsaminda erken tani, guncel tedavi secenekleri ve sosyal destek mekanizmalari uzerine oturumlar gerceklestirildi.",
    "Bu bulusmalar, toplumsal farkindaligi artirmanin yani sira hastalarin yalniz olmadigini gosteren guclu bir dayanisma ortami olusturuyor.",
  ],
};

export async function getPublishedBlogs(): Promise<PublicBlogPost[]> {
  const publishedBlogs = mockBlogs
    .filter((item) => item.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((item) => ({
      id: item.id,
      slug: slugify(item.title),
      title: item.title,
      excerpt: item.summary,
      publishedAt: item.publishedAt,
      coverImage:
        blogCoverById[item.id] ||
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1400&auto=format&fit=crop",
      content: blogBodyById[item.id] || [item.summary],
    }));

  return Promise.resolve(publishedBlogs);
}

export async function getBlogBySlug(
  slug: string
): Promise<PublicBlogPost | null> {
  const blogs = await getPublishedBlogs();
  return blogs.find((blog) => blog.slug === slug) || null;
}

export async function getDonationPageData(): Promise<DonationPageData> {
  return Promise.resolve({
    title: "Myasthenia Gravis Topluluğunu Destekleyin",
    subtitle:
      "Yapacaginiz bagislar; farkindalik calismalarina ve MG ile yasayan hastalara destek olmamiza yardimci olur.",
    bankName: "Turkiye Is Bankasi",
    accountName: "MG Yasam Dernegi",
    iban: "TR00 0000 0000 0000 0000 0000 00",
    swiftCode: "ISBKTRIS",
    monthlyMessage: "Aylık bağış ile sürekli destek olabilirsiniz.",
    campaigns: [
      {
        id: "campaign-1",
        title: "Gorunmeyen Yorgunlukla Mucadele",
        subtitle: "Gorunmeyeni gor",
        description:
          "Psikososyal destek gruplari ile hastalarin yasam kalitesini guclendirmeyi hedefliyoruz.",
        imageUrl:
          "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1200&auto=format&fit=crop",
        currentAmount: 14250,
        targetAmount: 25000,
      },
      {
        id: "campaign-2",
        title: "Tedaviye Erisim Icin Destek",
        subtitle: "Boslugu kapat",
        description:
          "Ilac ve tedavi sureclerinde ihtiyac duyan ailelere yonelik destek fonu olusturuyoruz.",
        imageUrl:
          "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop",
        currentAmount: 9800,
        targetAmount: 20000,
      },
      {
        id: "campaign-3",
        title: "Bir Nefese Bir Umut",
        subtitle: "Bir nefese bir umut",
        description:
          "MG hastalari icin uzman destegi, egitim ve topluluk bulusmalarina katki sagliyoruz.",
        imageUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
        currentAmount: 5210,
        targetAmount: 15000,
      },
    ],
  });
}

export async function getMediaPageData(): Promise<MediaPageData> {
  return Promise.resolve({
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
      {
        id: 1,
        title: "İstanbul'da Yeni Tedavi Merkezi Açıldı",
        excerpt:
          "Sabancı Üniversitesi Hastanesi bünyesinde kapsamlı bakım sunan yeni bir MG tedavi merkezi hizmete girdi.",
        date: "8 Mart 2025",
        category: "Haber",
        imageClass: "bg-gradient-to-br from-blue-400 to-blue-600",
        readTime: "3 dk okuma",
      },
      {
        id: 2,
        title: "2025 Bahar Topluluk Buluşması",
        excerpt:
          "Hastaları, yakınlarını ve sağlık profesyonellerini bir araya getiren yıllık bahar buluşmamıza katılın.",
        date: "5 Mart 2025",
        category: "Etkinlik",
        imageClass: "bg-gradient-to-br from-green-400 to-green-600",
        readTime: "2 dk okuma",
      },
      {
        id: 3,
        title: "Avrupa MG Vakfı ile Ortaklık",
        excerpt:
          "Avrupa genelinde araştırma iş birliklerini genişletmek için yeni ortaklığımızı duyurmaktan mutluluk duyuyoruz.",
        date: "28 Şubat 2025",
        category: "Basın",
        imageClass: "bg-gradient-to-br from-purple-400 to-purple-600",
        readTime: "4 dk okuma",
      },
      {
        id: 4,
        title: "Güncellenmiş Hasta Kaynakları Yayında",
        excerpt:
          "Hastalar ve bakım verenler için Türkçe indirilebilir yeni rehberler ve kaynaklar erişime açıldı.",
        date: "20 Şubat 2025",
        category: "Duyuru",
        imageClass: "bg-gradient-to-br from-orange-400 to-orange-600",
        readTime: "2 dk okuma",
      },
      {
        id: 5,
        title: "Dr. Ayşe Yılmaz Danışma Kuruluna Katıldı",
        excerpt:
          "Nöroloji alanında uzman Dr. Ayşe Yılmaz, yıllara dayanan MG deneyimiyle tıbbi danışma kurulumuza katıldı.",
        date: "15 Şubat 2025",
        category: "Haber",
        imageClass: "bg-gradient-to-br from-teal-400 to-teal-600",
        readTime: "3 dk okuma",
      },
      {
        id: 6,
        title: "Gönüllü Eğitim Programı Başladı",
        excerpt:
          "Nisan ayında başlayacak kapsamlı gönüllü eğitim programımız için başvurular açıldı.",
        date: "10 Şubat 2025",
        category: "Duyuru",
        imageClass: "bg-gradient-to-br from-pink-400 to-pink-600",
        readTime: "2 dk okuma",
      },
    ],
    loadMoreLabel: "Daha Fazla",
    gallery: {
      title: "Fotoğraf Galerisi",
      viewAllLabel: "Tüm Fotoğrafları Gör",
      images: [
        {
          id: 1,
          title: "MG Farkındalık Ayı Yürüyüşü 2024",
          colorClass: "bg-gradient-to-br from-teal-400 to-teal-600",
        },
        {
          id: 2,
          title: "Yıllık Konferans 2024",
          colorClass: "bg-gradient-to-br from-blue-400 to-blue-600",
        },
        {
          id: 3,
          title: "Topluluk Destek Toplantısı",
          colorClass: "bg-gradient-to-br from-green-400 to-green-600",
        },
        {
          id: 4,
          title: "Gönüllü Takdir Etkinliği",
          colorClass: "bg-gradient-to-br from-purple-400 to-purple-600",
        },
        {
          id: 5,
          title: "Tıbbi Sempozyum 2024",
          colorClass: "bg-gradient-to-br from-orange-400 to-orange-600",
        },
        {
          id: 6,
          title: "Hasta Savunuculuğu Atölyesi",
          colorClass: "bg-gradient-to-br from-pink-400 to-pink-600",
        },
        {
          id: 7,
          title: "Dünya MG Günü Kutlaması",
          colorClass: "bg-gradient-to-br from-cyan-400 to-cyan-600",
        },
        {
          id: 8,
          title: "Araştırma Ortaklığı İmza Töreni",
          colorClass: "bg-gradient-to-br from-indigo-400 to-indigo-600",
        },
      ],
    },
    cta: {
      newsletterTitle: "Güncel Kalın",
      newsletterDescription:
        "En güncel haberleri, etkinlik duyurularını ve kaynakları doğrudan e-posta kutunuza almak için bültenimize abone olun.",
      newsletterInputPlaceholder: "E-posta adresinizi girin",
      newsletterButtonLabel: "Bültene Abone Ol",
      newsletterNote:
        "Abone olarak tarafımızdan e-posta almayı kabul etmiş olursunuz. İstediğiniz zaman abonelikten çıkabilirsiniz.",
      pressTitle: "Basın ve Medya Kiti",
      pressDescription:
        "Medya kullanımı için logolar, marka kılavuzu, bilgi notları ve yüksek çözünürlüklü görseller içeren basın kitimizi indirin.",
      pressButtonLabel: "Basın Kitini İndir",
      pressEmail: "press@mg.org.tr",
      pressPhone: "+90 000 000 00 00",
      bannerTitle: "Paylaşmak istediğiniz bir hikaye mi var?",
      bannerDescription:
        "Sizden haber almayı çok isteriz. MG yolculuğunuzu topluluğumuzla paylaşın.",
      bannerButtonLabel: "Bize Ulaşın",
      bannerButtonHref: "/contacts",
    },
  });
}

export async function getReportsPageData(): Promise<ReportsPageData> {
  return Promise.resolve({
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
      title: "Myasthenia Gravis Yaşam Derneği 2024 Yıllık Raporu",
      description:
        "Yıllık raporumuz; topluluk girişimlerini, araştırma ortaklıklarını, farkındalık kampanyalarını ve birlikte oluşturduğumuz etkiyi kapsar.",
      date: "Ocak 2025",
      pagesLabel: "48 Sayfa",
      formatLabel: "PDF Formatı",
      downloadLabel: "Raporu İndir",
      readOnlineLabel: "Çevrim İçi Oku",
      coverCaption: "Yıllık Rapor 2024",
    },
    listSectionTitle: "Tüm Raporlar",
    categories: [
      "Tümü",
      "Yıllık Raporlar",
      "Araştırma",
      "Tıbbi Kılavuzlar",
      "Topluluk",
    ],
    reports: [
      {
        id: 1,
        title: "Myasthenia Gravis'i Anlamak: Hasta Rehberi",
        summary:
          "Tedavi seçenekleri ve günlük yönetim stratejileri dahil olmak üzere MG ile yaşam hakkında hastalar ve aileler için kapsamlı bir rehber.",
        date: "Aralık 2024",
        category: "Tıbbi Kılavuzlar",
        pages: 32,
        format: "PDF",
      },
      {
        id: 2,
        title: "2024 Araştırma Ortaklıkları Özeti",
        summary:
          "Türkiye genelindeki önde gelen nöroloji kurumlarıyla yürüttüğümüz ortak araştırma girişimlerinin özeti.",
        date: "Kasım 2024",
        category: "Araştırma",
        pages: 24,
        format: "PDF",
      },
      {
        id: 3,
        title: "Topluluk Etki Raporu 2024 3. Çeyrek",
        summary:
          "Topluluk etkinlikleri, destek grubu faaliyetleri ve hasta erişim programlarına dair çeyreklik rapor.",
        date: "Ekim 2024",
        category: "Topluluk",
        pages: 18,
        format: "PDF",
      },
      {
        id: 4,
        title: "MG Farkındalık Ayı Kampanya Sonuçları",
        summary:
          "Farkındalık kampanyamızın erişim, etkileşim ve temel çıktılar açısından analizi.",
        date: "Ağustos 2024",
        category: "Topluluk",
        pages: 16,
        format: "PDF",
      },
      {
        id: 5,
        title: "Myasthenia Gravis Tedavisinde 2024 Gelişmeleri",
        summary:
          "Yeni tedaviler ve klinik çalışma sonuçları dahil MG tedavi seçeneklerindeki en güncel gelişmeler.",
        date: "Temmuz 2024",
        category: "Araştırma",
        pages: 28,
        format: "PDF",
      },
      {
        id: 6,
        title: "Yıllık Rapor 2023",
        summary:
          "Kurumsal faaliyetleri, mali özeti ve stratejik hedefleri kapsayan kapsamlı yıllık rapor.",
        date: "Ocak 2024",
        category: "Yıllık Raporlar",
        pages: 52,
        format: "PDF",
      },
    ],
    searchPlaceholder: "Raporlarda ara...",
    emptyStateText: "Kriterlerinize uygun rapor bulunamadı.",
    loadMoreLabel: "Daha Fazla Rapor",
  });
}
