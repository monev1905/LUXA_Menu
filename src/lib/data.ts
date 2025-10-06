import { prisma } from "@/lib/prisma";
import { cache } from "react";

// Types
export interface Venue {
  id: string;
  name: string;
  subtitle?: string;
}

export interface DrinkCategory {
  id: string;
  Category: string;
  Order: number | null;
  imageUrl: string | null;
  Drinks: Drink[];
}

export interface Drink {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  category_id: string;
  type: string | null;
  imageUrl: string | null;
  quantity: number | null;
  order: number | null;
  unit_type: "мл" | "гр";
}

export interface ShishaSelection {
  id: string;
  selection: string;
  price: number | null;
  brands: ShishaBrand[];
}

export interface ShishaBrand {
  id: string;
  brand: string;
  type: string | null;
  logoUrl: string | null;
}

export interface ShishaFlavor {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  imageUrl: string;
  brand: string | null;
  type: string | null;
}

// Cached data fetching functions
export const getVenues = cache(async (): Promise<Venue[]> => {
  try {
    const venues = await prisma.venues.findMany();
    return venues.map((venue) => ({
      id: venue.id.toString(),
      name: venue.name,
      subtitle: venue.subtitle || undefined,
    }));
  } catch {
    // Database connection issue - using fallback data
    return [];
  }
});

export const getDrinkCategories = cache(async (): Promise<DrinkCategory[]> => {
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
        Order: category.Order ? Number(category.Order) : null,
        Drinks: category.Drinks.map((drink) => ({
          ...drink,
          id: drink.id.toString(),
          category_id: drink.category_id.toString(),
          quantity: drink.quantity ? Number(drink.quantity) : null,
          order: drink.order ? Number(drink.order) : null,
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
          quantity: drink.quantity ? Number(drink.quantity) : null,
          order: 999999, // High order number to put at bottom
        }));

        categoryData.Drinks = (
          [...categoryData.Drinks, ...specialDrinks] as any
        ).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
      }

      return categoryData;
    });

    return transformedCategories;
  } catch {
    // Database connection issue - using fallback data
    return [];
  }
});

export const getShishaSelections = cache(
  async (): Promise<ShishaSelection[]> => {
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
      return selections.map((selection) => ({
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
    } catch (error) {
      // Return empty array instead of crashing
      return [];
    }
  }
);

export const getShishaFlavors = cache(async (): Promise<ShishaFlavor[]> => {
  try {
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
    return flavors.map((flavor) => ({
      id: flavor.id.toString(),
      name: flavor.name,
      description: flavor.description,
      isActive: flavor.isActive,
      imageUrl: flavor.imageUrl,
      brand: flavor.ShishaBrands?.Brand || null,
      type: flavor.ShishaBrands?.Type || null,
    }));
  } catch {
    // Database connection issue - using fallback data
    return [];
  }
});

// Combined data fetching for menu page with timeout
export const getMenuData = cache(async () => {
  try {
    // Add timeout to prevent long waits when database is unavailable
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database timeout")), 3000)
    );

    const dataPromise = Promise.all([
      getVenues(),
      getDrinkCategories(),
      getShishaSelections(),
      getShishaFlavors(),
    ]);

    const [venues, drinkCategories, shishaSelections, shishaFlavors] =
      (await Promise.race([dataPromise, timeoutPromise])) as any;

    return {
      venues,
      drinkCategories,
      shishaSelections,
      shishaFlavors,
    };
  } catch {
    // Return empty data if timeout or connection fails
    return {
      venues: [],
      drinkCategories: [],
      shishaSelections: [],
      shishaFlavors: [],
    };
  }
});

// Helper functions for specific data filtering
export const getShishaTypesWithData = (
  selections: ShishaSelection[],
  flavors: ShishaFlavor[]
) => {
  const SHISHA_TYPES = [
    { key: "blond", label: "Blond Leaf" },
    { key: "dark", label: "Dark Leaf" },
    { key: "cigar", label: "Cigar Leaf" },
  ];

  return SHISHA_TYPES.filter((type) => {
    let hasBrandsWithFlavors = false;

    if (type.key === "dark") {
      // For dark leaf, check in "Finest" and "Classic" selections
      const darkSelections = selections.filter(
        (sel) =>
          sel.selection?.trim() === "Finest" ||
          sel.selection?.trim() === "Classic"
      );

      hasBrandsWithFlavors = darkSelections.some((selection) => {
        return selection.brands.some((brand) => {
          if (brand.type !== "dark") return false;

          const hasFlavors = flavors.some(
            (flavor) => flavor.brand === brand.brand && flavor.type === "dark"
          );

          return hasFlavors;
        });
      });
    } else if (type.key === "cigar") {
      // For cigar leaf, check in selection with id='3' or name containing 'cigar'
      const cigarSelection = selections.find(
        (sel) =>
          sel.id === "3" ||
          sel.selection?.trim().toLowerCase().includes("cigar")
      );

      if (cigarSelection) {
        hasBrandsWithFlavors = cigarSelection.brands.some((brand) => {
          if (brand.type !== "cigar") return false;

          const hasFlavors = flavors.some(
            (flavor) => flavor.brand === brand.brand && flavor.type === "cigar"
          );

          return hasFlavors;
        });
      }
    } else if (type.key === "blond") {
      // For blond leaf, check in any selection that might contain blond brands
      const blondSelection = selections.find((sel) =>
        sel.selection?.trim().toLowerCase().includes("blond")
      );

      if (blondSelection) {
        hasBrandsWithFlavors = blondSelection.brands.some((brand) => {
          if (brand.type !== "blond") return false;

          const hasFlavors = flavors.some(
            (flavor) => flavor.brand === brand.brand && flavor.type === "blond"
          );

          return hasFlavors;
        });
      }
    }

    return hasBrandsWithFlavors;
  });
};

export const getSelectionInfo = (
  typeKey: string,
  selections: ShishaSelection[]
) => {
  if (typeKey === "dark") {
    const finestSelection = selections.find(
      (sel) => sel.selection?.trim() === "Finest"
    );
    return finestSelection
      ? {
          selection: finestSelection.selection,
          price: finestSelection.price,
        }
      : null;
  } else if (typeKey === "cigar") {
    const cigarSelection = selections.find(
      (sel) =>
        sel.id === "3" || sel.selection?.trim().toLowerCase().includes("cigar")
    );
    return cigarSelection
      ? {
          selection: cigarSelection.selection,
          price: cigarSelection.price,
        }
      : null;
  }
  return null;
};
