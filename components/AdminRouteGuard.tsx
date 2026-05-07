"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/admin/login");
    } else if (role !== "admin") {
      // Authenticated but not an admin — redirect to editor panel
      router.replace("/editorPanel/dashboard");
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || role !== "admin") return null;

  return <>{children}</>;
}
