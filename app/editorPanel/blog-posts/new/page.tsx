"use client";

import { useRouter } from "next/navigation";
import EditorShell from "@/components/editorPanel/EditorShell";
import BlogPostForm from "@/components/editorPanel/BlogPostForm";
import { useEditorPanel } from "@/context/EditorPanelContext";
import { BlogPost } from "@/types/editorPanel";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { addBlog } = useEditorPanel();

  function handleCreateBlog(data: BlogPost) {
    addBlog(data);
    router.push("/editorPanel/blog-posts");
  }

  return (
    <EditorShell>
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-8 text-[52px] font-bold text-black">
          Yeni Blog Yazısı
        </h1>

        <BlogPostForm mode="create" onSubmit={handleCreateBlog} />
      </div>
    </EditorShell>
  );
}