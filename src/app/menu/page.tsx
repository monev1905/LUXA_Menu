"use client";

import { useEffect, useState } from 'react';

const TABS = [
  { key: 'drink', label: 'Drinks' },
  { key: 'shisha', label: 'Shisha' },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

export default function MenuPage() {
  const [selectedTab, setSelectedTab] = useState('drink');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/menu-items?category=${selectedTab}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, [selectedTab]);

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
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No items found.</div>
        ) : (
          <ul className="space-y-6">
            {items.map(item => (
              <li
                key={item.id}
                className={`p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 group ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-purple-100 group-hover:text-purple-300 transition-colors duration-200">{item.name}</span>
                  <span className="text-lg font-semibold text-purple-400">${item.price.toFixed(2)}</span>
                </div>
                <div className="text-gray-400 text-sm">{item.description}</div>
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