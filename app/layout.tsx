import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import { getTenantByDomain } from '@/lib/tenant/masterDb'
import { TenantFirebaseProvider } from '@/lib/firebase/TenantFirebaseContext'
import { getTenantNavConfig, getTenantSiteSettings } from '@/lib/firebase/tenantServerDb'
import { DEFAULT_NAV_ITEMS } from '@/lib/firebase/navServices'
import { NavProvider } from '@/components/layout/NavProvider'
import { ThemeListener } from '@/components/theme/ThemeListener'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NGO Platform',
  description: 'Multi-tenant NGO website platform',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

function buildCachedSiteSettings(tenantId: string, projectId: string, apiKey: string) {
  return unstable_cache(
    () => getTenantSiteSettings({ projectId, apiKey }),
    [`tenant-settings:${tenantId}`],
    { revalidate: 300, tags: [`tenant-settings:${tenantId}`] },
  );
}

function buildCachedNavConfig(tenantId: string, projectId: string, apiKey: string) {
  return unstable_cache(
    () => getTenantNavConfig({ projectId, apiKey }),
    [`tenant-nav:${tenantId}`],
    { revalidate: 60, tags: [`tenant-nav:${tenantId}`] },
  );
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // middleware.ts stamps x-tenant-domain on every request.
  const headersList = await headers();
  const domain = headersList.get('x-tenant-domain') ?? 'localhost';

  // Resolve the tenant config. In production this reads from the master DB.
  // During local development, when FIREBASE_MASTER_* vars are not yet set,
  // we fall back to the single-tenant NEXT_PUBLIC_FIREBASE_* vars in .env so
  // the dev server keeps working without a master database.
  const masterVarsPresent =
    !!process.env.FIREBASE_MASTER_PROJECT_ID &&
    !!process.env.FIREBASE_MASTER_CLIENT_EMAIL &&
    !!process.env.FIREBASE_MASTER_PRIVATE_KEY;

  let tenant: Awaited<ReturnType<typeof getTenantByDomain>>;

  if (masterVarsPresent) {
    tenant = await getTenantByDomain(domain);
    if (!tenant) {
      throw new Error(
        `[RootLayout] No tenant found for domain "${domain}". ` +
        `Add a document to the master Firestore "tenants" collection with domains: ["${domain}"].`
      );
    }
  } else {
    // Dev fallback: synthesise a TenantRecord from the single-tenant env vars.
    // Remove this block (or leave it — it is unreachable) once FIREBASE_MASTER_*
    // vars are configured in .env.local.
    tenant = {
      tenantId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "dev",
      domains: [domain],
      firebaseConfig: {
        apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? "",
        authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "",
        projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? "",
        storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
        appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "",
      },
    };
  }

  const { projectId, apiKey } = tenant.firebaseConfig;

  const [settings, navItemsOrNull] = await Promise.all([
    buildCachedSiteSettings(tenant.tenantId, projectId, apiKey)(),
    buildCachedNavConfig(tenant.tenantId, projectId, apiKey)(),
  ]);

  const navItems = navItemsOrNull ?? DEFAULT_NAV_ITEMS;

  // Build CSS custom-property overrides from either the Firestore settings
  // record (old shape) or the tenant-level theme map (new multi-tenant shape).
  const themeVars: Record<string, string> = {};
  if (tenant.theme) {
    Object.assign(themeVars, tenant.theme);
  }
  if (settings?.theme) {
    const t = settings.theme;
    const str = (v: unknown): string | undefined =>
      typeof v === "string" ? v : undefined;
    const navbarBg  = str(t.navbarBg);
    const primary   = str(t.primary);
    const titleText = str(t.titleText);
    const footerBg  = str(t.footerBg);
    const footerText = str(t.footerText);
    if (navbarBg)   themeVars['--theme-navbar-bg']   = navbarBg;
    if (primary)    themeVars['--primary']            = primary;
    if (titleText)  themeVars['--theme-title-text']   = titleText;
    if (footerBg)   themeVars['--theme-footer-bg']    = footerBg;
    if (footerText) themeVars['--theme-footer-text']  = footerText;
  }

  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="font-sans antialiased"
        style={themeVars as React.CSSProperties}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          İçeriğe geç
        </a>
        <ThemeListener />
        {/*
          TenantFirebaseProvider is a Client Component. It receives the tenant's
          Firebase config as a plain serializable prop — no secrets cross the
          RSC boundary because masterDb.ts strips admin credentials before
          returning the TenantRecord.
        */}
        <TenantFirebaseProvider config={tenant.firebaseConfig}>
          <Providers>
            <NavProvider initialItems={navItems}>
              {children}
            </NavProvider>
          </Providers>
        </TenantFirebaseProvider>
        <Analytics />
      </body>
    </html>
  )
}
