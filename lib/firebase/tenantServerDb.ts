/**
 * tenantServerDb.ts — server-side Firestore reads via REST API
 *
 * The layout Server Component needs to read tenant Firestore data (nav config,
 * site settings) but only has client-safe credentials (apiKey + projectId).
 * The Firebase Admin SDK requires a service account — we don't store one per
 * tenant. The client SDK works in the browser but not reliably in the Node.js
 * server runtime used by Next.js Server Components.
 *
 * Solution: use the Firestore REST API directly. It authenticates with the
 * public apiKey and works in any runtime.
 */

import "server-only";

import { COLLECTIONS, DOCUMENT_IDS } from "./constants";
import type { NavItem } from "./navServices";
import type { SiteSettings } from "./types";

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  timestampValue?: string;
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

function deserializeValue(val: FirestoreValue): unknown {
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return val.doubleValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if ("nullValue" in val) return null;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.arrayValue !== undefined) {
    return (val.arrayValue.values ?? []).map(deserializeValue);
  }
  if (val.mapValue !== undefined) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields ?? {})) {
      result[k] = deserializeValue(v);
    }
    return result;
  }
  return undefined;
}

function deserializeDocument(doc: FirestoreDocument): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(doc.fields ?? {})) {
    result[k] = deserializeValue(v);
  }
  return result;
}

async function getDocument(
  projectId: string,
  apiKey: string,
  collection: string,
  docId: string,
): Promise<Record<string, unknown> | null> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}/${docId}?key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) return null;
  if (!res.ok) {
    console.error(`[tenantServerDb] Firestore REST error ${res.status} for ${collection}/${docId}`);
    return null;
  }

  const doc: FirestoreDocument = await res.json();
  return deserializeDocument(doc);
}

export interface TenantServerConfig {
  projectId: string;
  apiKey: string;
}

export async function getTenantSiteSettings(
  cfg: TenantServerConfig,
): Promise<SiteSettings | null> {
  try {
    const data = await getDocument(cfg.projectId, cfg.apiKey, COLLECTIONS.SETTINGS, DOCUMENT_IDS.SITE_SETTINGS);
    return data as SiteSettings | null;
  } catch (err) {
    console.error("[tenantServerDb] getSiteSettings error:", err);
    return null;
  }
}

export async function getTenantNavConfig(
  cfg: TenantServerConfig,
): Promise<NavItem[] | null> {
  try {
    const data = await getDocument(cfg.projectId, cfg.apiKey, COLLECTIONS.SETTINGS, DOCUMENT_IDS.NAVIGATION);
    if (!data) return null;
    const items = (data.items ?? []) as NavItem[];
    if (items.length === 0) return null;
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (err) {
    console.error("[tenantServerDb] getNavConfig error:", err);
    return null;
  }
}
