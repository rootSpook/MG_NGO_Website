"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useNav } from "@/components/layout/NavProvider"
import { useLogo } from "@/components/layout/LogoProvider"
import type { NavItem } from "@/lib/firebase/navServices"

/**
 * Renders the public site header with dynamic navigation links.
 *
 * Navigation data is provided by NavProvider (in the root layout), which
 * server-fetches the live Firestore config on every request and caches it for
 * 60 s.  The provider also re-validates client-side after hydration, so
 * in-session admin changes propagate without a full reload.
 *
 * This component no longer manages its own nav state or Firestore fetches —
 * eliminating the DEFAULT_NAV_ITEMS flash that occurred on every mount.
 */
export function Header() {
  const navItems = useNav()
  const logoUrl = useLogo()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isPublic = (item: NavItem) =>
    item.isVisible && (item.pageStatus ?? "published") !== "draft"

  const visibleItems = navItems.filter((item) => isPublic(item) && !item.isDonateButton)
  const donateItem = navItems.find((item) => item.isDonateButton && isPublic(item))

  return (
    <header className="w-full">
      {/* Logo Section */}
      <div className="bg-white py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Site Logosu"
                width={120}
                height={56}
                className="h-14 w-auto object-contain"
                priority
              />
            ) : (
              <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-auto"
              >
                <path
                  d="M5 10 H25 V5 H30 M5 15 H20 V20 H25 M5 20 H15"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="30" cy="5" r="2" fill="#1d4ed8" />
                <circle cx="25" cy="20" r="2" fill="#1d4ed8" />
                <circle cx="15" cy="20" r="2" fill="#1d4ed8" />
                <text x="35" y="35" fontSize="32" fontWeight="bold" fill="#1d4ed8">
                  MG
                </text>
                <text x="5" y="45" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#1d4ed8">
                  MYASTHENİA GRAVİS
                </text>
                <text x="5" y="55" fontFamily="Arial, sans-serif" fontSize="8" fill="#E11D48">
                  YAŞAM DERNEĞİ
                </text>
              </svg>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Section */}
      <nav
        className="transition-colors"
        style={{ backgroundColor: "var(--theme-navbar-bg, #475569)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between md:justify-center py-3">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {visibleItems.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-white text-sm transition-colors hover:text-(--theme-primary-hover,#1e40af)"
                >
                  {link.label}
                </Link>
              ))}
              {donateItem && (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded"
                >
                  <Link href={donateItem.href}>{donateItem.label}</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-3">
              {visibleItems.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-white text-sm transition-colors py-2 hover:text-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {donateItem && (
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded w-fit"
                >
                  <Link href={donateItem.href} onClick={() => setMobileMenuOpen(false)}>
                    {donateItem.label}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
