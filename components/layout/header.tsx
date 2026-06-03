"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useNav } from "@/components/layout/NavProvider"
import type { NavItem } from "@/lib/firebase/navServices"
import { LogoImage } from "@/components/layout/LogoImage"

export function Header() {
  const navItems = useNav()
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
            <LogoImage slot="header" />
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
