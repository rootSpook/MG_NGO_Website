import { NextResponse } from "next/server";
import { getDonationPageData } from "@/lib/publicContent";

export async function GET() {
  const donation = await getDonationPageData();
  return NextResponse.json({ data: donation });
}
