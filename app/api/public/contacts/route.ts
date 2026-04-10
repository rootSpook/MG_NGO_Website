import { NextResponse } from "next/server";
import { getContactPageData } from "@/lib/publicPagesContent";

export async function GET() {
  const contacts = await getContactPageData();
  return NextResponse.json({ data: contacts });
}
