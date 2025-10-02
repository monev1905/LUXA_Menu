"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuCard from './MenuCard';

interface Drink {
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
  unit_type: 'мл' | 'гр';
}

interface DrinkCategory {
  id: string;
  Category: string;
  Order: number | null;
  imageUrl: string | null;
  Drinks: Drink[];
}

interface DrinksListProps {
  sectionParam: string | null;
}

export default function DrinksList({ sectionParam }: DrinksListProps) {
  const [categories, setCategories] = useState<DrinkCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/drink-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch drink categories');
        }
        const data = await response.json();
        setCategories(data);
        
        // Find the selected category based on sectionParam
        if (sectionParam) {
          const category = data.find((cat: DrinkCategory) => 
            cat.Category.toLowerCase().replace(/\s+/g, '-') === sectionParam
          );
          setSelectedCategory(category || null);
        }
      } catch (error) {
        console.error('Error fetching drink categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, [sectionParam]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-accent text-xl">Loading drinks...</div>
      </div>
    );
  }

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
        <div className="text-accent text-xl">No drinks available in this category</div>
      </div>
    );
  }

  // Separate regular drinks from special items
  const regularDrinks = selectedCategory.Drinks.filter(drink => drink.type !== 'special');
  const specialDrinks = selectedCategory.Drinks.filter(drink => drink.type === 'special');

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
            />
          ))}
        </div>
      )}

      {/* Special Items Section */}
      {specialDrinks.length > 0 && (
        <div className="space-y-4">
          <div className="mb-8 px-20">
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
