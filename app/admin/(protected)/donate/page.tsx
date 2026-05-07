import { redirect } from "next/navigation";

/**
 * The donation page campaign management has been moved into
 * Menu Management → Bağış Yap → İçeriği Yönet.
 */
export default function DonateLegacyRedirect() {
  redirect("/admin/menu/bagis");
}
