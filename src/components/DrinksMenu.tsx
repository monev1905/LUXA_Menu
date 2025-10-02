"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuCard from './MenuCard';

interface DrinkCategory {
  id: string;
  Category: string;
  Order: number | null;
  imageUrl: string | null;
  Drinks: Drink[];
}

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

export default function DrinksMenu() {
  const [categories, setCategories] = useState<DrinkCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/drink-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch drink categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching drink categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-accent text-xl">Loading drinks...</div>
      </div>
    );
  }

  if (categories.length === 0) {
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
        {categories.map((category) => (
          <MenuCard
            key={category.id}
            name={category.Category}
            href={`/menu?tab=drink&section=${category.Category.toLowerCase().replace(/\s+/g, '-')}`}
            bgImage={category.imageUrl || undefined}
            fontSize="text-[1.75rem]"
            isActive={!sectionParam || sectionParam === category.Category.toLowerCase().replace(/\s+/g, '-')}
            fontFamily="font-roboto"
          />
        ))}
      </div>
    </div>
  );
}
