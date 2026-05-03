"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, Save, RotateCcw, GripVertical, LayoutList,
  Plus, X, ArrowLeft, ArrowRight, Check,
  Newspaper, CalendarDays, ClipboardList, BookOpen, Layers,
} from "lucide-react";
import {
  DEFAULT_NAV_ITEMS, getNavConfig, saveNavConfig, createNavItem,
  type NavItem,
} from "@/lib/firebase/navServices";
import { savePageBlocks } from "@/lib/firebase/adminServices";
import {
  seedSectionsForTemplate, TEMPLATE_LABELS,
  type TemplateType,
} from "@/types/pageBuilder";

// ── Turkish slugify ───────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Template picker data ──────────────────────────────────────────────────────

const TEMPLATES: Array<{
  type: TemplateType;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  { type: "general",      icon: Newspaper,      description: "Hero + Metin bloğu" },
  { type: "event-hub",    icon: CalendarDays,   description: "Hero + Etkinlik ızgarası" },
  { type: "report-list",  icon: ClipboardList,  description: "Hero + Rapor listesi" },
  { type: "blog-hub",     icon: BookOpen,        description: "Hero + Blog bağlantısı" },
  { type: "custom",       icon: Layers,          description: "Boş sayfa — tüm blokları kendiniz ekleyin" },
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MenuManagementPage() {
  const router = useRouter();
  const [items, setItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [wizardLabel, setWizardLabel] = useState("");
  const [wizardKey, setWizardKey] = useState("");
  const [wizardKeyEdited, setWizardKeyEdited] = useState(false);
  const [wizardTemplate, setWizardTemplate] = useState<TemplateType | null>(null);
  const [wizardSaving, setWizardSaving] = useState(false);

  useEffect(() => {
    getNavConfig()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Nav list actions ──────────────────────────────────────────────────────

  function toggleVisibility(key: string) {
    setItems((prev) => prev.map((item) => item.key === key ? { ...item, isVisible: !item.isVisible } : item));
    setSaved(false);
  }

  function moveItem(index: number, direction: "up" | "down") {
    const next = [...items];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    next.forEach((item, i) => { item.sortOrder = i + 1; });
    setItems(next);
    setSaved(false);
  }

  function handleReset() {
    setItems(DEFAULT_NAV_ITEMS.map((item, i) => ({ ...item, sortOrder: i + 1 })));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveNavConfig(items);
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  // ── Wizard actions ────────────────────────────────────────────────────────

  function openWizard() {
    setWizardStep(1);
    setWizardLabel("");
    setWizardKey("");
    setWizardKeyEdited(false);
    setWizardTemplate(null);
    setWizardOpen(true);
  }

  function closeWizard() {
    setWizardOpen(false);
  }

  function handleLabelChange(val: string) {
    setWizardLabel(val);
    if (!wizardKeyEdited) setWizardKey(slugify(val));
  }

  const keyConflict = items.some((i) => i.key === wizardKey);
  const step1Valid = wizardLabel.trim().length > 0 && wizardKey.trim().length > 0 && !keyConflict;
  const step2Valid = wizardTemplate !== null;

  async function handleWizardCreate() {
    if (!wizardTemplate || !wizardKey || !wizardLabel) return;
    setWizardSaving(true);
    try {
      const newItem: NavItem = {
        key: wizardKey,
        href: `/pages/${wizardKey}`,
        label: wizardLabel,
        isVisible: true,
        sortOrder: 0,
        pageType: "cms",
        templateType: wizardTemplate,
        pageSlug: wizardKey,
      };
      await createNavItem(newItem);
      await savePageBlocks(wizardKey, wizardLabel, {
        templateType: wizardTemplate,
        sections: seedSectionsForTemplate(wizardTemplate),
      }, "draft");
      // Refresh local items
      const updated = await getNavConfig();
      setItems(updated);
      closeWizard();
      router.push(`/admin/menu/${wizardKey}`);
    } catch (err) {
      console.error(err);
      alert("Sayfa oluşturulurken bir hata oluştu.");
    } finally {
      setWizardSaving(false);
    }
  }

  const visibleCount = items.filter((i) => i.isVisible).length;

  return (
    <div className="space-y-6">
      {/* ── Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-500">
            Navigasyon öğelerini yönetin veya yeni bir CMS sayfası oluşturun.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap shrink-0">
          <button
            onClick={openWizard}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            <Plus className="h-4 w-4" />
            Yeni Sayfa Ekle
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Varsayılan
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-primary bg-white px-3 py-2 text-sm font-medium text-primary hover:bg-secondary/50 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Kaydediliyor…" : saved ? "Kaydedildi ✓" : "Sıralamayı Kaydet"}
          </button>
        </div>
      </div>

      {/* ── Summary banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        <span className="font-semibold">{visibleCount}</span> / {items.length} menü öğesi görünür.
        {visibleCount === 0 && (
          <span className="ml-2 font-medium text-red-600">
            Uyarı: Tüm öğeler gizlendi!
          </span>
        )}
      </div>

      {/* ── Nav items list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-colors ${
                item.isVisible ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem(index, "up")} disabled={index === 0}
                  className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
                  <GripVertical className="h-4 w-4 rotate-90" />
                </button>
                <button onClick={() => moveItem(index, "down")} disabled={index === items.length - 1}
                  className="rounded p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20">
                  <GripVertical className="h-4 w-4 -rotate-90" />
                </button>
              </div>

              {/* Order badge */}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                {index + 1}
              </span>

              {/* Label + href */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  {item.label}
                  {item.isDonateButton && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">Buton</span>
                  )}
                  {item.pageType === "cms" && (
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">CMS</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{item.href}</p>
              </div>

              {/* Visibility badge */}
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                item.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {item.isVisible ? "Görünür" : "Gizli"}
              </span>

              {/* Manage content — for any item with a linked page */}
              {item.pageSlug && (
                <button
                  onClick={() => router.push(`/admin/menu/${item.key}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-primary px-3 py-1.5 text-sm text-primary hover:bg-secondary/50"
                >
                  <LayoutList className="h-4 w-4" />
                  İçeriği Yönet
                </button>
              )}

              {/* Visibility toggle */}
              <button
                onClick={() => toggleVisibility(item.key)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  item.isVisible
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }`}
              >
                {item.isVisible ? <><EyeOff className="h-4 w-4" />Gizle</> : <><Eye className="h-4 w-4" />Göster</>}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Help note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-semibold mb-1">Önemli Notlar:</p>
        <ul className="list-disc list-inside space-y-1 text-amber-700">
          <li>Gizlenen öğeler URL ile hâlâ erişilebilir; yalnızca menüden kaldırılır.</li>
          <li>Sıralama değişiklikleri "Sıralamayı Kaydet" butonuyla uygulanır.</li>
          <li><strong>CMS</strong> rozeti, blok editörüyle yönetilen sayfaları gösterir.</li>
        </ul>
      </div>

      {/* ── 3-Step Wizard Modal */}
      {wizardOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeWizard(); }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Wizard header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Yeni Sayfa Oluştur</h2>
                <div className="mt-1 flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`h-1.5 w-8 rounded-full transition-colors ${
                      wizardStep >= s ? "bg-secondary/500" : "bg-gray-200"
                    }`} />
                  ))}
                  <span className="ml-1 text-xs text-gray-400">Adım {wizardStep} / 3</span>
                </div>
              </div>
              <button onClick={closeWizard} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Step 1: Basic info */}
            {wizardStep === 1 && (
              <div className="px-6 py-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Sayfa bilgilerini girin</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Menü Etiketi
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="örn. Parkinson Farkındalık"
                    value={wizardLabel}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    URL Anahtarı (slug)
                  </label>
                  <div className="flex items-center gap-0">
                    <span className="flex h-9 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      /pages/
                    </span>
                    <input
                      className="flex-1 rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      value={wizardKey}
                      onChange={(e) => {
                        setWizardKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                        setWizardKeyEdited(true);
                      }}
                    />
                  </div>
                  {keyConflict && wizardKey && (
                    <p className="mt-1 text-xs text-red-500">Bu anahtar zaten kullanılıyor.</p>
                  )}
                  {!keyConflict && wizardKey && (
                    <p className="mt-1 text-xs text-gray-400">
                      Sayfa URL'si: <span className="font-mono text-gray-600">/pages/{wizardKey}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2: Template */}
            {wizardStep === 2 && (
              <div className="px-6 py-6 space-y-4">
                <p className="text-sm font-semibold text-gray-700">Sayfa şablonu seçin</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {TEMPLATES.map(({ type, icon: Icon, description }) => (
                    <button
                      key={type}
                      onClick={() => setWizardTemplate(type)}
                      className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
                        wizardTemplate === type
                          ? "border-primary bg-secondary/50 ring-1 ring-primary"
                          : "border-gray-200 hover:border-primary hover:bg-secondary/50/40"
                      }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        wizardTemplate === type ? "bg-secondary" : "bg-gray-100"
                      }`}>
                        <Icon className={`h-5 w-5 ${wizardTemplate === type ? "text-primary" : "text-gray-500"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${wizardTemplate === type ? "text-primary" : "text-gray-700"}`}>
                          {TEMPLATE_LABELS[type]}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
                      </div>
                      {wizardTemplate === type && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-primary-foreground/900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Confirmation */}
            {wizardStep === 3 && wizardTemplate && (
              <div className="px-6 py-6 space-y-5">
                <p className="text-sm font-semibold text-gray-700">Oluşturulacak sayfa özeti</p>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                  <Row label="Menü etiketi" value={wizardLabel} />
                  <Row label="Sayfa URL'si" value={`/pages/${wizardKey}`} mono />
                  <Row label="Şablon" value={TEMPLATE_LABELS[wizardTemplate]} />
                  <Row
                    label="Başlangıç blokları"
                    value={`${seedSectionsForTemplate(wizardTemplate).length} blok`}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Sayfa <strong>Taslak</strong> olarak oluşturulacak. İçeriği düzenleyip yayınlayabilirsiniz.
                </p>
              </div>
            )}

            {/* Wizard footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <button
                onClick={wizardStep === 1 ? closeWizard : () => setWizardStep((s) => (s - 1) as 1 | 2 | 3)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                {wizardStep === 1 ? "İptal" : "Geri"}
              </button>

              {wizardStep < 3 ? (
                <button
                  disabled={(wizardStep === 1 && !step1Valid) || (wizardStep === 2 && !step2Valid)}
                  onClick={() => setWizardStep((s) => (s + 1) as 2 | 3)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-50"
                >
                  İleri
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleWizardCreate}
                  disabled={wizardSaving}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  {wizardSaving ? "Oluşturuluyor…" : "Sayfayı Oluştur"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Summary row helper ────────────────────────────────────────────────────────

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-800 ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
