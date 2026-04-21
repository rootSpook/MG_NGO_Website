"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      setError("Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }
    setError("");
    setResetSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch {
      setError("Şifre sıfırlama e-postası gönderilemedi. E-posta adresini kontrol edin.");
    } finally {
      setResetSubmitting(false);
    }
  };

  if (loading || user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {resetMode ? "Şifremi Unuttum" : "Yönetim Paneli"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resetMode ? (
            resetSent ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderildi.
                  Gelen kutunuzu kontrol edin.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setResetMode(false); setResetSent(false); }}
                >
                  Girişe Dön
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-sm text-gray-500">
                  Kayıtlı e-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
                </p>
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email">E-posta</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={resetSubmitting}>
                  {resetSubmitting ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setResetMode(false); setError(""); }}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Girişe Dön
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Giriş yapılıyor…" : "Giriş Yap"}
              </Button>
              <button
                type="button"
                onClick={() => { setResetMode(true); setError(""); }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Şifremi Unuttum
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
