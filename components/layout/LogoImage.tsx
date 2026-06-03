"use client";

/**
 * LogoImage — renders the site logo dynamically.
 *
 * Reads the current LogoSettings from LogoProvider (which is kept in sync by
 * both the server-rendered initial value and live admin-preview events).
 *
 * Responsive strategy:
 * - Desktop (≥ md): applies the admin-configured x/y translate offset.
 * - Mobile (< md):  ignores the offset entirely so the logo stays in
 *   normal document flow and cannot break small-screen layouts.
 *
 * Fallback: when no custom logo_url is stored yet, the original inline SVG is
 * rendered unchanged — zero visual regression with no Firestore data.
 */

import { useLogo } from "@/components/layout/LogoProvider";

interface LogoImageProps {
  slot: "header" | "footer";
  className?: string;
  /** Accepted for forward-compatibility but not used — LogoProvider is the source of truth. */
  initial?: ReturnType<typeof useLogo>;
}

function FallbackSvg({ slot, className }: { slot: "header" | "footer"; className?: string }) {
  if (slot === "header") {
    return (
      <svg
        width="120" height="60" viewBox="0 0 120 60"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        className={className ?? "h-14 w-auto"}
      >
        <path d="M5 10 H25 V5 H30 M5 15 H20 V20 H25 M5 20 H15" stroke="#1d4ed8" strokeWidth="2" fill="none" />
        <circle cx="30" cy="5" r="2" fill="#1d4ed8" />
        <circle cx="25" cy="20" r="2" fill="#1d4ed8" />
        <circle cx="15" cy="20" r="2" fill="#1d4ed8" />
        <text x="35" y="35" fontSize="32" fontWeight="bold" fill="#1d4ed8">MG</text>
        <text x="5" y="45" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#1d4ed8">MYASTHENİA GRAVİS</text>
        <text x="5" y="55" fontFamily="Arial, sans-serif" fontSize="8" fill="#E11D48">YAŞAM DERNEĞİ</text>
      </svg>
    );
  }
  return (
    <svg
      width="140" height="70" viewBox="0 0 140 70"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className ?? "h-20 w-auto"}
    >
      <path d="M15 15 H35 V10 H40 M15 20 H30 V25 H35 M15 25 H25" stroke="#1d4ed8" strokeWidth="2" fill="none" />
      <circle cx="40" cy="10" r="2" fill="#1d4ed8" />
      <circle cx="35" cy="25" r="2" fill="#1d4ed8" />
      <circle cx="25" cy="25" r="2" fill="#1d4ed8" />
      <text x="45" y="40" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="#1d4ed8">MG</text>
      <text x="15" y="52" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="bold" fill="#1d4ed8">MYASTHENİA GRAVİS</text>
      <text x="15" y="63" fontFamily="Arial, sans-serif" fontSize="9" fill="#E11D48">YAŞAM DERNEĞİ</text>
    </svg>
  );
}

export function LogoImage({ slot, className }: LogoImageProps) {
  // LogoProvider keeps this in sync: server value → Firestore re-fetch → live preview events
  const settings = useLogo();

  if (!settings?.logo_url) {
    return <FallbackSvg slot={slot} className={className} />;
  }

  const pos = slot === "header"
    ? settings.header_logo_position
    : settings.footer_logo_position;

  const imgClass = className ?? (slot === "header" ? "h-14 w-auto" : "h-20 w-auto");
  const desktopStyle =
    pos.x !== 0 || pos.y !== 0
      ? { transform: `translate(${pos.x}px, ${pos.y}px)` }
      : undefined;

  return (
    <>
      {/* Desktop: apply stored position offset */}
      <img
        src={settings.logo_url}
        alt={settings.logo_alt || "Logo"}
        draggable={false}
        className={`hidden md:block ${imgClass}`}
        style={desktopStyle}
      />
      {/* Mobile: render without any transform to keep normal flow */}
      <img
        src={settings.logo_url}
        alt={settings.logo_alt || "Logo"}
        draggable={false}
        className={`md:hidden ${imgClass}`}
      />
    </>
  );
}
