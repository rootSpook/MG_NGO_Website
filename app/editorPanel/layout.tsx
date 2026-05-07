import { EditorPanelProvider } from "@/context/EditorPanelContext";
import { EditorRouteGuard } from "@/components/EditorRouteGuard";

export default function EditorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditorRouteGuard>
      <EditorPanelProvider>{children}</EditorPanelProvider>
    </EditorRouteGuard>
  );
}