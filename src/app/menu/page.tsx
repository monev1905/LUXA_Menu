"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import CategoryDropdown from '@/components/CategoryDropdown';
import LoadingSpinner from '@/components/LoadingSpinner';

const TABS = [
  { key: 'drink', label: 'Drinks' },
  { key: 'shisha', label: 'Shisha' },
];

const SHISHA_TYPES = [
  { key: 'blond', label: 'Blond' },
  { key: 'black', label: 'Black' },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  type?: string;
  brand?: string;
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const typeParam = searchParams.get('type');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTypes, setOpenTypes] = useState<string[]>([]);
  const [openBrands, setOpenBrands] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    if (tabParam === 'shisha') {
      fetch('/api/shisha-flavors')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    } else {
      fetch('/api/drinks')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    }
  }, [tabParam]);

  // Filter by type if present
  const filteredItems = typeParam
    ? items.filter(item => item.type === typeParam)
    : items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="bg-gray-950 shadow-md py-6 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-300 tracking-tight">Shisha Lounge Menu</h1>
      </header>
      <main className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl">
        {loading ? (
          <LoadingSpinner />
        ) : tabParam === 'shisha' ? (
          <div>
            {SHISHA_TYPES.map(type => (
              <CategoryDropdown
                key={type.key}
                category={type}
                items={items}
                openCategories={openTypes}
                setOpenCategories={setOpenTypes}
                openSubCategories={openBrands}
                setOpenSubCategories={setOpenBrands}
                subCategoryField="brand"
                itemNameField="name"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No items found.</div>
        ) : (
          <ul className="space-y-6">
            {filteredItems.map(item => (
              <MenuCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                isActive={item.isActive}
                type={item.type}
                brand={item.brand}
                category={item.category}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 