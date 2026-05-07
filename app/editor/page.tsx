import { redirect } from "next/navigation";

/**
 * /editor → Editör Paneli giriş noktası.
 * Kullanıcıyı doğrudan dashboard'a yönlendirir.
 */
export default function EditorEntryPage() {
  redirect("/editorPanel/dashboard");
}
