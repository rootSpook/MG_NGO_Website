import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import { getSiteSettings } from '@/lib/firebase/services'
import { ThemeListener } from '@/components/theme/ThemeListener'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Myasthenia Gravis Yaşam Derneği',
  description: 'Supporting the Myasthenia Gravis community through awareness, education, and resources.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body 
        className="font-sans antialiased"
        style={{
          ...(settings?.theme ? {
            '--theme-navbar-bg': settings.theme.navbarBg,
            '--primary': settings.theme.primary,
            '--theme-title-text': settings.theme.titleText,
            '--theme-footer-bg': settings.theme.footerBg,
            '--theme-footer-text': settings.theme.footerText
          } as React.CSSProperties : {})
        }}
      >
        <ThemeListener />
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
