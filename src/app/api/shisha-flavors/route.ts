import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const flavors = await prisma.shishaFlavors.findMany({
    where: { isActive: true },
    include: {
      ShishaBrands: {
        select: {
          Brand: true,
          Type: true,
        },
      },
    },
  });

  // Transform the data to convert BigInt to string and include the type and brand fields
  const transformedFlavors = flavors.map((flavor) => ({
    id: flavor.id.toString(),
    name: flavor.name,
    description: flavor.description,
    isActive: flavor.isActive,
    imageUrl: flavor.imageUrl,
    brand: flavor.ShishaBrands?.Brand || null,
    type: flavor.ShishaBrands?.Type || null,
  }));

  return NextResponse.json(transformedFlavors, {
    headers: {
      "Cache-Control":
        "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Enhanced validation
    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      !data.brand_id ||
      (typeof data.brand_id !== "number" && typeof data.brand_id !== "string")
    ) {
      return NextResponse.json(
        { error: "Valid brand_id is required" },
        { status: 400 }
      );
    }

    // Sanitize and validate data
    const sanitizedData = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      imageUrl: data.imageUrl ? data.imageUrl.trim() : "",
      brand_id: BigInt(data.brand_id),
    };

    const flavor = await prisma.shishaFlavors.create({
      data: sanitizedData,
    });
    return NextResponse.json(flavor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    const updated = await prisma.shishaFlavors.update({
      where: { id: BigInt(id) },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        imageUrl: data.imageUrl,
        brand_id: data.brand_id ? BigInt(data.brand_id) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Flavor not found or update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.shishaFlavors.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Flavor not found or delete failed" },
      { status: 400 }
    );
  }
}
