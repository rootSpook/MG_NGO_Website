"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidates the public page at /pages/{slug} after an admin save.
 * Also revalidates the homepage in case it surfaces dynamic page data.
 */
export async function revalidatePageAction(slug: string): Promise<void> {
  revalidatePath(`/pages/${slug}`);
  revalidatePath("/");
}

export async function revalidatePublicPathAction(path: string): Promise<void> {
  revalidatePath(path);
  revalidatePath("/");
}

/**
 * Busts the server-side nav config cache after an admin saves menu changes.
 * Invalidates the `nav-config` unstable_cache tag (used in the root layout)
 * so the next request re-fetches fresh nav data from Firestore and embeds it
 * in the server-rendered HTML — eliminating the DEFAULT_NAV_ITEMS flash.
 */
/**
 * revalidatePath("/", "layout") invalidates both the Full Route Cache and
 * the data cache for every route sharing the root layout — including the
 * unstable_cache entry for nav config — so the next request re-fetches
 * fresh nav data from Firestore and embeds it in the server-rendered HTML.
 */
export async function revalidateNavAction(): Promise<void> {
  revalidatePath("/", "layout");
}
