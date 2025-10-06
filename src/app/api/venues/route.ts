import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const venues = await prisma.venues.findMany();

  return NextResponse.json(venues, {
    headers: {
      "Cache-Control":
        "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
