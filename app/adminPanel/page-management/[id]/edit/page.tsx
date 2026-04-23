"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDown,
  ImagePlus,
  Link as LinkIcon,
  List,
  Bold,
  Pencil,
} from "lucide-react";
import AdminShell from "@/components/adminPanel/AdminShell";
import { useAdminPanel } from "@/context/AdminPanelContext";
import { ManagedPageSection } from "@/types/adminPanel";

export default function EditManagedPagePage() {
  const params = useParams();
  const router = useRouter();
  const pageId = String(params.id);

  const { getManagedPageById, updateManagedPage } = useAdminPanel();
  const page = getManagedPageById(pageId);

  if (!page) {
    return (
      <AdminShell>
        <h1 className="text-[40px] font-bold text-black">Sayfa bulunamadı</h1>

        <Link
          href="/adminPanel/page-management"
          className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
        >
          Sayfa Yönetimine Dön
        </Link>
      </AdminShell>
    );
  }

  const currentPage = page;

  function updateSection(sectionId: string, data: Partial<ManagedPageSection>) {
    const updatedSections = currentPage.sections.map((section) =>
      section.id === sectionId ? { ...section, ...data } : section
    );

    updateManagedPage(currentPage.id, {
      sections: updatedSections,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }

  function handlePublish() {
    updateManagedPage(currentPage.id, {
      status: "published",
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    router.push("/adminPanel/page-management");
  }

  function handleSaveDraft() {
    updateManagedPage(currentPage.id, {
      status: "draft",
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    router.push("/adminPanel/page-management");
  }

  return (
    <AdminShell>
      <div className="rounded-[22px] bg-[#f3f3f3]">
        <div className="mb-5">
          <h1 className="text-[44px] font-bold text-black">Sayfa Yönetimi</h1>
          <p className="mt-1 text-[14px] text-[#777]">
            Sayfa Yönetimi / {currentPage.name} Düzenle
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[18px] bg-[#e8e8e8] p-5 shadow-md">
            <input
              placeholder="Sayfa Ara"
              className="mb-5 h-[52px] w-full rounded-[12px] bg-white px-5 outline-none shadow-sm"
            />

            <div className="space-y-5">
              {currentPage.sections.map((section) => (
                <div key={section.id} className="rounded-[16px] bg-white p-4">
                  <div className="mb-4 flex items-center justify-between rounded-[12px] bg-[#d8d8d8] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Pencil className="h-5 w-5" />
                      <span className="font-semibold">{section.label}</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                  </div>

                  <label className="mb-2 block text-[15px] font-medium">
                    Başlık
                  </label>
                  <input
                    value={section.editorTitle}
                    onChange={(e) =>
                      updateSection(section.id, {
                        editorTitle: e.target.value,
                      })
                    }
                    className="mb-4 h-[52px] w-full rounded-[12px] bg-[#f3f3f3] px-4 outline-none"
                  />

                  <label className="mb-2 block text-[15px] font-medium">
                    Sayfa İçeriği
                  </label>

                  <div className="flex gap-4 rounded-t-[12px] bg-[#d8d8d8] px-4 py-3">
                    <LinkIcon className="h-5 w-5" />
                    <List className="h-5 w-5" />
                    <Bold className="h-5 w-5" />
                    <Pencil className="h-5 w-5" />
                  </div>

                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      updateSection(section.id, {
                        content: e.target.value,
                      })
                    }
                    rows={6}
                    className="w-full rounded-b-[12px] bg-[#f3f3f3] px-4 py-3 outline-none"
                  />

                  <div className="mt-4 flex items-center gap-4">
                    {section.imageUrl ? (
                      <img
                        src={section.imageUrl}
                        alt={section.editorTitle}
                        className="h-[140px] w-[220px] rounded-[12px] object-cover"
                      />
                    ) : (
                      <div className="flex h-[140px] w-[220px] items-center justify-center rounded-[12px] bg-[#e8e8e8]">
                        <ImagePlus className="h-8 w-8 text-[#888]" />
                      </div>
                    )}

                    <label className="cursor-pointer rounded-[12px] bg-[#d8d8d8] px-6 py-3">
                      Düzenle
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            updateSection(section.id, {
                              imageUrl: URL.createObjectURL(file),
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[18px] bg-[#e8e8e8] p-5 shadow-md">
            <div className="mx-auto max-w-[520px] overflow-hidden border border-[#444] bg-white">
              <div className="bg-[#0b8f8c] px-6 py-4 text-white">
                <div className="text-[24px] font-bold">MG</div>
                <div className="mt-3 flex gap-5 text-[12px]">
                  <span>Ana Sayfa</span>
                  <span>Hakkımızda</span>
                  <span>Bloglar</span>
                  <span>Raporlar</span>
                  <span>Medya</span>
                  <span>İletişim</span>
                </div>
              </div>

              {currentPage.sections.map((section, index) => (
                <div key={section.id} className="p-8">
                  <h2
                    className={`text-[26px] font-bold ${
                      index === 0 ? "text-[#0b5ea8]" : "text-[#078c8b]"
                    }`}
                  >
                    {section.editorTitle}
                  </h2>

                  <p className="mt-3 text-[14px] leading-6 text-[#444]">
                    {section.content}
                  </p>

                  {section.imageUrl && (
                    <img
                      src={section.imageUrl}
                      alt={section.editorTitle}
                      className="mt-5 h-[180px] w-full rounded-[10px] object-cover"
                    />
                  )}

                  <button className="mt-5 rounded-[8px] bg-[#0b8f8c] px-4 py-2 text-[13px] text-white">
                    Daha Fazla Bilgi
                  </button>
                </div>
              ))}

              <div className="bg-[#e8f5f4] px-6 py-5 text-[12px] text-[#444]">
                © Copyright 2026 Myasthenia Gravis Yaşam Derneği
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="rounded-[14px] bg-[#d8d8d8] px-8 py-3"
              >
                Taslak olarak kaydet
              </button>

              <button
                type="button"
                onClick={handlePublish}
                className="rounded-[14px] bg-[#27ae60] px-8 py-3 text-white"
              >
                Yayınla
              </button>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}