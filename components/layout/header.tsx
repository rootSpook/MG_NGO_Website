"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blogs", label: "Blogs" },
  { href: "/reports", label: "Reports" },
  { href: "/media", label: "Media" },
  { href: "/contacts", label: "Contacts" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white text-sm hover:text-teal-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded"
              >
                <Link href="/donate">Donate Now</Link>
              </Button>
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white text-sm hover:text-teal-300 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                asChild
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded w-fit"
              >
                <Link href="/donate">Donate Now</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
