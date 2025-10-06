import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const selections = await prisma.shishaSelections.findMany({
      include: {
        ShishaBrands: {
          select: {
            id: true,
            Brand: true,
            Type: true,
            logoUrl: true,
          },
        },
      },
    });

    // Transform the data to convert BigInt to string and include the type, brand, and logoUrl fields
    const transformedSelections = selections.map((selection) => ({
      id: selection.id?.toString() || "",
      selection: selection.Selection || "",
      price: selection.Price ? parseFloat(selection.Price.toString()) : null,
      brands: (selection.ShishaBrands || []).map((brand) => ({
        id: brand.id?.toString() || "",
        brand: brand.Brand || "",
        type: brand.Type || null,
        logoUrl: brand.logoUrl || null,
      })),
    }));

    return NextResponse.json(transformedSelections, {
      headers: {
        "Cache-Control":
          "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const selection = await prisma.shishaSelections.create({
      data: {
        Selection: data.selection,
        Price: data.price ? parseFloat(data.price) : null,
      },
    });

    return NextResponse.json(selection, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
