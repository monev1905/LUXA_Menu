import React, { useState } from 'react';

interface ShishaTocProps {
  items: { brand?: string; type?: string }[];
  setOpenTypes: (types: string[]) => void;
  setOpenBrands: (brands: string[]) => void;
}

const TYPE_LABELS: Record<string, string> = {
  blond: 'Blond',
  black: 'Black',
};

export default function ShishaToc({ items, setOpenTypes, setOpenBrands }: ShishaTocProps) {
  const types = ['blond', 'black'];
  const [activeType, setActiveType] = useState('blond');

  // Group brands by type
  const brandsByType: Record<string, string[]> = {};
  types.forEach(type => {
    brandsByType[type] = Array.from(
      new Set(
        items.filter(item => item.type === type && item.brand && item.brand.trim() !== '').map(item => item.brand as string)
      )
    );
  });

  function handleBrandClick(type: string, brand: string) {
    setOpenTypes([type]);
    setOpenBrands([brand]);
    const el = document.getElementById(`shisha-${type}-${brand.replace(/\s+/g, '-')}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <nav className="sticky top-14 z-30 w-full bg-gray-900/95 shadow flex flex-row items-center px-1 mx-auto max-w-2xl" style={{minHeight: '44px'}}>
      {/* Type selector */}
      <div className="flex flex-row space-x-2 mr-2">
        {types.map(type => (
          <button
            key={type}
            className={`px-3 py-1 rounded-full text-base font-bold border-2 transition-colors duration-200 focus:outline-none ${activeType === type ? 'bg-purple-700 text-white border-purple-700 shadow' : 'bg-gray-800 text-purple-200 border-purple-900 hover:bg-purple-900'}`}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>
      {/* Brands for active type */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-row space-x-2 min-w-max">
          {brandsByType[activeType].map(brand => (
            <button
              key={brand}
              onClick={() => handleBrandClick(activeType, brand)}
              className="px-3 py-1 rounded-lg bg-gray-800 text-purple-100 text-sm border border-gray-700 hover:border-purple-400 whitespace-nowrap transition-colors"
              type="button"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
} 