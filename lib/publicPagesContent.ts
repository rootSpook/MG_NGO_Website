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

export const homePageTemplate: HomePageData = {
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
};

export const aboutPageTemplate: AboutPageData = {
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
};

export const contactPageTemplate: ContactPageData = {
  title: "İletişim",
  intro:
    "Sorulariniz, gonulluluk talepleriniz veya is birligi onerileriniz icin bizimle iletisime gecin.",
  email: "info@MG.org.tr",
  phone: "+90 000000000",
  location: "Orta Mahalle, Universite Caddesi No:27 Tuzla, 34956 Istanbul",
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
};

export async function getHomePageData(): Promise<HomePageData> {
  return Promise.resolve(homePageTemplate);
}

export async function getAboutPageData(): Promise<AboutPageData> {
  return Promise.resolve(aboutPageTemplate);
}

export async function getContactPageData(): Promise<ContactPageData> {
  return Promise.resolve(contactPageTemplate);
}
