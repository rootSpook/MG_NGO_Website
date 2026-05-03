"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { DEFAULT_NAV_ITEMS, getNavConfig, type NavItem } from "@/lib/firebase/navServices"

/**
 * Renders the public site header with dynamic navigation links and mobile menu support.
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS)

  useEffect(() => {
    getNavConfig().then(setNavItems).catch(() => setNavItems(DEFAULT_NAV_ITEMS))
  }, [])

  const visibleItems = navItems.filter((item) => item.isVisible && !item.isDonateButton)
  const donateItem = navItems.find((item) => item.isDonateButton && item.isVisible)

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
                stroke="#1d4ed8"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="30" cy="5" r="2" fill="#1d4ed8" />
              <circle cx="25" cy="20" r="2" fill="#1d4ed8" />
              <circle cx="15" cy="20" r="2" fill="#1d4ed8" />

              {/* MG Letters */}
              <text
                x="35"
                y="35"
                fontSize="32"
                fontWeight="bold"
                fill="#1d4ed8"
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
                fill="#1d4ed8"
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
                  className="text-white text-sm transition-colors hover:text-[var(--theme-primary-hover,#1e40af)]"
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
