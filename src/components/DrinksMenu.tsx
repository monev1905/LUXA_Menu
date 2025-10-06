"use client";

import { useSearchParams } from "next/navigation";
import MenuCard from "./MenuCard";
import { DrinkCategory } from "@/lib/data";

interface DrinksMenuProps {
  sectionParam?: string | null;
  drinkCategories: DrinkCategory[];
}

export default function DrinksMenu({
  sectionParam,
  drinkCategories,
}: DrinksMenuProps) {
  const searchParams = useSearchParams();
  const currentSection = sectionParam || searchParams.get("section");

  if (drinkCategories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-accent text-xl">No drink categories available</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {drinkCategories.map((category) => (
          <MenuCard
            key={category.id}
            name={category.Category}
            href={`/menu?tab=drink&section=${category.Category.toLowerCase().replace(
              /\s+/g,
              "-"
            )}`}
            bgImage={category.imageUrl || undefined}
            fontSize="text-[1.75rem]"
            isActive={
              !currentSection ||
              currentSection ===
                category.Category.toLowerCase().replace(/\s+/g, "-")
            }
            fontFamily="font-roboto"
          />
        ))}
      </div>
    </div>
  );
}
