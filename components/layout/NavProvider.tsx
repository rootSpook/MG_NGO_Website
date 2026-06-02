"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { DEFAULT_NAV_ITEMS, type NavItem } from "@/lib/firebase/navServices";
import { useTenantServices } from "@/lib/firebase/hooks/useTenantServices";

// ── Context ───────────────────────────────────────────────────────────────────

const NavContext = createContext<NavItem[]>(DEFAULT_NAV_ITEMS);

// ── Provider ──────────────────────────────────────────────────────────────────

/**
 * NavProvider lives in the root layout (server component).
 * The server passes the freshly-fetched nav items as `initialItems`, so the
 * very first render already has the correct navigation — no DEFAULT_NAV_ITEMS
 * flash, no client-side loading delay.
 *
 * After hydration the provider also re-fetches from Firestore so that
 * in-session admin changes (e.g. opening the admin in another tab) eventually
 * propagate without a full reload.
 */
export function NavProvider({
  children,
  initialItems,
}: {
  children: ReactNode;
  initialItems: NavItem[];
}) {
  const [navItems, setNavItems] = useState<NavItem[]>(initialItems);
  const { getNavConfig } = useTenantServices();

  useEffect(() => {
    // Re-validate client-side after hydration to pick up any changes that
    // happened between the server render and mount.
    getNavConfig()
      .then(setNavItems)
      .catch(() => {/* keep server-fetched initialItems on error */});
  }, [getNavConfig]);

  return <NavContext.Provider value={navItems}>{children}</NavContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNav(): NavItem[] {
  return useContext(NavContext);
}
