"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import CategoryDropdown from '@/components/CategoryDropdown';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';

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
  const [venueName, setVenueName] = useState('');

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setVenueName(data[0].name);
      });
  }, []);

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
      <PageHeader title={venueName ? `${venueName} Menu` : '...'} />
      <main className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl">
        {loading ? (
          <LoadingSpinner />
        ) : tabParam === 'shisha' ? (
          <div>
            {SHISHA_TYPES.map(type => {
              // Get all brands for this type
              const brands = Array.from(new Set(
                items.filter(item => item.type === type.key && typeof item.brand === 'string' && item.brand.trim() !== '')
                  .map(item => item.brand as string)
              ));
              return (
                <CategoryDropdown
                  key={type.key}
                  category={type}
                  items={items}
                  openCategories={openTypes}
                  setOpenCategories={setOpenTypes}
                  openSubCategories={openTypes.includes(type.key) ? brands : []}
                  setOpenSubCategories={setOpenBrands}
                  subCategoryField="brand"
                  itemNameField="name"
                />
              );
            })}
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