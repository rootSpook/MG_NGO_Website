"use client";

import { useEffect, useState } from "react";
import { getHomePageData } from "@/lib/publicPagesContent";
import { upsertPageContent } from "@/lib/firebase/adminServices";
import { revalidatePublicPathAction } from "@/app/admin/actions";
import type { HomePageData, HomeQuickLink } from "@/lib/publicPagesContent";
import { ArrowRight, Eye, ExternalLink, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { IconPicker, getImpactIcon } from "@/components/admin/shared/IconPicker";

type Status = "idle" | "saving" | "saved" | "error";

function makeQuickLinkId() {
  return `ql-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          className={`${cls} resize-none`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function HomepageContentPage() {
  const [data, setData] = useState<HomePageData | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getHomePageData()
      .then((next) => {
        // Normalise quickLinks so every entry has a stable id we can key against.
        setData({
          ...next,
          quickLinks: next.quickLinks.map((ql) => ({
            ...ql,
            id: ql.id || makeQuickLinkId(),
          })),
        });
      })
      .catch(console.error);
  }, []);

  function setHero(field: keyof HomePageData["hero"], value: string) {
    setData((prev) =>
      prev ? { ...prev, hero: { ...prev.hero, [field]: value } } : prev
    );
  }

  function setAbout(field: keyof HomePageData["about"], value: string) {
    setData((prev) =>
      prev ? { ...prev, about: { ...prev.about, [field]: value } } : prev
    );
  }

  function setQuickLinksTitle(value: string) {
    setData((prev) => (prev ? { ...prev, quickLinksTitle: value } : prev));
  }

  function updateQuickLink(id: string, patch: Partial<HomeQuickLink>) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        quickLinks: prev.quickLinks.map((ql) =>
          ql.id === id ? { ...ql, ...patch } : ql
        ),
      };
    });
  }

  function moveQuickLink(id: string, dir: "up" | "down") {
    setData((prev) => {
      if (!prev) return prev;
      const idx = prev.quickLinks.findIndex((ql) => ql.id === id);
      if (idx < 0) return prev;
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= prev.quickLinks.length) return prev;
      const next = [...prev.quickLinks];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...prev, quickLinks: next };
    });
  }

  function removeQuickLink(id: string) {
    setData((prev) =>
      prev
        ? { ...prev, quickLinks: prev.quickLinks.filter((ql) => ql.id !== id) }
        : prev
    );
  }

  function addQuickLink() {
    setData((prev) =>
      prev
        ? {
            ...prev,
            quickLinks: [
              ...prev.quickLinks,
              {
                id: makeQuickLinkId(),
                icon: "sparkles",
                title: "Yeni Kısayol",
                description: "Açıklama",
                href: "#",
              },
            ],
          }
        : prev
    );
  }

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    setErrorMsg("");
    try {
      await upsertPageContent(
        "anasayfa",
        data as unknown as Record<string, unknown>
      );
      await revalidatePublicPathAction("/");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Kaydetme başarısız.");
      setStatus("error");
    }
  }

  if (!data) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Yükleniyor…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa İçeriği</h1>
          <p className="mt-1 text-sm text-gray-500">
            Değişiklikler kaydedildikten sonra ana sayfada yansır.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-60"
        >
          {status === "saving"
            ? "Kaydediliyor…"
            : status === "saved"
            ? "✓ Kaydedildi"
            : "Kaydet"}
        </button>
      </div>

      {errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
        <div className="space-y-6">
          <SectionCard title="Hero Bölümü">
            <Field label="Başlık" value={data.hero.title} onChange={(v) => setHero("title", v)} multiline />
            <Field label="Açıklama" value={data.hero.description} onChange={(v) => setHero("description", v)} multiline />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Buton Metni" value={data.hero.ctaLabel} onChange={(v) => setHero("ctaLabel", v)} />
              <Field label="Buton Linki" value={data.hero.ctaHref} onChange={(v) => setHero("ctaHref", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Hakkımızda Bölümü">
            <Field label="Başlık" value={data.about.title} onChange={(v) => setAbout("title", v)} />
            <Field label="Açıklama" value={data.about.description} onChange={(v) => setAbout("description", v)} multiline />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Buton Metni" value={data.about.ctaLabel} onChange={(v) => setAbout("ctaLabel", v)} />
              <Field label="Buton Linki" value={data.about.ctaHref} onChange={(v) => setAbout("ctaHref", v)} />
            </div>
          </SectionCard>

          <SectionCard title="Kaynaklarımızı Keşfedin (Hızlı Bağlantılar)">
            <Field
              label="Bölüm Başlığı"
              value={data.quickLinksTitle ?? "Kaynaklarımızı Keşfedin"}
              onChange={setQuickLinksTitle}
            />

            <div className="space-y-3">
              {data.quickLinks.map((ql, idx) => (
                <div
                  key={ql.id}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500 border border-gray-200">
                      Kısayol #{idx + 1}
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveQuickLink(ql.id, "up")}
                        disabled={idx === 0}
                        className="rounded p-1 text-gray-400 hover:bg-white disabled:opacity-30"
                        title="Yukarı taşı"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuickLink(ql.id, "down")}
                        disabled={idx === data.quickLinks.length - 1}
                        className="rounded p-1 text-gray-400 hover:bg-white disabled:opacity-30"
                        title="Aşağı taşı"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeQuickLink(ql.id)}
                        className="rounded p-1 text-red-400 hover:bg-red-50"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Field
                      label="Başlık"
                      value={ql.title}
                      onChange={(v) => updateQuickLink(ql.id, { title: v })}
                    />
                    <Field
                      label="Açıklama"
                      value={ql.description}
                      onChange={(v) => updateQuickLink(ql.id, { description: v })}
                      multiline
                    />
                    <Field
                      label="Link"
                      value={ql.href}
                      onChange={(v) => updateQuickLink(ql.id, { href: v })}
                    />
                    <IconPicker
                      label="Sembol"
                      value={ql.icon}
                      onChange={(icon) => updateQuickLink(ql.id, { icon })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addQuickLink}
              className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-100"
            >
              <Plus className="h-4 w-4" />
              Kısayol Ekle
            </button>
          </SectionCard>
        </div>

        <div className="sticky top-5 h-[calc(100vh-120px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2">
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Anlık Önizleme</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-[10px] font-medium text-teal-600 hover:underline"
            >
              Public sayfa <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="h-[calc(100%-36px)] overflow-y-auto bg-white">
            <HomeDraftPreview data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mirrors the public homepage layout so admins can see exactly what the
 * page will look like as they edit. Visual fidelity matches `app/page.tsx`.
 */
function HomeDraftPreview({ data }: { data: HomePageData }) {
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-14 text-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <h1 className="mx-auto max-w-3xl text-2xl font-bold text-white md:text-3xl">
            {data.hero.title || "Hero başlığı…"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90">
            {data.hero.description || "Hero açıklaması…"}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 rounded-md bg-white px-4 py-2 text-xs font-medium text-teal-700">
            {data.hero.ctaLabel || "Buton metni"}
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </section>

      {/* About */}
      <section className="px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-xl font-bold text-teal-600 md:text-2xl">
              {data.about.title || "Hakkımızda başlığı"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {data.about.description || "Hakkımızda açıklaması…"}
            </p>
            <span className="mt-4 inline-block rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white">
              {data.about.ctaLabel || "Daha fazla"}
            </span>
          </div>
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="h-32 w-32 md:h-40 md:w-40">
              <path
                d="M100 20 C150 20, 180 70, 180 100 C180 150, 130 180, 100 180 C50 180, 20 130, 20 100 C20 50, 70 20, 100 20"
                fill="none"
                stroke="#0D9488"
                strokeWidth="8"
                className="opacity-30"
              />
              <path
                d="M100 40 L100 80 M80 100 L120 100 M100 120 L100 160"
                stroke="#0D9488"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-gray-50 px-6 py-10">
        <h2 className="mb-6 text-center text-xl font-bold text-teal-600 md:text-2xl">
          {data.quickLinksTitle || "Kaynaklarımızı Keşfedin"}
        </h2>
        {data.quickLinks.length === 0 ? (
          <p className="text-center text-xs text-gray-400">
            Henüz kısayol eklenmedi.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {data.quickLinks.map((link) => {
              const Icon = getImpactIcon(link.icon);
              return (
                <article
                  key={link.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {link.title || "Başlık"}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    {link.description || "Açıklama"}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
