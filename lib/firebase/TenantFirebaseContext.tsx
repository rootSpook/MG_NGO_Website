"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  getOrInitTenantApp,
  type TenantFirebaseConfig,
  type TenantFirebaseServices,
} from "./clientApp";

// ── Context ───────────────────────────────────────────────────────────────────

const TenantFirebaseContext = createContext<TenantFirebaseServices | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

interface TenantFirebaseProviderProps {
  /** Serialized from the Server Component that resolved the current tenant. */
  config: TenantFirebaseConfig;
  children: ReactNode;
}

/**
 * Initializes the tenant's Firebase app exactly once and makes auth, db, and
 * storage available to every client component in the tree.
 *
 * This is a Client Component that sits just below the RSC boundary. The parent
 * Server Component (RootLayout) fetches the tenant config from the master DB
 * and passes it down as a plain serializable prop — no secrets cross the
 * boundary because masterDb.ts strips admin credentials before returning the
 * TenantRecord.
 */
export function TenantFirebaseProvider({ config, children }: TenantFirebaseProviderProps) {
  // projectId is stable for the lifetime of a browser session, so this memo
  // only re-initializes if the component somehow mounts with a different tenant
  // (which should never happen in production but is safe to handle).
  const services = useMemo(
    () => getOrInitTenantApp(config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.projectId],
  );

  return (
    <TenantFirebaseContext.Provider value={services}>
      {children}
    </TenantFirebaseContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Returns the full set of initialized Firebase services for the current tenant. */
export function useTenantFirebase(): TenantFirebaseServices {
  const ctx = useContext(TenantFirebaseContext);
  if (!ctx) {
    throw new Error("useTenantFirebase must be called inside <TenantFirebaseProvider>");
  }
  return ctx;
}
