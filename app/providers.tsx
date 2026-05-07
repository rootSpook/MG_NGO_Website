"use client";

import { AuthProvider } from "@/lib/firebase/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}
