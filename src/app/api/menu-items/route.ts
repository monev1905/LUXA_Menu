import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menu-items?category=drink|shisha
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where = category ? { type: category } : {};
  const items = await prisma.drinks.findMany({ where });
  return NextResponse.json(items);
}

// POST /api/menu-items
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
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

    if (typeof data.price !== "number" || data.price < 0) {
      return NextResponse.json(
        { error: "Price is required and must be a positive number" },
        { status: 400 }
      );
    }

    if (
      !data.category_id ||
      (typeof data.category_id !== "string" &&
        typeof data.category_id !== "number")
    ) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Sanitize and validate data
    const sanitizedData = {
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      price: Number(data.price),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      category_id: BigInt(data.category_id),
      type: data.type ? data.type.trim() : null,
      imageUrl: data.imageUrl ? data.imageUrl.trim() : null,
      quantity: data.quantity ? Number(data.quantity) : null,
      order: data.order ? Number(data.order) : null,
      unit_type: data.unit_type || "мл",
    };

    const item = await prisma.drinks.create({ data: sanitizedData });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}

// PATCH /api/menu-items
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Validate ID format
    if (typeof id !== "string" && typeof id !== "number") {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }

    // Sanitize update data
    const sanitizedData: Record<string, unknown> = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string" || data.name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }
      sanitizedData.name = data.name.trim();
    }

    if (data.price !== undefined) {
      if (typeof data.price !== "number" || data.price < 0) {
        return NextResponse.json(
          { error: "Price must be a positive number" },
          { status: 400 }
        );
      }
      sanitizedData.price = Number(data.price);
    }

    if (data.description !== undefined) {
      sanitizedData.description = data.description
        ? data.description.trim()
        : null;
    }

    if (data.isActive !== undefined) {
      sanitizedData.isActive = Boolean(data.isActive);
    }

    if (data.category_id !== undefined) {
      sanitizedData.category_id = BigInt(data.category_id);
    }

    if (data.type !== undefined) {
      sanitizedData.type = data.type ? data.type.trim() : null;
    }

    if (data.imageUrl !== undefined) {
      sanitizedData.imageUrl = data.imageUrl ? data.imageUrl.trim() : null;
    }

    if (data.quantity !== undefined) {
      sanitizedData.quantity = data.quantity ? Number(data.quantity) : null;
    }

    if (data.order !== undefined) {
      sanitizedData.order = data.order ? Number(data.order) : null;
    }

    if (data.unit_type !== undefined) {
      sanitizedData.unit_type = data.unit_type || "мл";
    }

    const updated = await prisma.drinks.update({
      where: { id: BigInt(id) },
      data: sanitizedData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Item not found or update failed" },
      { status: 400 }
    );
  }
}
