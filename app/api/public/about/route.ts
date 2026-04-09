import { NextResponse } from "next/server";
import { getAboutPageData } from "@/lib/publicPagesContent";

export async function GET() {
  const about = await getAboutPageData();
  return NextResponse.json({ data: about });
}
