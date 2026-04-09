"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import EditorShell from "@/components/editorPanel/EditorShell";
import BlogPostForm from "@/components/editorPanel/BlogPostForm";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { BlogPost } from "@/types/editorPanel";

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { getBlogById, updateBlog } = useEditorPanel();

  const blogId = String(params.id);
  const existingBlog = getBlogById(blogId);

  function handleUpdateBlog(data: BlogPost) {
    updateBlog(blogId, data);
    router.push("/editorPanel/blog-posts");
  }

  if (!existingBlog) {
    return (
      <EditorShell>
        <div className="mx-auto max-w-[1180px]">
          <h1 className="text-[48px] font-bold text-black">
            Blog Yazısı Bulunamadı
          </h1>
          <p className="mt-4 text-[16px] text-[#444]">
            Düzenlemek istediğiniz blog yazısı bulunamadı.
          </p>
          <Link
            href="/editorPanel/blog-posts"
            className="mt-6 inline-block rounded-[12px] bg-[#2f80ed] px-6 py-3 text-white"
          >
            Blog Yazılarına Dön
          </Link>
        </div>
      </EditorShell>
    );
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">
          Blog Yazısı Düzenle
        </h1>

        <BlogPostForm
          mode="edit"
          initialData={existingBlog}
          onSubmit={handleUpdateBlog}
        />
      </div>
    </EditorShell>
  );
}