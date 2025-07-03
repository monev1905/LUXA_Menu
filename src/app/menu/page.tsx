"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
  section?: string;
  brand?: string;
  type?: string;
}

export default function MenuPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const sectionParam = searchParams.get('section');
  const [selectedTab, setSelectedTab] = useState(
    initialTab === 'shisha' ? 'shisha' : 'drink'
  );
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTypes, setOpenTypes] = useState<string[]>([]);
  const [openBrands, setOpenBrands] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    if (selectedTab === 'drink') {
      fetch('/api/drinks')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    } else if (selectedTab === 'shisha') {
      fetch('/api/shisha-flavors')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    }
  }, [selectedTab]);

  // Filter by section if present
  const filteredItems = sectionParam
    ? items.filter(item => item.section === sectionParam)
    : items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <header className="bg-gray-950 shadow-md py-6 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-300 tracking-tight">Shisha Lounge Menu</h1>
      </header>
      <main className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl">
        <div className="flex justify-center space-x-4 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${selectedTab === tab.key ? 'bg-purple-700 text-white border-purple-700 shadow' : 'bg-gray-800 text-purple-200 border-purple-900 hover:bg-purple-900'}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : selectedTab === 'shisha' ? (
          <div>
            {SHISHA_TYPES.map(type => {
              const brandsWithFlavors = Array.from(
                new Set(
                  items
                    .filter(item => item.type === type.key && typeof item.brand === 'string' && item.brand.trim() !== '')
                    .map(item => item.brand as string)
                )
              );
              return (
                <div key={type.key} className="mb-6">
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg border ${openTypes.includes(type.key) ? 'border-purple-400 bg-gray-800' : 'border-gray-600 bg-gray-900'} text-xl font-semibold text-purple-100 flex justify-between items-center mb-2 focus:outline-none transition-all duration-200 hover:border-purple-300`}
                    onClick={() => setOpenTypes(openTypes.includes(type.key)
                      ? openTypes.filter(t => t !== type.key)
                      : [...openTypes, type.key])}
                  >
                    {type.label} <span>{openTypes.includes(type.key) ? '▲' : '▼'}</span>
                  </button>
                  {openTypes.includes(type.key) && (
                    <div className="pl-2 mt-2">
                      {brandsWithFlavors.length === 0 && (
                        <div className="text-gray-400 text-sm pl-4">No brands available.</div>
                      )}
                      {brandsWithFlavors.map(brand => {
                        const flavors = items.filter(item => item.type === type.key && item.brand === brand);
                        if (!brand) return null;
                        return (
                          <div key={brand} className="mb-4">
                            <button
                              className={`w-full text-left px-4 py-2 rounded-lg border ${openBrands.includes(brand) ? 'border-purple-300 bg-gray-800' : 'border-gray-600 bg-gray-900'} text-base font-medium text-purple-200 flex justify-between items-center focus:outline-none transition-all duration-200 hover:border-purple-200`}
                              onClick={() => setOpenBrands(openBrands.includes(brand)
                                ? openBrands.filter((b: string) => b !== brand)
                                : [...openBrands, brand])}
                            >
                              {brand} <span>{openBrands.includes(brand) ? '▲' : '▼'}</span>
                            </button>
                            {openBrands.includes(brand) && (
                              <ul className="pl-4 mt-2 space-y-2">
                                {flavors.map(item => (
                                  <li key={item.id} className={`p-3 bg-gray-900 border border-gray-700 rounded-lg flex justify-between items-center ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                                    <span className="text-purple-100 font-normal">{item.name}</span>
                                    <span className="text-purple-300 font-semibold">${item.price.toFixed(2)}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No items found.</div>
        ) : (
          <ul className="space-y-6">
            {filteredItems.map(item => (
              <li
                key={item.id}
                className={`p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 group ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-purple-100 group-hover:text-purple-300 transition-colors duration-200">{item.name}</span>
                  <span className="text-lg font-semibold text-purple-400">${item.price.toFixed(2)}</span>
                </div>
                {item.description && (
                  <div className="text-gray-400 text-sm">{item.description}</div>
                )}
                {!item.isActive && (
                  <div className="mt-2 text-xs font-semibold text-red-400 uppercase tracking-wide">Not available</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
} 