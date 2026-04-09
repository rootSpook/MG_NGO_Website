import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/lib/publicContent";

export async function GET() {
  const blogs = await getPublishedBlogs();
  return NextResponse.json({ data: blogs });
}
