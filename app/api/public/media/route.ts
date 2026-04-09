import { NextResponse } from "next/server";
import { getMediaPageData } from "@/lib/publicContent";

export async function GET() {
  const media = await getMediaPageData();
  return NextResponse.json({ data: media });
}
