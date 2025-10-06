import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.drinkCategories.findMany({
      where: {
        id: { not: 99 }, // Exclude category 99 from main categories
      },
      orderBy: { Order: "asc" },
      include: {
        Drinks: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // Get special items from DrinkCategories id 99 (Добавки - напитки)
    const specialCategory = await prisma.drinkCategories.findUnique({
      where: { id: 99 },
      include: {
        Drinks: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // Transform BigInt IDs to strings and add special items to categories 1 and 11
    const transformedCategories = categories.map((category) => {
      const categoryData = {
        ...category,
        id: category.id.toString(),
        Drinks: category.Drinks.map((drink) => ({
          ...drink,
          id: drink.id.toString(),
          category_id: drink.category_id.toString(),
        })),
      };

      // Add special items to category 1 (Кафе) and category 11 (Топли напитки)
      if (
        (category.id.toString() === "1" || category.id.toString() === "11") &&
        specialCategory
      ) {
        const specialDrinks = specialCategory.Drinks.map((drink) => ({
          ...drink,
          id: `special-${drink.id.toString()}-${category.id}`,
          category_id: category.id.toString(),
          type: "special",
          order: 999999 as any, // High order number to put at bottom
        }));

        categoryData.Drinks = (
          [...categoryData.Drinks, ...specialDrinks] as any
        ).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
      }

      return categoryData;
    });

    return NextResponse.json(transformedCategories, {
      headers: {
        "Cache-Control":
          "public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching drink categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch drink categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const category = await prisma.drinkCategories.create({ data });
    return NextResponse.json(
      { ...category, id: category.id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating drink category:", error);
    return NextResponse.json(
      { error: "Failed to create drink category" },
      { status: 500 }
    );
  }
}
