import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  LayoutDashboard,
  FileText,
  ScrollText,
  Receipt,
  Phone,
  House,
  Users,
  HeartHandshake,
  Link,
  List,
  Bold,
  Pencil,
  Image as ImageIcon,
  Plus,
  ArrowLeft,
} from "lucide-react";

type PageStatus = "Yayınlandı" | "Taslak";

type PageSection = {
  id: string;
  label: string;
  editorTitle: string;
  content: string;
  buttonText?: string;
  image?: string;
  listItems?: string[];
};

type ManagedPage = {
  id: number;
  key: string;
  name: string;
  type: string;
  status: PageStatus;
  updatedAt: string;
  templateSource: string;
  sections: PageSection[];
};

type AvailablePage = {
  id: number;
  key: string;
  name: string;
  type: string;
  status: "Ekli Değil";
  updatedAt: string;
  templateSource: string;
  sections: PageSection[];
};

const imgHero =
  "https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&w=1200&q=80";
const imgRibbon =
  "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1200&q=80";
const imgDonate =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";
const imgMap =
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80";

function today() {
  return new Date().toLocaleDateString("tr-TR");
}

const templates = {
  home: {
    key: "home",
    name: "Ana Sayfa",
    type: "Sayfa",
    templateSource: "app/page.tsx",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        editorTitle: "Ana Sayfa Hero",
        content:
          "Myasthenia Gravis ile yaşayan milyonlarca insan için farkındalık oluşturma zamanı. Bu özel ay boyunca, hastalığa dair doğru bilgiyi yaymayı, güç vermeyi ve topluluk olarak dayanışmayı artırmayı hedefliyoruz.",
        buttonText: "Daha Fazla Bilgi",
        image: imgHero,
      },
      {
        id: "about",
        label: "About Section",
        editorTitle: "Dernek Tanıtım Alanı",
        content:
          "Myastenia Gravis (MG) hastaları ve yakınlarına yönelik farkındalık oluşturmak, doğru bilgi sağlamak ve destekleyici bir topluluk oluşturmak amacıyla kurulmuş bir sivil toplum kuruluşuyuz.",
        buttonText: "Daha Fazla Bilgi",
        image: imgRibbon,
      },
      {
        id: "quick-links",
        label: "Quick Links Section",
        editorTitle: "Hızlı Bağlantılar",
        content:
          "Reports & Publications, Media & News ve Support Our Cause kartları bu bölümde yer alır.",
        listItems: ["Reports Card", "Media Card", "Donate Card"],
      },
    ],
  },
  about: {
    key: "about",
    name: "Hakkımızda",
    type: "Sayfa",
    templateSource: "app/about/page.tsx",
    sections: [
      {
        id: "about-hero",
        label: "About Us Section",
        editorTitle: "Hakkımızda Giriş",
        content:
          "Derneğimiz, MG ile yaşayan bireylerin ve yakınlarının yaşam kalitesini artırmak, doğru bilgiye erişim sağlamak ve güçlü bir topluluk oluşturmak için çalışır.",
        image: imgRibbon,
      },
      {
        id: "vision",
        label: "Vision Section",
        editorTitle: "Vizyon Bölümü",
        content: "Bu bölümde vizyon başlığı ve maddeleri yer alır.",
        listItems: [
          "Quisque finibus lacus in diam vestibulum, vitae aliquam tortor aliquet.",
          "Ut placerat neque at vulputate mollis.",
        ],
      },
      {
        id: "mission",
        label: "Mission Section",
        editorTitle: "Misyon Bölümü",
        content: "Bu bölümde misyon başlığı ve maddeleri yer alır.",
        listItems: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Nullam accumsan ex sit amet varius placerat.",
          "Nulla dapibus ex sed nunc scelerisque dictum.",
        ],
      },
      {
        id: "team",
        label: "Meet Our Team Section",
        editorTitle: "Ekibimiz Bölümü",
        content: "Bu bölümde ekip üyeleri kartları veya liste yapısı yer alır.",
        listItems: ["Person1", "Person2"],
      },
    ],
  },
  contact: {
    key: "contact",
    name: "İletişim",
    type: "Sayfa",
    templateSource: "app/contact/page.tsx",
    sections: [
      {
        id: "contact-info",
        label: "Contact Section",
        editorTitle: "İletişim Bilgileri",
        content:
          "We are here to support and connect the MG community. If you have questions, would like to volunteer, collaborate, or learn more about our initiatives, feel free to reach out to us.",
      },
      {
        id: "contact-form",
        label: "Contact Form Section",
        editorTitle: "İletişim Formu",
        content:
          "Get in Touch başlığı, açıklama metni, form alanları ve KVKK checkbox bu bölümün içindedir.",
        buttonText: "Submit",
      },
      {
        id: "location",
        label: "Map & Location Section",
        editorTitle: "Konum Bölümü",
        content:
          "Our organization works to connect and support the MG community through initiatives, events, and resources.",
        image: imgMap,
      },
      {
        id: "faq",
        label: "FAQ Section",
        editorTitle: "Sık Sorulan Sorular",
        content: "FAQ başlığı ve açılır soru-cevap listesi bu bölümde yer alır.",
        listItems: [
          "How can I support the MG community?",
          "How can I become a volunteer?",
          "How can I participate in community events?",
        ],
      },
    ],
  },
  reports: {
    key: "reports",
    name: "Raporlar",
    type: "Sayfa",
    templateSource: "app/reports/page.tsx",
    sections: [
      {
        id: "reports-hero",
        label: "ReportsHero",
        editorTitle: "Raporlar Hero",
        content: "Raporlar sayfasındaki üst karşılama alanı.",
      },
      {
        id: "featured-report",
        label: "FeaturedReport",
        editorTitle: "Öne Çıkan Rapor",
        content: "Featured report bileşeninin içerikleri bu bölümden yönetilir.",
      },
      {
        id: "reports-grid",
        label: "ReportsGrid",
        editorTitle: "Rapor Listesi/Grid",
        content: "Rapor kartları veya grid yapısı bu bölümde listelenir.",
      },
    ],
  },
  media: {
    key: "media",
    name: "Medya",
    type: "Sayfa",
    templateSource: "app/media/page.tsx",
    sections: [
      {
        id: "media-hero",
        label: "MediaHero",
        editorTitle: "Medya Hero",
        content: "Medya sayfasının üst karşılama alanı.",
      },
      {
        id: "featured-media",
        label: "FeaturedMedia",
        editorTitle: "Öne Çıkan Medya",
        content: "Öne çıkan medya içeriği bu bölümden yönetilir.",
      },
      {
        id: "media-grid",
        label: "MediaGrid",
        editorTitle: "Medya Kartları",
        content: "Haber ve medya kartları bu bölümde listelenir.",
      },
      {
        id: "media-gallery",
        label: "MediaGallery",
        editorTitle: "Galeri Bölümü",
        content: "Görsel galerisi bu bölümde yer alır.",
      },
      {
        id: "media-cta",
        label: "MediaCta",
        editorTitle: "CTA Bölümü",
        content: "Sayfanın sonunda bulunan çağrı alanı.",
        buttonText: "Daha Fazla Bilgi",
      },
    ],
  },
  donate: {
    key: "donate",
    name: "Bağış Yap",
    type: "Bağış",
    templateSource: "donate/page.tsx (gerekli dosya eksik)",
    sections: [
      {
        id: "donate-hero",
        label: "Fotoğraf Alanı",
        editorTitle: "Bağış Hero",
        content:
          "Bağış sayfasındaki hero/fotoğraf alanı. Gerçek donate page.tsx gelince buna göre güncellenecek.",
        image: imgDonate,
        buttonText: "Hemen Bağış Yap",
      },
      {
        id: "campaigns",
        label: "Aktif Kampanyalar",
        editorTitle: "Kampanya Bölümü",
        content:
          "Aktif kampanyalar, bağış seçenekleri ve bağış açıklamaları bu bölümde yer alır.",
      },
    ],
  },
};

const managedPagesSeed: ManagedPage[] = [
  { id: 1, ...templates.home, status: "Yayınlandı", updatedAt: "12.08.2025" },
  { id: 2, ...templates.about, status: "Yayınlandı", updatedAt: "30.07.2025" },
  { id: 3, ...templates.contact, status: "Yayınlandı", updatedAt: "02.11.2024" },
  { id: 4, ...templates.donate, status: "Taslak", updatedAt: "02.05.2026" },
];

const availablePagesSeed: AvailablePage[] = [
  { id: 101, ...templates.reports, status: "Ekli Değil", updatedAt: "-" },
  { id: 102, ...templates.media, status: "Ekli Değil", updatedAt: "-" },
];

const sideMenu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Page Management", icon: FileText },
  { label: "Bylaws", icon: ScrollText },
  { label: "Reports", icon: Receipt },
  { label: "IBAN Data", icon: Receipt },
  { label: "Contact Details", icon: Phone, highlighted: true },
  { label: "Homepage Content", icon: House },
  { label: "Board Members", icon: Users },
  { label: "Supporters", icon: HeartHandshake },
];

function DropdownFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-w-[150px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-full items-center justify-between rounded-2xl bg-white px-5 text-[18px] text-neutral-500 shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
      >
        <span>{value || label}</span>
        <ChevronDown className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100"
          >
            Tümü
          </button>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-neutral-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  if (value === "Yayınlandı") {
    return <span className="inline-flex rounded-2xl bg-[#22B15D] px-7 py-2 text-[18px] font-semibold text-white">Yayınlandı</span>;
  }
  if (value === "Taslak") {
    return <span className="inline-flex rounded-2xl bg-[#FF9800] px-8 py-2 text-[18px] font-semibold text-white">Taslak</span>;
  }
  return <span className="inline-flex rounded-2xl bg-[#2F80ED] px-8 py-2 text-[18px] font-semibold text-white">Ekle</span>;
}

function Sidebar({ selectedMenu, setSelectedMenu }: { selectedMenu: string; setSelectedMenu: (value: string) => void; }) {
  return (
    <aside className="m-3 w-[260px] rounded-[26px] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
      <div className="mb-10 flex items-center gap-4 px-2">
        <div className="h-12 w-12 rounded-full bg-[#D9D9D9]" />
        <span className="text-[22px] font-bold">Admin</span>
      </div>
      <nav className="space-y-3">
        {sideMenu.map((item) => {
          const Icon = item.icon;
          const active = selectedMenu === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedMenu(item.label)}
              className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left text-[18px] font-medium transition ${
                active || item.highlighted ? "bg-[#DCE9FA] text-[#3B82F6]" : "text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ globalSearch, setGlobalSearch }: { globalSearch: string; setGlobalSearch: (value: string) => void; }) {
  return (
    <header className="flex h-[78px] items-center justify-between rounded-t-[6px] bg-white px-8 shadow-sm">
      <div className="flex flex-1 items-center gap-5">
        <div className="text-2xl">☰</div>
        <div className="flex h-12 w-full max-w-[1120px] items-center rounded-md bg-[#EAECEF] px-5 text-neutral-500">
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Quick search"
            className="h-full w-full bg-transparent text-[18px] outline-none placeholder:text-neutral-500"
          />
        </div>
      </div>
      <div className="ml-6 h-10 w-10 rounded-full bg-[#9E9EA4]" />
    </header>
  );
}

function SectionTable({
  rows,
  onEdit,
  onAdd,
  showAdd,
}: {
  rows: Array<{ id: number; name: string; type: string; status: string; updatedAt: string }>;
  onEdit: (id: number) => void;
  onAdd?: (id: number) => void;
  showAdd?: boolean;
}) {
  return (
    <div className="rounded-[18px] bg-[#F0F0F0] p-8">
      <div className="grid grid-cols-[1.7fr_1fr_1.1fr_1.2fr_0.9fr] rounded-2xl bg-[#D9D9DD] px-12 py-4 text-[16px] font-medium text-neutral-800">
        <div>Sayfa Adı</div>
        <div>Tür</div>
        <div>Durum</div>
        <div>Son Güncelleme</div>
        <div>İşlemler</div>
      </div>
      <div className="mt-2 space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1.7fr_1fr_1.1fr_1.2fr_0.9fr] items-center rounded-2xl bg-white px-12 py-5 text-[18px] text-neutral-900 shadow-sm">
            <div className="font-medium">{row.name}</div>
            <div>{row.type}</div>
            <div>{showAdd ? <button type="button" onClick={() => onAdd?.(row.id)} className="inline-flex min-w-[114px] items-center justify-center rounded-2xl bg-[#2F80ED] px-8 py-2 text-[18px] font-semibold text-white">Ekle</button> : <StatusBadge value={row.status} />}</div>
            <div>{row.updatedAt}</div>
            <div><button type="button" onClick={() => onEdit(row.id)} className="rounded-2xl bg-[#D9D9D9] px-8 py-3 text-[18px] font-medium text-neutral-900 transition hover:bg-neutral-300">Düzenle</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewSection({ section }: { section: PageSection }) {
  return (
    <div className="border-b border-neutral-200 py-6 first:pt-0">
      <h3 className="text-[24px] font-bold text-[#0D9488]">{section.editorTitle}</h3>
      <p className="mt-3 text-[15px] leading-7 text-neutral-700">{section.content}</p>
      {section.listItems && (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
          {section.listItems.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      )}
      {section.buttonText && <button className="mt-4 rounded bg-[#0D8B8B] px-5 py-2 text-sm font-medium text-white">{section.buttonText}</button>}
      {section.image && <img src={section.image} alt={section.label} className="mt-5 h-[180px] w-full rounded object-cover" />}
    </div>
  );
}

function EditPageView({
  page,
  pages,
  globalSearch,
  setGlobalSearch,
  onBackToManagement,
  onJumpToPage,
  onUpdatePage,
  onSaveDraft,
  onPublish,
  selectedMenu,
  setSelectedMenu,
}: {
  page: ManagedPage;
  pages: ManagedPage[];
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  onBackToManagement: () => void;
  onJumpToPage: (pageId: number) => void;
  onUpdatePage: (pageId: number, updater: (page: ManagedPage) => ManagedPage) => void;
  onSaveDraft: (pageId: number) => void;
  onPublish: (pageId: number) => void;
  selectedMenu: string;
  setSelectedMenu: (value: string) => void;
}) {
  const [selectedSectionId, setSelectedSectionId] = useState(page.sections[0]?.id ?? "");
  const [pageSearch, setPageSearch] = useState("");

  useEffect(() => {
    setSelectedSectionId(page.sections[0]?.id ?? "");
    setPageSearch(page.name);
  }, [page]);

  const selectedSection = page.sections.find((section) => section.id === selectedSectionId) ?? page.sections[0];

  const updateSelectedSection = (updater: (section: PageSection) => PageSection) => {
    onUpdatePage(page.id, (currentPage) => ({
      ...currentPage,
      updatedAt: today(),
      sections: currentPage.sections.map((section) => (section.id === selectedSection.id ? updater(section) : section)),
    }));
  };

  const addSection = () => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      label: `Yeni Bölüm ${page.sections.length + 1}`,
      editorTitle: `Yeni Bölüm ${page.sections.length + 1}`,
      content: "Bu alana yeni bölüm içeriği yazabilirsiniz.",
      buttonText: "Buton Metni",
    };

    onUpdatePage(page.id, (currentPage) => ({
      ...currentPage,
      updatedAt: today(),
      sections: [...currentPage.sections, newSection],
    }));
    setSelectedSectionId(newSection.id);
  };

  const pageSearchResults = pages.filter((item) => item.name.toLowerCase().includes(pageSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#EEEEEE] text-neutral-900">
      <div className="flex min-h-screen">
        <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <main className="flex-1 pb-10 pr-4 pt-3">
          <TopBar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
          <div className="px-8 pt-8">
            <div className="flex items-center gap-4">
              <button type="button" onClick={onBackToManagement} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"><ArrowLeft className="h-4 w-4" /> Geri</button>
              <div>
                <h1 className="text-[58px] font-bold leading-none">Sayfa Yönetimi</h1>
                <p className="mt-3 text-[22px] text-neutral-500">Sayfa Yönetimi / {page.name} Düzenle</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[1.08fr_0.92fr] gap-6">
              <section className="rounded-[18px] bg-[#E4E4E4] p-5">
                <div className="relative rounded-2xl bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.10)]">
                  <input
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                    placeholder="Sayfa Ara"
                    className="w-full bg-transparent text-[18px] outline-none placeholder:text-neutral-500"
                  />
                  {pageSearch && pageSearchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-[72px] z-20 rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl">
                      {pageSearchResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => onJumpToPage(result.id)}
                          className="block w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-neutral-100"
                        >
                          {result.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-[18px] bg-white p-5">
                  <div className="flex items-center justify-between rounded-2xl bg-[#D3D3D6] px-5 py-4">
                    <div className="flex items-center gap-3 text-[18px] font-semibold">
                      <Pencil className="h-5 w-5" />
                      <span>{selectedSection?.label ?? "Bölüm"}</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {page.sections.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${selectedSection?.id === section.id ? "bg-[#0D8B8B] text-white" : "bg-neutral-200 text-neutral-700"}`}
                      >
                        {section.label}
                      </button>
                    ))}
                    <button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-full bg-[#2F80ED] px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" /> Bölüm Ekle</button>
                  </div>

                  {selectedSection && (
                    <>
                      <div className="mt-6">
                        <label className="mb-2 block text-[18px] font-semibold">Başlık</label>
                        <input value={selectedSection.editorTitle} onChange={(e) => updateSelectedSection((section) => ({ ...section, editorTitle: e.target.value }))} className="h-14 w-full rounded-2xl bg-[#F4F4F4] px-5 text-[18px] outline-none" />
                        <p className="mt-2 text-sm text-neutral-500">Bu başlık editör düzeni içindir, sayfada görünmek zorunda değildir.</p>
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-[18px] font-semibold">Sayfa İçeriği</label>
                        <div className="rounded-t-2xl bg-[#D3D3D6] px-4 py-3">
                          <div className="flex items-center gap-4 text-neutral-900">
                            <Link className="h-5 w-5" />
                            <List className="h-5 w-5" />
                            <Bold className="h-5 w-5" />
                            <Pencil className="h-5 w-5" />
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        </div>
                        <textarea value={selectedSection.content} onChange={(e) => updateSelectedSection((section) => ({ ...section, content: e.target.value }))} className="min-h-[220px] w-full rounded-b-2xl bg-white p-5 text-[18px] leading-8 outline-none" />
                      </div>

                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[18px] font-semibold">Buton Metni</label>
                          <input value={selectedSection.buttonText ?? ""} onChange={(e) => updateSelectedSection((section) => ({ ...section, buttonText: e.target.value }))} className="h-14 w-full rounded-2xl bg-[#F4F4F4] px-5 text-[18px] outline-none" />
                        </div>
                        <div>
                          <label className="mb-2 block text-[18px] font-semibold">Görsel URL</label>
                          <input value={selectedSection.image ?? ""} onChange={(e) => updateSelectedSection((section) => ({ ...section, image: e.target.value }))} className="h-14 w-full rounded-2xl bg-[#F4F4F4] px-5 text-[16px] outline-none" />
                        </div>
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-[18px] font-semibold">Liste Öğeleri</label>
                        <textarea
                          value={(selectedSection.listItems ?? []).join("\n")}
                          onChange={(e) => updateSelectedSection((section) => ({ ...section, listItems: e.target.value ? e.target.value.split("\n") : [] }))}
                          placeholder="Her satıra bir öğe yazın"
                          className="min-h-[120px] w-full rounded-2xl bg-[#F4F4F4] p-5 text-[16px] leading-7 outline-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className="rounded-[18px] bg-[#E4E4E4] p-5">
                <div className="rounded-[18px] bg-white p-5">
                  <div className="overflow-hidden rounded border border-neutral-300 bg-white">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                      <div>
                        <div className="text-lg font-bold text-[#0D9488]">Canlı Önizleme</div>
                        <div className="text-sm text-neutral-500">Template kaynağı: {page.templateSource}</div>
                      </div>
                      <div className="rounded-full bg-[#F3F4F6] px-4 py-2 text-sm">{page.name}</div>
                    </div>
                    <div className="max-h-[780px] overflow-auto p-6">
                      {page.sections.map((section) => <PreviewSection key={section.id} section={section} />)}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-neutral-200 pt-6">
                    <div className="grid gap-4">
                      <div>
                        <label className="mb-2 block text-[18px] font-semibold">Durum</label>
                        <div className="rounded-2xl bg-[#F4F4F4] px-5 py-4 text-[18px]">{page.status}</div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[18px] font-semibold">Slug</label>
                        <div className="rounded-2xl bg-[#F4F4F4] px-5 py-4 text-[18px]">/{page.key}</div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[18px] font-semibold">Kategori</label>
                        <div className="rounded-2xl bg-[#F4F4F4] px-5 py-4 text-[18px]">{page.type}</div>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                      <button type="button" onClick={onBackToManagement} className="flex-1 rounded-full border border-neutral-300 bg-white px-6 py-4 text-[18px] font-medium">İptal</button>
                      <button type="button" onClick={() => onSaveDraft(page.id)} className="flex-1 rounded-full border border-neutral-300 bg-[#ECECEC] px-6 py-4 text-[18px] font-medium">Taslak Olarak Kaydet</button>
                      <button type="button" onClick={() => onPublish(page.id)} className="flex-1 rounded-full bg-[#25B35B] px-6 py-4 text-[18px] font-semibold text-white">Yayınla</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ManagementView({
  managedPages,
  availablePages,
  onEdit,
  onAddPage,
  globalSearch,
  setGlobalSearch,
  selectedMenu,
  setSelectedMenu,
}: {
  managedPages: ManagedPage[];
  availablePages: AvailablePage[];
  onEdit: (id: number) => void;
  onAddPage: (id: number) => void;
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  selectedMenu: string;
  setSelectedMenu: (value: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customFilter, setCustomFilter] = useState("");

  const allTypes = useMemo(() => [...new Set([...managedPages, ...availablePages].map((item) => item.type))], [managedPages, availablePages]);
  const allStatuses = useMemo(() => [...new Set(managedPages.map((item) => item.status))], [managedPages]);

  const filteredManagedPages = useMemo(() => {
    return managedPages.filter((page) => {
      const query = `${page.name} ${page.type} ${page.status} ${page.updatedAt}`.toLowerCase();
      const matchesSearch = page.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || page.type === typeFilter;
      const matchesStatus = !statusFilter || page.status === statusFilter;
      const matchesCustom = !customFilter || query.includes(customFilter.toLowerCase());
      const matchesGlobal = !globalSearch || page.name.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesSearch && matchesType && matchesStatus && matchesCustom && matchesGlobal;
    });
  }, [managedPages, search, typeFilter, statusFilter, customFilter, globalSearch]);

  const filteredAvailablePages = useMemo(() => {
    return availablePages.filter((page) => {
      const query = `${page.name} ${page.type} ${page.updatedAt}`.toLowerCase();
      const matchesSearch = page.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || page.type === typeFilter;
      const matchesCustom = !customFilter || query.includes(customFilter.toLowerCase());
      const matchesGlobal = !globalSearch || page.name.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesSearch && matchesType && matchesCustom && matchesGlobal;
    });
  }, [availablePages, search, typeFilter, customFilter, globalSearch]);

  return (
    <div className="min-h-screen bg-[#EEEEEE] text-neutral-900">
      <div className="flex min-h-screen">
        <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        <main className="flex-1 pb-10 pr-4 pt-3">
          <TopBar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
          <div className="px-8 pt-8">
            <h1 className="text-[64px] font-bold leading-none">Sayfa Yönetimi</h1>
            <section className="mt-8 rounded-[18px] bg-[#E4E4E4] p-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative min-w-[380px] flex-1">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Sayfa Ara" className="h-14 w-full rounded-2xl bg-white px-6 pr-14 text-[18px] text-neutral-500 shadow-[0_4px_14px_rgba(0,0,0,0.10)] outline-none placeholder:text-neutral-500" />
                  <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                </div>
                <DropdownFilter label="Tüm Türler" options={allTypes} value={typeFilter} onChange={setTypeFilter} />
                <DropdownFilter label="Tüm Durumlar" options={allStatuses} value={statusFilter} onChange={setStatusFilter} />
                <input value={customFilter} onChange={(e) => setCustomFilter(e.target.value)} placeholder="Filtrele" className="h-14 min-w-[160px] rounded-2xl bg-white px-5 text-[18px] text-neutral-500 shadow-[0_4px_14px_rgba(0,0,0,0.10)] outline-none placeholder:text-neutral-500" />
                <button type="button" className="ml-auto rounded-full bg-[#25B35B] px-8 py-4 text-[18px] font-semibold text-white shadow-[0_4px_14px_rgba(37,179,91,0.35)]">+ Yeni Sayfa Ekle</button>
              </div>
              <div className="mt-6"><SectionTable rows={filteredManagedPages} onEdit={onEdit} /></div>
            </section>
            <section className="mt-12 border-t border-neutral-300 pt-6">
              <h2 className="text-[44px] font-bold">Sayfalar</h2>
              <div className="mt-6"><SectionTable rows={filteredAvailablePages} onEdit={onEdit} onAdd={onAddPage} showAdd /></div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SayfaYonetimiPage() {
  const [managedPages, setManagedPages] = useState<ManagedPage[]>(managedPagesSeed);
  const [availablePages, setAvailablePages] = useState<AvailablePage[]>(availablePagesSeed);
  const [currentView, setCurrentView] = useState<"management" | "edit">("management");
  const [selectedPageId, setSelectedPageId] = useState<number>(1);
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("Contact Details");

  const selectedPage = managedPages.find((page) => page.id === selectedPageId) ?? managedPages[0];

  const handleAddPage = (id: number) => {
    const page = availablePages.find((item) => item.id === id);
    if (!page) return;
    setAvailablePages((prev) => prev.filter((item) => item.id !== id));
    setManagedPages((prev) => [...prev, { ...page, status: "Taslak", updatedAt: today() }]);
  };

  const handleEdit = (id: number) => {
    setSelectedPageId(id);
    setCurrentView("edit");
  };

  const handleUpdatePage = (pageId: number, updater: (page: ManagedPage) => ManagedPage) => {
    setManagedPages((prev) => prev.map((page) => (page.id === pageId ? updater(page) : page)));
  };

  const handleSaveDraft = (pageId: number) => {
    setManagedPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, status: "Taslak", updatedAt: today() } : page)));
    setCurrentView("management");
  };

  const handlePublish = (pageId: number) => {
    setManagedPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, status: "Yayınlandı", updatedAt: today() } : page)));
    setCurrentView("management");
  };

  return currentView === "management" ? (
    <ManagementView
      managedPages={managedPages}
      availablePages={availablePages}
      onEdit={handleEdit}
      onAddPage={handleAddPage}
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      selectedMenu={selectedMenu}
      setSelectedMenu={setSelectedMenu}
    />
  ) : (
    <EditPageView
      page={selectedPage}
      pages={managedPages}
      globalSearch={globalSearch}
      setGlobalSearch={setGlobalSearch}
      onBackToManagement={() => setCurrentView("management")}
      onJumpToPage={(id) => setSelectedPageId(id)}
      onUpdatePage={handleUpdatePage}
      onSaveDraft={handleSaveDraft}
      onPublish={handlePublish}
      selectedMenu={selectedMenu}
      setSelectedMenu={setSelectedMenu}
    />
  );
}
