import { AdminRouteGuard } from "@/components/AdminRouteGuard";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
