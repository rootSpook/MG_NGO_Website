import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import AdminShell from "@/components/admin/AdminShell";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteGuard>
      <AdminShell>{children}</AdminShell>
    </AdminRouteGuard>
  );
}
