import { useState, useEffect } from 'react';
import ShishaTypes from '@/components/ShishaTypes';
import ShishaBrandDropdown from '@/components/ShishaBrandDropdown';

const SHISHA_TYPES = [
  { key: 'blond', label: 'Blond' },
  { key: 'dark', label: 'Dark' },
];

interface MenuItem {
  id: string;
  name: string;
  price?: number;
  isActive: boolean;
  type?: string;
  brand?: string;
  imageUrl?: string;
}

interface ShishaMenuProps {
  typeParam: string | null;
  shishaType: string | null;
  onShishaTypeChange: (type: string | null) => void;
}

export default function ShishaMenu({ typeParam, shishaType, onShishaTypeChange }: ShishaMenuProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBrands, setOpenBrands] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/shisha-flavors')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Loading shisha...</div>;
  }

  if (!typeParam && !shishaType) {
    // Show shisha type selection
    return <ShishaTypes onTypeSelect={onShishaTypeChange} />;
  }

  // Show brands for the selected type
  const activeType = typeParam || shishaType;
  
  return (
    <>
      {SHISHA_TYPES.map(type => {
        // Only show brands for the selected type
        if (activeType && activeType !== type.key) return null;
        
        const brands = Array.from(new Set(
          items.filter(item => item.type === type.key && typeof item.brand === 'string' && item.brand.trim() !== '')
            .map(item => item.brand as string)
        ));
        
        return brands.map(brand => {
          const brandItems = items.filter(item => item.type === type.key && item.brand === brand);
          
          // Different behavior based on active type
          if (activeType === 'dark') {
            // Current behavior for dark shisha
            return (
              <ShishaBrandDropdown
                key={brand}
                brand={brand}
                items={brandItems}
                isOpen={openBrands.includes(brand)}
                onToggle={() => setOpenBrands(openBrands.includes(brand)
                  ? openBrands.filter(b => b !== brand)
                  : [brand])}
              />
            );
          } else {
            // New UI for blond and cigar
            return (
              <div key={brand} className="mb-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
                <div className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-600 text-xl font-semibold text-accent bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]">
                  {brand} - New UI
                </div>
                <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                  <p className="text-accent text-center">New UI for {activeType} shisha</p>
                  <p className="text-leaf text-sm text-center mt-2">
                    {brandItems.length} items available
                  </p>
                </div>
              </div>
            );
          }
        });
      })}
    </>
  );
}
