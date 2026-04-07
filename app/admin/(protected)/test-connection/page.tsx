// TODO: Remove this page before production — it exists only to verify the
// Firestore connection and data access layer during development.

"use client";

import { useEffect, useState } from "react";
import {
  getSiteSettings,
  getCategories,
  getTags,
  submitContactMessage,
} from "@/lib/firebase/services";
import type { SiteSettings, Category, Tag } from "@/lib/firebase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Status = "idle" | "loading" | "success" | "error";

export default function TestConnectionPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<(Category & { id: string })[]>([]);
  const [tags, setTags] = useState<(Tag & { id: string })[]>([]);
  const [fetchStatus, setFetchStatus] = useState<Status>("loading");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [submitStatus, setSubmitStatus] = useState<Status>("idle");
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, c, t] = await Promise.all([
          getSiteSettings(),
          getCategories(),
          getTags(),
        ]);
        setSettings(s);
        setCategories(c);
        setTags(t);
        setFetchStatus("success");
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : String(err));
        setFetchStatus("error");
      }
    }
    load();
  }, []);

  async function handleSubmitTest() {
    setSubmitStatus("loading");
    setSubmitResult(null);
    try {
      const id = await submitContactMessage({
        senderName: "Test User",
        senderEmail: "test@example.com",
        subject: "Connection Test",
        messageBody: "This is a test message submitted from the test-connection page.",
      });
      setSubmitResult(`Created contactMessages/${id}`);
      setSubmitStatus("success");
    } catch (err) {
      setSubmitResult(err instanceof Error ? err.message : String(err));
      setSubmitStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Firestore Connection Test</h1>
      <p className="text-sm text-muted-foreground">
        This page is for development only and must be removed before production.
      </p>

      {/* Fetch status */}
      <Card>
        <CardHeader>
          <CardTitle>Fetch status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fetchStatus === "loading" && <p className="text-muted-foreground">Loading…</p>}
          {fetchStatus === "error" && (
            <p className="text-destructive">Error: {fetchError}</p>
          )}
          {fetchStatus === "success" && (
            <>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  settings/site — ngoName
                </p>
                <p className="mt-1 font-medium">
                  {settings?.ngoName ?? <span className="text-destructive">null</span>}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Categories ({categories.length})
                </p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {categories.map((c) => (
                    <li key={c.id}>
                      {c.name} <span className="text-muted-foreground">({c.slug})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tags ({tags.length})
                </p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {tags.map((t) => (
                    <li key={t.id}>
                      {t.name} <span className="text-muted-foreground">({t.slug})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Write test */}
      <Card>
        <CardHeader>
          <CardTitle>Write test — submit contact message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Submits a test document to the <code>contactMessages</code> collection.
          </p>
          <Button
            onClick={handleSubmitTest}
            disabled={submitStatus === "loading"}
            variant="outline"
          >
            {submitStatus === "loading" ? "Submitting…" : "Submit test message"}
          </Button>
          {submitStatus === "success" && (
            <p className="text-sm text-green-600">
              Success: {submitResult}
            </p>
          )}
          {submitStatus === "error" && (
            <p className="text-sm text-destructive">Error: {submitResult}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
