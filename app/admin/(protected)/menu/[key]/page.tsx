"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Check, AlertCircle, FileText, Eye, EyeOff,
  Layers, WandSparkles, ExternalLink,
} from "lucide-react";
import { getNavConfig, type NavItem } from "@/lib/firebase/navServices";
import {
  getPageBlocks, savePageBlocks,
  getAdminPageBySlug, type AdminPage,
} from "@/lib/firebase/adminServices";
import { revalidatePageAction } from "@/app/admin/actions";
import { BlockEditorCanvas } from "@/components/admin/pageBuilder/BlockEditorCanvas";
import { PagePreview } from "@/components/admin/pageBuilder/PagePreview";
import type { PageSection, TemplateType, PageBlockData } from "@/types/pageBuilder";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

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

  // ── UI state
  const [loadingContent, setLoadingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // ── Step 1: resolve nav item
  useEffect(() => {
    getNavConfig()
      .then((items) => setNavItem(items.find((i) => i.key === menuKey) ?? null))
      .catch(console.error)
      .finally(() => setLoadingMeta(false));
  }, [menuKey]);

  // ── Step 2: load page blocks once we have the nav item
  useEffect(() => {
    if (!navItem?.pageSlug) return;
    setLoadingContent(true);
    const slug = navItem.pageSlug;

    (async () => {
      try {
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
  }, [navItem]);

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
    if (!navItem?.pageSlug) return;
    setSaving(true);
    try {
      const blockData: PageBlockData = { templateType, sections: draftSections };
      await savePageBlocks(navItem.pageSlug, draftTitle, blockData, draftStatus);
      await revalidatePageAction(navItem.pageSlug);
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

  // ── Special page (no CMS slug) — show info card
  const isCmsPage = Boolean(navItem.pageSlug);
  if (!isCmsPage) {
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
              <button onClick={() => router.push("/admin/menu")} className="hover:text-primary hover:underline">
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
                href={`/pages/${navItem.pageSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
                ? "border-primary bg-secondary/50 text-primary"
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
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-50"
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
              <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                   style={{ height: "calc(100vh - 200px)" }}>
                <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
                  <Eye className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Canlı Önizleme</span>
                  <span className="ml-auto text-[10px] text-gray-300">pointer-events devre dışı</span>
                </div>
                <div className="h-[calc(100%-36px)]">
                  <PagePreview sections={draftSections} />
                </div>
              </div>
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
      <button onClick={onBack} className="hover:text-primary hover:underline">
        Menü Yönetimi
      </button>
      {" / "}
      <span className="font-medium text-gray-700">{label}</span>
    </p>
  );
}
