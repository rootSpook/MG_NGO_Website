import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import { getSiteSettings } from '@/lib/firebase/services'
import { getNavConfig } from '@/lib/firebase/navServices'
import { NavProvider } from '@/components/layout/NavProvider'
import { ThemeListener } from '@/components/theme/ThemeListener'
import './globals.css'

// Cache site settings for 5 minutes — they change rarely and don't need
// per-request freshness. The admin theme page calls revalidatePath('/') after
// saving to bust this cache immediately when settings are updated.
const getCachedSiteSettings = unstable_cache(
  getSiteSettings,
  ['site-settings'],
  { revalidate: 300 }
)

// Cache nav config for 60 seconds. The admin menu page calls
// revalidateNavAction() after every save, which calls revalidatePath("/","layout")
// to bust this cache immediately so changes propagate on the next request.
const getCachedNavConfig = unstable_cache(
  getNavConfig,
  ['nav-config'],
  { revalidate: 60 }
)

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Myasthenia Gravis Yaşam Derneği',
  description: 'Myasthenia Gravis hastalarına ve yakınlarına destek, farkındalık ve bilgi kaynağı sunan resmi dernek sitesi.',
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
  const [settings, navItems] = await Promise.all([
    getCachedSiteSettings(),
    getCachedNavConfig(),
  ]);

  return (
    <html lang="tr" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          İçeriğe geç
        </a>
        <ThemeListener />
        <Providers>
          <NavProvider initialItems={navItems}>
            {children}
          </NavProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
