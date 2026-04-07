// Admin root layout — no guard here.
// The guard is applied only to app/admin/(protected)/layout.tsx so that
// app/admin/login/page.tsx remains accessible to unauthenticated users.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
