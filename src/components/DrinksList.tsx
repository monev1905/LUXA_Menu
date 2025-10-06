"use client";

import MenuCard from "./MenuCard";
import { DrinkCategory } from "@/lib/data";

interface DrinksListProps {
  sectionParam: string | null;
  drinkCategories: DrinkCategory[];
}

export default function DrinksList({
  sectionParam,
  drinkCategories,
}: DrinksListProps) {
  // Find the selected category based on sectionParam
  const selectedCategory = sectionParam
    ? drinkCategories.find(
        (cat) =>
          cat.Category.toLowerCase().replace(/\s+/g, "-") === sectionParam
      )
    : null;

  if (!selectedCategory) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-accent text-xl">Category not found</div>
      </div>
    );
  }

  if (selectedCategory.Drinks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-accent text-xl">
          No drinks available in this category
        </div>
      </div>
    );
  }

  // Separate regular drinks from special items
  const regularDrinks = selectedCategory.Drinks.filter(
    (drink) => drink.type !== "special"
  );
  const specialDrinks = selectedCategory.Drinks.filter(
    (drink) => drink.type === "special"
  );

  return (
    <div className="space-y-8">
      {/* Regular Drinks Grid */}
      {regularDrinks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {regularDrinks.map((drink) => (
            <MenuCard
              key={drink.id}
              name={drink.name}
              description={drink.description || undefined}
              price={drink.price}
              isActive={drink.isActive}
              bgImage={drink.imageUrl || undefined}
              fontSize="text-[1.5rem]"
              fontFamily="font-roboto"
            />
          ))}
        </div>
      )}

      {/* Special Items Section */}
      {specialDrinks.length > 0 && (
        <div className="space-y-4">
          <div className="px-20 mb-8">
            <hr className="border-[#1a241b]"></hr>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {specialDrinks.map((drink) => (
              <MenuCard
                key={drink.id}
                name={drink.name}
                description={drink.description || undefined}
                price={drink.price}
                isActive={drink.isActive}
                bgImage={drink.imageUrl || undefined}
                fontSize="text-[1.5rem]"
                fontFamily="font-roboto"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
