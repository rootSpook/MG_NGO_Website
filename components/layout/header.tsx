"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { DEFAULT_NAV_ITEMS, getNavConfig, type NavItem } from "@/lib/firebase/navServices"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS)

  useEffect(() => {
    getNavConfig().then(setNavItems).catch(() => setNavItems(DEFAULT_NAV_ITEMS))
  }, [])

  // Hide draft pages from the public nav. Special routes don't carry a
  // pageStatus so they pass through unchanged. Items still remain reachable
  // via direct URL — only the menu link disappears.
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
            <svg
              width="120"
              height="60"
              viewBox="0 0 120 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-auto"
            >
              {/* Circuit lines */}
              <path
                d="M5 10 H25 V5 H30 M5 15 H20 V20 H25 M5 20 H15"
                stroke="#0D9488"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="30" cy="5" r="2" fill="#0D9488" />
              <circle cx="25" cy="20" r="2" fill="#0D9488" />
              <circle cx="15" cy="20" r="2" fill="#0D9488" />

              {/* MG Letters */}
              <text
                x="35"
                y="35"
                fontFamily="Arial, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="#0D9488"
              >
                MG
              </text>

              {/* Organization name */}
              <text
                x="5"
                y="45"
                fontFamily="Arial, sans-serif"
                fontSize="8"
                fontWeight="bold"
                fill="#0D9488"
              >
                MYASTHENİA GRAVİS
              </text>
              <text
                x="5"
                y="55"
                fontFamily="Arial, sans-serif"
                fontSize="8"
                fill="#E11D48"
              >
                YAŞAM DERNEĞİ
              </text>
            </svg>
          </Link>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="bg-slate-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between md:justify-center py-3">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {visibleItems.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-white text-sm hover:text-teal-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {donateItem && (
                <Button
                  asChild
                  className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded"
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
                  className="text-white text-sm hover:text-teal-300 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {donateItem && (
                <Button
                  asChild
                  className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded w-fit"
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
