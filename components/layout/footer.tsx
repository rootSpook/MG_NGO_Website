"use client"

import Link from "next/link"
import { LogoImage } from "@/components/layout/LogoImage"

export function Footer() {
  return (
    <footer
      className="text-white py-12 transition-colors"
      style={{ backgroundColor: "var(--theme-footer-bg, #18181b)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <LogoImage slot="footer" />
          </div>

          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Biz Kimiz
                </Link>
              </li>
              <li>
                <Link href="/about/vision" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Amacımız ve Vizyonumuz
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Bize Ulaşın
                </Link>
              </li>
            </ul>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/donate" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Bağış Yap
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Haberler
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-(--theme-footer-text,#ffffff) hover:opacity-80 text-sm">
                  Yasal Uyarı
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-700 pt-6 text-center">
          <p className="text-sm text-(--theme-footer-text,#ffffff)/70">
            © 2025 Myastenia Gravis Yaşam Derneği. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
