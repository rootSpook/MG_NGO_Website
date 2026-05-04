export type EditablePageKey =
  | "bloglar"
  | "etkinlikler"
  | "raporlar"
  | "medya"
  | "iletisim"
  | "bagis"
  | "mg"
  | "hakkimizda";

export interface EditableFieldConfig {
  name: string;
  label: string;
  type?: "text" | "textarea";
}

export interface EditablePageConfig {
  title: string;
  fields: EditableFieldConfig[];
  defaults: Record<string, string>;
}

export const EDITABLE_PAGE_CONFIGS: Record<EditablePageKey, EditablePageConfig> = {
  hakkimizda: {
    title: "Hakkımızda",
    fields: [
      { name: "title", label: "Sayfa Başlığı" },
      { name: "intro", label: "Giriş Metni", type: "textarea" },
      { name: "vision", label: "Vizyon Maddeleri", type: "textarea" },
      { name: "mission", label: "Misyon Maddeleri", type: "textarea" },
    ],
    defaults: {
      title: "Hakkımızda",
      intro:
        "Derneğimiz, MG ile yaşayan bireylerin ve yakınlarının yaşam kalitesini artırmak, doğru bilgiye erişim sağlamak ve güçlü bir topluluk oluşturmak için çalışır.",
      vision:
        "Hasta ve yakınlarının her yerde güvenilir bilgiye erişebildiği bir topluluk oluşturmak.\nFarkındalık ve erken tanı bilincini toplum genelinde güçlendirmek.",
      mission:
        "Eğitim, farkındalık ve destek programları düzenlemek.\nHastalar, yakınlar ve uzmanlar arasında köprü kurmak.\nKaynaklara erişimi kolaylaştıracak topluluk ağları oluşturmak.",
    },
  },
  mg: {
    title: "MG Hakkında",
    fields: [
      { name: "heroTitle", label: "Hero Başlığı" },
      { name: "heroDescription", label: "Hero Açıklaması", type: "textarea" },
    ],
    defaults: {
      heroTitle: "Myasthenia Gravis",
      heroDescription:
        "Hastalık hakkında bilmeniz gereken her şey - belirtilerden tedaviye, günlük yaşam ipuçlarına kadar.",
    },
  },
  bloglar: {
    title: "Bloglar",
    fields: [
      { name: "title", label: "Sayfa Başlığı" },
      { name: "emptyText", label: "Boş Liste Mesajı", type: "textarea" },
    ],
    defaults: {
      title: "Bloglar",
      emptyText: "Henüz yayınlanmış blog bulunmuyor.",
    },
  },
  etkinlikler: {
    title: "Etkinlikler",
    fields: [
      { name: "heroTitle", label: "Hero Başlığı" },
      { name: "heroDescription", label: "Hero Açıklaması", type: "textarea" },
      { name: "upcomingTitle", label: "Yaklaşan Etkinlikler Başlığı" },
      { name: "pastTitle", label: "Geçmiş Etkinlikler Başlığı" },
      { name: "emptyText", label: "Boş Liste Mesajı", type: "textarea" },
    ],
    defaults: {
      heroTitle: "Etkinlikler",
      heroDescription: "Toplantılar, webinarlar ve destek grubu buluşmalarımıza katılın.",
      upcomingTitle: "Yaklaşan Etkinlikler",
      pastTitle: "Geçmiş Etkinlikler",
      emptyText: "Şu anda planlanmış etkinlik bulunmuyor.",
    },
  },
  raporlar: {
    title: "Raporlar",
    fields: [
      { name: "heroTitle", label: "Hero Başlığı" },
      { name: "heroDescription", label: "Hero Açıklaması", type: "textarea" },
      { name: "listSectionTitle", label: "Liste Başlığı" },
      { name: "emptyStateText", label: "Boş Liste Mesajı", type: "textarea" },
    ],
    defaults: {
      heroTitle: "Raporlar ve Yayınlar",
      heroDescription:
        "Myasthenia Gravis hakkında kapsamlı araştırma raporlarına, tıbbi yayınlara ve indirilebilir kaynaklara erişin.",
      listSectionTitle: "Tüm Raporlar",
      emptyStateText: "Kriterlerinize uygun rapor bulunamadı.",
    },
  },
  medya: {
    title: "Medya",
    fields: [
      { name: "heroTitle", label: "Hero Başlığı" },
      { name: "heroDescription", label: "Hero Açıklaması", type: "textarea" },
      { name: "featuredTitle", label: "Öne Çıkan Başlık" },
      { name: "featuredDescription", label: "Öne Çıkan Açıklama", type: "textarea" },
      { name: "listSectionTitle", label: "Liste Başlığı" },
      { name: "galleryTitle", label: "Galeri Başlığı" },
      { name: "bannerTitle", label: "Alt Çağrı Başlığı" },
      { name: "bannerDescription", label: "Alt Çağrı Açıklaması", type: "textarea" },
    ],
    defaults: {
      heroTitle: "Medya ve Haberler",
      heroDescription:
        "Myasthenia Gravis topluluğundan en güncel haberleri, etkinlikleri ve medya içeriklerini takip edin. Galeri, basın materyalleri ve duyurulara buradan ulaşın.",
      featuredTitle: "MG Farkındalık Ayı 2025: Birlikte Daha Güçlüyüz",
      featuredDescription:
        "Haziran ayı Myasthenia Gravis Farkındalık Ayı. Bu yıl şimdiye kadarki en kapsamlı kampanyamızı başlatıyoruz.",
      listSectionTitle: "Son Güncellemeler",
      galleryTitle: "Fotoğraf Galerisi",
      bannerTitle: "Paylaşmak istediğiniz bir hikaye mi var?",
      bannerDescription: "Sizden haber almayı çok isteriz. MG yolculuğunuzu topluluğumuzla paylaşın.",
    },
  },
  iletisim: {
    title: "İletişim",
    fields: [
      { name: "title", label: "Sayfa Başlığı" },
      { name: "intro", label: "Giriş Metni", type: "textarea" },
      { name: "contactEmail", label: "E-posta Adresi" },
      { name: "contactPhone", label: "Telefon Numarası" },
      { name: "addressText", label: "Adres", type: "textarea" },
      { name: "locationTitle", label: "Konum Başlığı" },
      { name: "locationIntro", label: "Konum Açıklaması", type: "textarea" },
      { name: "faqTitle", label: "SSS Başlığı" },
    ],
    defaults: {
      title: "İletişim",
      intro: "Sorularınız, gönüllülük talepleriniz veya iş birliği önerileriniz için bizimle iletişime geçin.",
      contactEmail: "info@mgfoundation.org",
      contactPhone: "+90 000000000",
      addressText: "İstanbul, Türkiye",
      locationTitle: "Konumumuz",
      locationIntro:
        "Derneğimiz, MG topluluğunu etkinlikler, kaynaklar ve destek programlarıyla bir araya getirir.",
      faqTitle: "Sık Sorulan Sorular",
    },
  },
  bagis: {
    title: "Bağış Yap",
    fields: [
      { name: "title", label: "Hero Başlığı", type: "textarea" },
      { name: "subtitle", label: "Hero Açıklaması", type: "textarea" },
      { name: "bankTransferTitle", label: "Banka Havalesi Başlığı" },
      { name: "bankTransferDescription", label: "Banka Havalesi Açıklaması", type: "textarea" },
      { name: "campaignsTitle", label: "Kampanyalar Başlığı" },
      { name: "impactTitle", label: "Etki Bölümü Başlığı" },
    ],
    defaults: {
      title: "Myasthenia Gravis Topluluğunu Destekleyin",
      subtitle:
        "Yapacağınız bağışlar; farkındalık çalışmalarına ve MG ile yaşayan hastalara destek olmamıza yardımcı olur.",
      bankTransferTitle: "Banka Havalesi ile Bağış",
      bankTransferDescription:
        "Bağışlarınız dernek faaliyetleri, hasta destek programları ve farkındalık çalışmaları için kullanılır.",
      campaignsTitle: "Aktif Kampanyalar",
      impactTitle: "Etkiniz",
    },
  },
};

export function getEditablePageConfig(key: string): EditablePageConfig | null {
  return EDITABLE_PAGE_CONFIGS[key as EditablePageKey] ?? null;
}

export function mergeEditablePageData(
  key: string,
  data?: Record<string, unknown> | null
): Record<string, string> {
  const config = getEditablePageConfig(key);
  if (!config) return {};

  return config.fields.reduce<Record<string, string>>((acc, field) => {
    const value = data?.[field.name];
    if (typeof value === "string") {
      acc[field.name] = value;
    } else if (Array.isArray(value)) {
      acc[field.name] = value
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            const record = item as Record<string, unknown>;
            return [record.name, record.description].filter(Boolean).join(" | ");
          }
          return "";
        })
        .filter(Boolean)
        .join("\n");
    } else {
      acc[field.name] = config.defaults[field.name] ?? "";
    }
    return acc;
  }, {});
}
