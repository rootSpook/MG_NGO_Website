"use client";

import { useAuth } from "@/lib/firebase/AuthContext";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user, role, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Logged in as <span className="font-medium">{user?.email}</span> &mdash; role:{" "}
        <span className="font-medium">{role}</span>
      </p>
      <Button variant="outline" onClick={logout}>
        Sign Out
      </Button>
    </div>
  );
}
