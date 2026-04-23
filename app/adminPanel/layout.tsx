import { AdminPanelProvider } from "@/context/AdminPanelContext";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminPanelProvider>{children}</AdminPanelProvider>;
}