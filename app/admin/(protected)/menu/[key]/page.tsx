"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Check, AlertCircle, FileText, Eye, EyeOff,
  Layers, WandSparkles, ExternalLink,
} from "lucide-react";
import { getNavConfig, patchNavItem, type NavItem } from "@/lib/firebase/navServices";
import {
  getPageBlocks, savePageBlocks,
  getAdminPageBySlug, getAdminPageDataBySlug, upsertPageContent, type AdminPage,
} from "@/lib/firebase/adminServices";
import { revalidatePageAction, revalidatePublicPathAction } from "@/app/admin/actions";
import { BlockEditorCanvas } from "@/components/admin/pageBuilder/BlockEditorCanvas";
import { InlineBlogManager } from "@/components/admin/InlineBlogManager";
import { InlineEventManager } from "@/components/admin/InlineEventManager";
import { InlineMediaManager } from "@/components/admin/InlineMediaManager";
import { InlineCampaignManager } from "@/components/admin/InlineCampaignManager";
import { InlineImpactManager } from "@/components/admin/InlineImpactManager";
import { InlineFaqManager } from "@/components/admin/InlineFaqManager";
import { InlineHakkimizdaManager } from "@/components/admin/InlineHakkimizdaManager";
import type { PageSection, TemplateType, PageBlockData } from "@/types/pageBuilder";
import { getEditablePageConfig, mergeEditablePageData } from "@/lib/pageContentConfig";
import type { FaqItemEntry } from "@/components/admin/shared/FaqItemsEditor";
import type { ImpactItemEntry } from "@/components/admin/shared/ImpactItemsEditor";
import type { TeamMemberEntry } from "@/components/admin/shared/TeamMembersEditor";
import type { ContentImageEntry } from "@/components/admin/shared/ContentImagesEditor";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSpecialPageData(key: string, draft: Record<string, string>): Record<string, unknown> {
  if (key !== "hakkimizda") return draft;

  // Vision and mission are still entered as multi-line text fields and
  // stored as arrays. Team and images are managed through their dedicated
  // editors (team[] / heroImage / contentImages) and merged on top of this.
  return {
    title: draft.title,
    intro: draft.intro,
    vision: lines(draft.vision ?? ""),
    mission: lines(draft.mission ?? ""),
  };
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

const textareaCls =
  "w-full min-h-28 rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

/** Which admin section handles a 'special' nav key */
const SPECIAL_MANAGE_LINKS: Record<string, { label: string; href: string }> = {
  bloglar:     { label: "Blog Yazıları Yönetimi",   href: "/editorPanel/blog-posts" },
  etkinlikler: { label: "Etkinlikler Yönetimi",     href: "/editorPanel/events" },
  raporlar:    { label: "Raporlar Yönetimi",         href: "/admin/reports" },
  medya:       { label: "Medya Yönetimi",            href: "/editorPanel/media" },
  iletisim:    { label: "İletişim Mesajları",        href: "/admin/contacts" },
  bagis:       { label: "Bağış & Kampanya Yönetimi", href: "/editorPanel/dashboard" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function MenuItemContentPage() {
  const router = useRouter();
  const params = useParams();
  const menuKey = params.key as string;

  // ── Meta
  const [navItem, setNavItem] = useState<NavItem | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // ── Block draft state
  const [draftTitle, setDraftTitle] = useState("");
  const [draftStatus, setDraftStatus] = useState<"draft" | "published">("draft");
  const [draftSections, setDraftSections] = useState<PageSection[]>([]);
  const [templateType, setTemplateType] = useState<TemplateType>("general");
  const [originalData, setOriginalData] = useState<{
    title: string; status: "draft" | "published";
    sections: PageSection[]; templateType: TemplateType;
  } | null>(null);

  // ── Legacy markdown migration
  const [legacyPage, setLegacyPage] = useState<AdminPage | null>(null);
  const [specialDraft, setSpecialDraft] = useState<Record<string, string>>({});
  const [originalSpecialDraft, setOriginalSpecialDraft] = useState<Record<string, string> | null>(null);
  const [originalSpecialPageData, setOriginalSpecialPageData] = useState<Record<string, unknown> | null>(null);
  // Live mutable copy of structured pageData (faq, impactItems, etc.)
  const [currentSpecialPageData, setCurrentSpecialPageData] = useState<Record<string, unknown> | null>(null);

  // ── UI state
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);

  const specialConfig = getEditablePageConfig(menuKey);
  const contentSlug = navItem?.pageSlug ?? menuKey;
  const previewHref = navItem?.href ?? `/pages/${contentSlug}`;
  const previewSrc = `${previewHref}${previewHref.includes("?") ? "&" : "?"}adminPreview=${previewVersion}`;
  const isCmsPage = Boolean(navItem?.pageSlug && navItem.pageType !== "special" && !specialConfig);
  const isSpecialEditablePage = Boolean(specialConfig);

  // ── Step 1: resolve nav item
  useEffect(() => {
    getNavConfig()
      .then((items) => setNavItem(items.find((i) => i.key === menuKey) ?? null))
      .catch(console.error)
      .finally(() => setLoadingMeta(false));
  }, [menuKey]);

  // ── Step 2: load page content once we have the nav item
  useEffect(() => {
    if (!navItem) return;
    setLoadingContent(true);
    const slug = navItem.pageSlug ?? menuKey;

    (async () => {
      try {
        if (specialConfig) {
          const pageData = await getAdminPageDataBySlug(slug);
          const merged = mergeEditablePageData(menuKey, pageData);
          setSpecialDraft(merged);
          setOriginalSpecialDraft(merged);
          setOriginalSpecialPageData(pageData);
          setCurrentSpecialPageData(pageData);
          return;
        }

        // Try block-based data first
        const blocks = await getPageBlocks(slug);
        if (blocks) {
          setDraftTitle(blocks.sections.length > 0 ? navItem.label : "");
          setDraftSections(blocks.sections);
          setTemplateType(blocks.templateType ?? navItem.templateType ?? "general");
          setDraftStatus("published"); // will be overwritten by actual stored status below
          // Also load the contentItem for status+title
          const legacy = await getAdminPageBySlug(slug);
          if (legacy) {
            setDraftTitle(legacy.title || navItem.label);
            setDraftStatus(legacy.status);
          }
          setOriginalData({
            title: legacy?.title ?? navItem.label,
            status: legacy?.status ?? "draft",
            sections: blocks.sections,
            templateType: blocks.templateType ?? navItem.templateType ?? "general",
          });
        } else {
          // No blocks yet — check for legacy markdown
          const legacy = await getAdminPageBySlug(slug);
          setLegacyPage(legacy);
          setDraftTitle(legacy?.title ?? navItem.label);
          setDraftStatus(legacy?.status ?? "draft");
          setOriginalData({
            title: legacy?.title ?? navItem.label,
            status: legacy?.status ?? "draft",
            sections: [],
            templateType: navItem.templateType ?? "general",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingContent(false);
      }
    })();
  }, [navItem, menuKey]);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

  const handleSectionsChange = useCallback((sections: PageSection[]) => {
    setDraftSections(sections);
    markDirty();
  }, []);

  function handleMigrateToBlocks() {
    if (!legacyPage?.bodyMarkdown) return;
    const migrated: PageSection = {
      id: crypto.randomUUID().slice(0, 8),
      type: "rich-text",
      order: 0,
      data: { markdown: legacyPage.bodyMarkdown },
      visible: true,
    };
    setDraftSections([migrated]);
    setLegacyPage(null);
    markDirty();
  }

  async function handleSave() {
    if (!navItem) return;
    setSaving(true);
    try {
      if (isSpecialEditablePage) {
        const nextPageData = {
          ...(currentSpecialPageData ?? originalSpecialPageData ?? {}),
          ...normalizeSpecialPageData(menuKey, specialDraft),
        };
        await upsertPageContent(contentSlug, nextPageData);
        await revalidatePublicPathAction(previewHref);
        setOriginalSpecialDraft(specialDraft);
        setOriginalSpecialPageData(nextPageData);
        setCurrentSpecialPageData(nextPageData);
        setPreviewVersion((v) => v + 1);
        setSaved(true);
        setDirty(false);
        return;
      }

      if (!navItem.pageSlug) return;
      const blockData: PageBlockData = { templateType, sections: draftSections };
      await savePageBlocks(navItem.pageSlug, draftTitle, blockData, draftStatus);
      // Mirror the page status on the nav item so the public navbar can hide
      // draft pages.
      await patchNavItem(navItem.key, { pageStatus: draftStatus });
      await revalidatePageAction(navItem.pageSlug);
      await revalidatePublicPathAction(previewHref);
      await revalidatePublicPathAction("/");
      setPreviewVersion((v) => v + 1);
      setOriginalData({ title: draftTitle, status: draftStatus, sections: draftSections, templateType });
      setSaved(true);
      setDirty(false);
    } catch (err) {
      console.error(err);
      alert("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    if (isSpecialEditablePage && originalSpecialDraft) {
      setSpecialDraft(originalSpecialDraft);
      setCurrentSpecialPageData(originalSpecialPageData);
      setDirty(false);
      setSaved(false);
      return;
    }

    if (!originalData) return;
    setDraftTitle(originalData.title);
    setDraftStatus(originalData.status);
    setDraftSections(originalData.sections);
    setTemplateType(originalData.templateType);
    setDirty(false);
    setSaved(false);
  }

  // ── Loading skeleton
  if (loadingMeta) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  // ── Nav item not found
  if (!navItem) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-600">
          <span className="font-semibold">"{menuKey}"</span> anahtarına sahip menü öğesi bulunamadı.
        </p>
        <button
          onClick={() => router.push("/admin/menu")}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Menü Yönetimine Dön
        </button>
      </div>
    );
  }

  // ── Unsupported special page — show info card
  if (!isCmsPage && !isSpecialEditablePage) {
    const link = SPECIAL_MANAGE_LINKS[navItem.key];
    return (
      <div className="space-y-6">
        <Breadcrumb label={navItem.label} onBack={() => router.push("/admin/menu")} />
        <div className="flex flex-col items-center gap-4 rounded-xl border border-amber-200 bg-amber-50 py-14 text-center">
          <Layers className="h-9 w-9 text-amber-400" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-800">
              Bu menü öğesi kendi yönetim alanından yönetilmektedir.
            </p>
            <p className="text-sm text-amber-700">
              <span className="font-mono rounded bg-amber-100 px-1">{navItem.label}</span>{" "}
              içeriği blok editörü dışında, özel panelinden düzenlenir.
            </p>
          </div>
          {link && (
            <a
              href={link.href}
              className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              <ExternalLink className="h-4 w-4" />
              {link.label}
            </a>
          )}
          <button
            onClick={() => router.push("/admin/menu")}
            className="flex items-center gap-2 text-sm text-amber-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Menü Yönetimine Dön
          </button>
        </div>
      </div>
    );
  }

  if (isSpecialEditablePage && specialConfig) {
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <button
              onClick={() => router.push("/admin/menu")}
              className="mt-0.5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs text-gray-400">
                <button onClick={() => router.push("/admin/menu")} className="hover:text-teal-600 hover:underline">
                  Menü Yönetimi
                </button>
                {" / "}<span className="text-gray-600">{navItem.label}</span>
              </p>
              <h1 className="text-xl font-bold text-gray-900">{navItem.label}</h1>
              <p className="text-xs text-gray-400">
                Public URL:{" "}
                <span className="font-mono text-gray-600">{previewHref}</span>
                {" · "}
                <a
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  Sayfayı görüntüle ↗
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setPreviewMode((p) => !p)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                previewMode
                  ? "border-teal-300 bg-teal-50 text-teal-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "Önizlemeyi Kapat" : "Önizle"}
            </button>

            {dirty && (
              <button
                onClick={handleDiscard}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
              >
                Geri Al
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? "Kaydediliyor…" : saved ? "Kaydedildi ✓" : "Kaydet"}
            </button>
          </div>
        </div>

        {loadingContent ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className={previewMode ? "grid grid-cols-2 gap-4" : ""}>
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    İçerik Blokları
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Bu alanlar public sayfadaki mevcut bölümlere bağlıdır.
                  </p>
                </div>

                <div className="space-y-4">
                  {specialConfig.fields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {field.label}
                      </span>
                      {field.type === "textarea" ? (
                        <textarea
                          className={textareaCls}
                          value={specialDraft[field.name] ?? ""}
                          onChange={(e) => {
                            setSpecialDraft((prev) => ({ ...prev, [field.name]: e.target.value }));
                            markDirty();
                          }}
                        />
                      ) : (
                        <input
                          className={inputCls}
                          value={specialDraft[field.name] ?? ""}
                          onChange={(e) => {
                            setSpecialDraft((prev) => ({ ...prev, [field.name]: e.target.value }));
                            markDirty();
                          }}
                        />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {navItem.key === "bloglar" && <InlineBlogManager />}
              {navItem.key === "etkinlikler" && <InlineEventManager />}
              {navItem.key === "medya" && <InlineMediaManager />}
              {navItem.key === "bagis" && (
                <>
                  <InlineCampaignManager />
                  <InlineImpactManager
                    items={
                      (currentSpecialPageData?.impactItems as ImpactItemEntry[] | undefined) ?? []
                    }
                    onChange={(next) => {
                      setCurrentSpecialPageData((prev) => ({
                        ...(prev ?? {}),
                        impactItems: next,
                      }));
                      markDirty();
                    }}
                  />
                </>
              )}
              {navItem.key === "iletisim" && (
                <InlineFaqManager
                  items={
                    (currentSpecialPageData?.faq as FaqItemEntry[] | undefined) ?? []
                  }
                  onChange={(next) => {
                    setCurrentSpecialPageData((prev) => ({
                      ...(prev ?? {}),
                      faq: next,
                    }));
                    markDirty();
                  }}
                />
              )}
              {navItem.key === "hakkimizda" && (
                <InlineHakkimizdaManager
                  heroImage={(currentSpecialPageData?.heroImage as string | undefined) ?? ""}
                  onHeroImageChange={(url) => {
                    setCurrentSpecialPageData((prev) => ({
                      ...(prev ?? {}),
                      heroImage: url,
                    }));
                    markDirty();
                  }}
                  team={
                    (currentSpecialPageData?.team as TeamMemberEntry[] | undefined) ?? []
                  }
                  onTeamChange={(next) => {
                    setCurrentSpecialPageData((prev) => ({
                      ...(prev ?? {}),
                      team: next,
                    }));
                    markDirty();
                  }}
                  contentImages={
                    (currentSpecialPageData?.contentImages as ContentImageEntry[] | undefined) ?? []
                  }
                  onContentImagesChange={(next) => {
                    setCurrentSpecialPageData((prev) => ({
                      ...(prev ?? {}),
                      contentImages: next,
                    }));
                    markDirty();
                  }}
                />
              )}
              {SPECIAL_MANAGE_LINKS[navItem.key] && !["bloglar", "etkinlikler", "medya", "bagis", "iletisim"].includes(navItem.key) && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Liste/kart verileri ayrı koleksiyonlardan gelir.{" "}
                  <a
                    href={SPECIAL_MANAGE_LINKS[navItem.key].href}
                    className="font-medium text-amber-700 underline"
                  >
                    {SPECIAL_MANAGE_LINKS[navItem.key].label}
                  </a>{" "}
                  ekranından yönetebilirsiniz.
                </div>
              )}
            </div>

            {previewMode && (
              <LiveRoutePreview src={previewSrc} href={previewHref} />
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Full block editor
  return (
    <div className="space-y-5">
      {/* ── Top bar */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push("/admin/menu")}
            className="mt-0.5 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-gray-400">
              <button onClick={() => router.push("/admin/menu")} className="hover:text-teal-600 hover:underline">
                Menü Yönetimi
              </button>
              {" / "}<span className="text-gray-600">{navItem.label}</span>
            </p>
            <h1 className="text-xl font-bold text-gray-900">{navItem.label}</h1>
            <p className="text-xs text-gray-400">
              Slug:{" "}
              <span className="font-mono text-gray-600">/{navItem.pageSlug}</span>
              {" · "}
              <a
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                Sayfayı görüntüle ↗
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preview toggle */}
          <button
            onClick={() => setPreviewMode((p) => !p)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
              previewMode
                ? "border-teal-300 bg-teal-50 text-teal-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {previewMode ? "Önizlemeyi Kapat" : "Önizle"}
          </button>

          {/* Status badge */}
          {!loadingContent && (
            <select
              value={draftStatus}
              onChange={(e) => { setDraftStatus(e.target.value as "draft" | "published"); markDirty(); }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
            </select>
          )}

          {/* Discard */}
          {dirty && (
            <button
              onClick={handleDiscard}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
            >
              Geri Al
            </button>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {saving ? "Kaydediliyor…" : saved ? "Kaydedildi ✓" : "Kaydet"}
          </button>
        </div>
      </div>

      {/* ── Loading skeleton */}
      {loadingContent ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Legacy migration banner */}
          {legacyPage?.bodyMarkdown && draftSections.length === 0 && (
            <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
              <WandSparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
              <div className="flex-1">
                <p className="font-semibold text-blue-800">Mevcut Markdown içerik tespit edildi</p>
                <p className="mt-0.5 text-sm text-blue-700">
                  Bu sayfa daha önce düz metin olarak yazıldı. Tek tıkla blok editörüne taşıyabilirsiniz.
                  Mevcut metin bir <strong>Metin İçeriği</strong> bloğuna dönüştürülecek.
                </p>
              </div>
              <button
                onClick={handleMigrateToBlocks}
                className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Blok Editörüne Taşı
              </button>
            </div>
          )}

          {/* ── Title field */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sayfa Başlığı
            </label>
            <input
              className={inputCls}
              value={draftTitle}
              placeholder={navItem.label}
              onChange={(e) => { setDraftTitle(e.target.value); markDirty(); }}
            />
          </div>

          {/* ── Editor + Preview layout */}
          <div className={previewMode ? "grid grid-cols-2 gap-4" : ""}>
            {/* Left: canvas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  İçerik Blokları
                </p>
                <span className="text-xs text-gray-400">{draftSections.length} blok</span>
              </div>
              <BlockEditorCanvas
                sections={draftSections}
                onChange={handleSectionsChange}
              />
            </div>

            {/* Right: preview (only when previewMode is on) */}
            {previewMode && (
              <LiveRoutePreview src={previewSrc} href={previewHref} />
            )}
          </div>

          {/* ── Meta info */}
          {!dirty && originalData && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FileText className="h-3.5 w-3.5" />
              <span>Son kayıt: {originalData.sections.length} blok · durum: {draftStatus === "published" ? "Yayında" : "Taslak"}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function Breadcrumb({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <p className="text-sm text-gray-500">
      <button onClick={onBack} className="hover:text-teal-600 hover:underline">
        Menü Yönetimi
      </button>
      {" / "}
      <span className="font-medium text-gray-700">{label}</span>
    </p>
  );
}

function LiveRoutePreview({ src, href }: { src: string; href: string }) {
  return (
    <div
      className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
        <Eye className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">Canlı Önizleme</span>
        <span className="truncate font-mono text-[10px] text-gray-300">{href}</span>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[10px] font-medium text-teal-600 hover:underline"
        >
          Yeni sekmede aç
        </a>
      </div>
      <iframe
        key={src}
        src={src}
        title={`${href} önizleme`}
        className="h-[calc(100%-36px)] w-full bg-white"
      />
    </div>
  );
}
