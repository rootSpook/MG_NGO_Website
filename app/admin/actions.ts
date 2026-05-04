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
