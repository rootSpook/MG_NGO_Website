import { NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/publicContent";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ data: blog });
}
