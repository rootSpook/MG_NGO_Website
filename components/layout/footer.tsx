import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <svg
              width="140"
              height="70"
              viewBox="0 0 140 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-auto"
            >
              {/* Circuit lines */}
              <path
                d="M15 15 H35 V10 H40 M15 20 H30 V25 H35 M15 25 H25"
                stroke="#0D9488"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="40" cy="10" r="2" fill="#0D9488" />
              <circle cx="35" cy="25" r="2" fill="#0D9488" />
              <circle cx="25" cy="25" r="2" fill="#0D9488" />
              
              {/* MG Letters */}
              <text
                x="45"
                y="40"
                fontFamily="Arial, sans-serif"
                fontSize="36"
                fontWeight="bold"
                fill="#0D9488"
              >
                MG
              </text>
              
              {/* Organization name */}
              <text
                x="15"
                y="52"
                fontFamily="Arial, sans-serif"
                fontSize="9"
                fontWeight="bold"
                fill="#0D9488"
              >
                MYASTHENİA GRAVİS
              </text>
              <text
                x="15"
                y="63"
                fontFamily="Arial, sans-serif"
                fontSize="9"
                fill="#E11D48"
              >
                YAŞAM DERNEĞİ
              </text>
            </svg>
          </div>

          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-teal-400 hover:text-teal-300 text-sm">
                  Biz Kimiz
                </Link>
              </li>
              <li>
                <Link href="/about/vision" className="text-teal-400 hover:text-teal-300 text-sm">
                  Amacımız ve Vizyonumuz
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-teal-400 hover:text-teal-300 text-sm">
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
                <Link href="/donate" className="text-teal-400 hover:text-teal-300 text-sm">
                  Bağış Yap
                </Link>
              </li>
              <li>
                <Link href="/media" className="text-teal-400 hover:text-teal-300 text-sm">
                  Haberler
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-teal-400 hover:text-teal-300 text-sm">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-teal-400 hover:text-teal-300 text-sm">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-teal-400 hover:text-teal-300 text-sm">
                  Yasal Uyarı
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-700 pt-6 text-center">
          <p className="text-sm text-zinc-400">
            © Copyright 2025 Myastenia Gravis Yaşam Derneği.
          </p>
        </div>
      </div>
    </footer>
  )
}
