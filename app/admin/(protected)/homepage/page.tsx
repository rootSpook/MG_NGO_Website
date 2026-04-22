"use client";

import { useEffect, useState } from "react";
import { getHomePageData } from "@/lib/publicPagesContent";
import { upsertPageContent } from "@/lib/firebase/adminServices";
import type { HomePageData } from "@/lib/publicPagesContent";

type Status = "idle" | "saving" | "saved" | "error";

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
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";
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
    getHomePageData().then(setData).catch(console.error);
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

  function setQuickLink(
    index: number,
    field: keyof HomePageData["quickLinks"][number],
    value: string
  ) {
    setData((prev) => {
      if (!prev) return prev;
      const quickLinks = prev.quickLinks.map((ql, i) =>
        i === index ? { ...ql, [field]: value } : ql
      );
      return { ...prev, quickLinks };
    });
  }

  async function handleSave() {
    if (!data) return;
    setStatus("saving");
    setErrorMsg("");
    try {
      await upsertPageContent("anasayfa", data as unknown as Record<string, unknown>);
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
          className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {status === "saving" ? "Kaydediliyor…" : status === "saved" ? "✓ Kaydedildi" : "Kaydet"}
        </button>
      </div>

      {errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

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

      <SectionCard title="Hızlı Bağlantılar">
        {data.quickLinks.map((ql, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Bağlantı {i + 1}
            </p>
            <div className="space-y-3">
              <Field label="Başlık" value={ql.title} onChange={(v) => setQuickLink(i, "title", v)} />
              <Field label="Açıklama" value={ql.description} onChange={(v) => setQuickLink(i, "description", v)} multiline />
              <Field label="Link" value={ql.href} onChange={(v) => setQuickLink(i, "href", v)} />
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
