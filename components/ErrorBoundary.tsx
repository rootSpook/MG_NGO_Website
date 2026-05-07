"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Bir hata oluştu</h1>
            <p className="text-gray-600">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white"
            >
              Sayfayı Yenile
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
