"use client";

import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Megaphone,
  LayoutDashboard,
  ClipboardCheck,
  HelpCircle,
} from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";

const helpCards = [
  {
    title: "Dashboard",
    description:
      "Genel istatistikleri, son blog yazılarını, yaklaşan etkinlikleri ve hızlı işlemleri bu alanda görebilirsiniz.",
    href: "/editorPanel/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Etkinlikler",
    description:
      "Etkinlik ekleyebilir, düzenleyebilir, silebilir ve filtreleme yapabilirsiniz.",
    href: "/editorPanel/events",
    icon: ClipboardCheck,
  },
  {
    title: "Blog Yazıları",
    description:
      "Blog yazılarınızı oluşturabilir, taslak olarak kaydedebilir ve yayın durumlarını yönetebilirsiniz.",
    href: "/editorPanel/blog-posts",
    icon: FileText,
  },
  {
    title: "Takvim",
    description:
      "Yıl bazında etkinlikleri takvim üzerinde görüntüleyebilir ve gün bazlı planlamayı takip edebilirsiniz.",
    href: "/editorPanel/calendar",
    icon: CalendarDays,
  },
  {
    title: "Medya",
    description:
      "Sayfalara ait görselleri yükleyebilir, başlık ve etiket ekleyebilir, görünürlük ayarlarını düzenleyebilirsiniz.",
    href: "/editorPanel/media",
    icon: ImageIcon,
  },
  {
    title: "Duyurular",
    description:
      "Duyuru ekleyebilir, hedef kitle belirleyebilir ve önemli duyuruları sabitleyebilirsiniz.",
    href: "/editorPanel/announcements",
    icon: Megaphone,
  },
];

const faqItems = [
  {
    question: "Yeni içerik nasıl eklenir?",
    answer:
      "İlgili modüle gittikten sonra üst bölümde yer alan ekleme butonlarını kullanabilirsiniz. Örneğin Etkinlikler sayfasında 'Etkinlik Ekle', Blog Yazıları sayfasında 'Blog Yazısı Ekle' seçeneği bulunur.",
  },
  {
    question: "Bir içeriği nasıl düzenlerim?",
    answer:
      "Liste ekranlarında yer alan kalem simgesine veya düzenle butonuna tıklayarak ilgili içeriğin düzenleme sayfasına geçebilirsiniz.",
  },
  {
    question: "Bir içeriği nasıl silerim?",
    answer:
      "Liste ekranlarında çöp kutusu simgesini kullanabilir ya da medya sayfasında görsel üzerindeki X butonuyla tekli silme işlemi yapabilirsiniz.",
  },
  {
    question: "Takvimde etkinlikler nasıl görünür?",
    answer:
      "Eklenen etkinlikler, tarih bilgilerine göre takvim sayfasında ilgili gün üzerinde işaretlenir. Günün üzerine gelindiğinde etkinlik adı görüntülenir.",
  },
];

export default function HelpPage() {
  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-center gap-3">
          <HelpCircle className="h-9 w-9 text-[#2f80ed]" />
          <h1 className="text-[52px] font-bold text-black">Yardım</h1>
        </div>

        <section className="rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="mb-5 text-[24px] font-semibold text-black">
            Hızlı Erişim
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {helpCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="rounded-[18px] bg-white p-5 shadow-sm transition hover:translate-y-[-2px]"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#2f80ed]" />
                    <h3 className="text-[18px] font-semibold text-black">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-[15px] leading-6 text-[#444]">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-7 rounded-[24px] bg-[#e8e8e8] p-6 shadow-md">
          <h2 className="mb-5 text-[24px] font-semibold text-black">
            Sık Sorulan Sorular
          </h2>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-[16px] bg-white p-5 shadow-sm"
              >
                <h3 className="text-[17px] font-semibold text-black">
                  {item.question}
                </h3>
                <p className="mt-2 text-[15px] leading-6 text-[#444]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </EditorShell>
  );
}