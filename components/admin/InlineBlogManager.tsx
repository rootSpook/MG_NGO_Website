"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Search } from "lucide-react";
import BlogPostForm from "@/components/editorPanel/BlogPostForm";
import type { BlogPost } from "@/types/editorPanel";
import {
  createEditorBlog,
  getEditorBlogs,
  updateEditorBlog,
} from "@/lib/firebase/editorServices";
import { revalidatePublicPathAction } from "@/app/admin/actions";

type SortMode = "newest" | "oldest";

function formatDateTR(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function InlineBlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getEditorBlogs()
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        if (!query.trim()) return true;
        return `${blog.title} ${blog.summary} ${blog.category} ${blog.author}`
          .toLowerCase()
          .includes(query.toLowerCase());
      })
      .sort((a, b) => {
        const left = new Date(a.publishedAt).getTime();
        const right = new Date(b.publishedAt).getTime();
        return sortMode === "newest" ? right - left : left - right;
      });
  }, [blogs, query, sortMode]);

  async function refreshPublicBlogs() {
    await revalidatePublicPathAction("/blogs");
  }

  async function handleCreate(blog: BlogPost) {
    const { id: _id, ...payload } = blog;
    const id = await createEditorBlog(payload);
    const next = { ...blog, id };
    setBlogs((prev) => [next, ...prev]);
    setCreating(false);
    await refreshPublicBlogs();
  }

  async function handleUpdate(blog: BlogPost) {
    await updateEditorBlog(blog.id, blog);
    setBlogs((prev) => prev.map((item) => (item.id === blog.id ? blog : item)));
    setEditingBlog(null);
    await refreshPublicBlogs();
  }

  async function setStatus(blog: BlogPost, status: BlogPost["status"]) {
    await updateEditorBlog(blog.id, { status });
    setBlogs((prev) => prev.map((item) => (item.id === blog.id ? { ...item, status } : item)));
    await refreshPublicBlogs();
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Blog Yazıları</p>
          <p className="mt-1 text-sm text-gray-500">
            Blog ekleme, düzenleme, yayınlama ve taslağa alma işlemleri bu sayfadan yapılır.
          </p>
        </div>
        <button
          onClick={() => {
            setCreating((prev) => !prev);
            setEditingBlog(null);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Blog Ekle
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_190px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Bloglarda ara"
            className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
          />
        </label>
        <select
          value={sortMode}
          onChange={(event) => setSortMode(event.target.value as SortMode)}
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-teal-500"
        >
          <option value="newest">Yeniden eskiye</option>
          <option value="oldest">Eskiden yeniye</option>
        </select>
      </div>

      {creating && (
        <BlogPostForm mode="create" onSubmit={handleCreate} onClear={() => setCreating(false)} />
      )}

      {editingBlog && (
        <BlogPostForm
          mode="edit"
          initialData={editingBlog}
          onSubmit={handleUpdate}
          onClear={() => setEditingBlog(null)}
        />
      )}

      {loading ? (
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Yayın Tarihi</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{blog.title}</td>
                  <td className="px-4 py-3 text-gray-600">{blog.category}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDateTR(blog.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <span className={blog.status === "published" ? "text-green-700" : "text-amber-700"}>
                      {blog.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setCreating(false);
                        }}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                        title="Düzenle"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setStatus(blog, blog.status === "published" ? "draft" : "published")}
                        className="flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-2 text-xs font-medium text-teal-700 hover:bg-teal-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        {blog.status === "published" ? "Taslağa Al" : "Yayınla"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Blog bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
