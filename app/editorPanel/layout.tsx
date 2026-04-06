import { EditorPanelProvider } from "@/context/EditorPanelContext";

export default function EditorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EditorPanelProvider>{children}</EditorPanelProvider>;
}