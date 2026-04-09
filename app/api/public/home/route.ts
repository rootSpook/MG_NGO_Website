import { NextResponse } from "next/server";
import { getHomePageData } from "@/lib/publicPagesContent";

export async function GET() {
  const home = await getHomePageData();
  return NextResponse.json({ data: home });
}
