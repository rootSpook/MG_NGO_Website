import { NextResponse } from "next/server";
import { getReportsPageData } from "@/lib/publicContent";

export async function GET() {
  const reports = await getReportsPageData();
  return NextResponse.json({ data: reports });
}
