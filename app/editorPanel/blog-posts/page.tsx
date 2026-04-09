"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import EditorShell from "@/components/editorPanel/EditorShell";
import { useEditorPanel } from "@/context/EditorPanelContext";

function formatDateTR(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const statusOptions = ["published", "draft"];
const categoryOptions = [
  "Sağlık",
  "Etkinlik",
  "Topluluk",
  "Duyuru",
  "Destek",
  "Bağış",
];

export default function BlogPostsPage() {
  const { blogs, deleteBlog } = useEditorPanel();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  function toggleSelection(
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  function clearFilters() {
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSearchTerm("");
  }

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        !searchTerm.trim() ||
        `${blog.title} ${blog.category} ${blog.summary} ${blog.author}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(blog.status);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(blog.category);

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [blogs, searchTerm, selectedStatuses, selectedCategories]);

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[52px] font-bold text-black">Blog Yazıları</h1>

            <div className="relative mt-5 w-[320px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2f80ed]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Blog yazılarında ara"
                className="h-[46px] w-full rounded-[12px] bg-[#efefef] pl-11 pr-4 text-[15px] outline-none"
              />
            </div>
          </div>

          <Link
            href="/editorPanel/blog-posts/new"
            className="mt-8 rounded-full border-2 border-[#2f80ed] px-6 py-3 text-[18px] font-medium text-[#2f80ed] transition hover:bg-[#eef5ff]"
          >
            + Blog Yazısı Ekle
          </Link>
        </div>

        <section className="rounded-[24px] bg-[#e8e8e8] p-5 shadow-md">
          <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
            <div className="rounded-[18px] bg-[#f1f1f1] p-5">
              <h3 className="mb-4 text-[18px] font-semibold text-black">Filtrele</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-[14px] font-medium text-[#222]">Durum</h4>
                  <div className="space-y-2">
                    {statusOptions.map((status) => {
                      const count = blogs.filter((blog) => blog.status === status).length;

                      return (
                        <label
                          key={status}
                          className="flex items-center gap-2 text-[14px] text-[#444]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={() =>
                              toggleSelection(
                                status,
                                selectedStatuses,
                                setSelectedStatuses
                              )
                            }
                            className="h-4 w-4 accent-[#2f80ed]"
                          />
                          <span>
                            {status === "published" ? "Yayınlandı" : "Taslak"} ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-[14px] font-medium text-[#222]">Kategori</h4>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => {
                      const count = blogs.filter(
                        (blog) => blog.category === category
                      ).length;

                      return (
                        <label
                          key={category}
                          className="flex items-center gap-2 text-[14px] text-[#444]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() =>
                              toggleSelection(
                                category,
                                selectedCategories,
                                setSelectedCategories
                              )
                            }
                            className="h-4 w-4 accent-[#2f80ed]"
                          />
                          <span>
                            {category} ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="mt-6 w-full rounded-full border border-[#4d4d4d] bg-white py-2 text-[15px] font-medium text-[#333]"
              >
                Temizle
              </button>
            </div>

            <div>
              <div className="mb-3 flex justify-end text-[15px] text-[#5a5a5a]">
                Bulundu: {filteredBlogs.length}
              </div>

              <div className="overflow-x-auto rounded-[14px]">
                <table className="min-w-full">
                  <thead className="bg-[#d6d6da] text-left text-[13px] text-[#2f2f2f]">
                    <tr>
                      <th className="px-4 py-3">Başlık</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Yayın Tarihi</th>
                      <th className="px-4 py-3">Durum</th>
                      <th className="px-4 py-3">Yazar</th>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3"></th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBlogs.map((blog, index) => (
                      <tr
                        key={blog.id}
                        className={index % 2 === 0 ? "bg-[#efefef]" : "bg-[#dcdcdc]"}
                      >
                        <td className="px-4 py-4">{blog.title}</td>
                        <td className="px-4 py-4">{blog.category}</td>
                        <td className="px-4 py-4">{formatDateTR(blog.publishedAt)}</td>
                        <td className="px-4 py-4">
                          {blog.status === "published" ? "Yayınlandı" : "Taslak"}
                        </td>
                        <td className="px-4 py-4">{blog.author}</td>
                        <td className="px-4 py-4">{blog.id}</td>
                        <td className="px-4 py-4">
                          <Link href={`/editorPanel/blog-posts/${blog.id}/edit`}>
                            <Pencil className="h-5 w-5 text-[#2f80ed]" />
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <button onClick={() => deleteBlog(blog.id)}>
                            <Trash2 className="h-5 w-5 text-[#2f80ed]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </EditorShell>
  );
}