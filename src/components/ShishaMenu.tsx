import { useState, useEffect } from 'react';
import ShishaTypes from '@/components/ShishaTypes';
import LeafMenu from '@/components/LeafMenu';

const SHISHA_TYPES = [
  { key: 'blond', label: 'Blond' },
  { key: 'dark', label: 'Dark' },
  { key: 'cigar', label: 'Cigar' },
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
  const [selections, setSelections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/shisha-flavors').then(res => res.json()),
      fetch('/api/shisha-selections').then(res => res.json())
    ]).then(([flavorsData, selectionsData]) => {
      setItems(flavorsData);
      setSelections(selectionsData);
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

  // Show selections for the selected type
  const activeType = typeParam || shishaType;
  
  return (
    <>
      {SHISHA_TYPES.map(type => {
        // Only show selections for the selected type
        if (activeType && activeType !== type.key) return null;
        
        // For dark leaf, show brands directly (no dropdown)
        if (activeType === 'dark') {
          // Find the "Finest" selection and get its dark brands
          const finestSelection = selections.find(selection => 
            selection.selection?.trim() === 'Finest'
          );
          
          if (!finestSelection) {
            return (
              <div key="dark" className="mb-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
                <div className="text-center text-gray-500 py-10">
                  No Finest selection found
                </div>
              </div>
            );
          }
          
          const darkBrands = finestSelection.brands
            .filter((brand: any) => brand.type === 'dark')
            .map((brand: any, brandIndex: number) => ({
              ...brand,
              id: brand.id || `brand-${brandIndex}`,
            }));
          
          return (
            <LeafMenu 
              key="dark" 
              leafType="dark" 
              selectionId={finestSelection.id} 
              brands={darkBrands}
            />
          );
        } 
        // For cigar leaf, show the new brand/flavor interface
        else if (activeType === 'cigar') {
          return <LeafMenu key="cigar" leafType="cigar" selectionId="3" />;
        }
        // For blond leaf, show placeholder UI
        else if (activeType === 'blond') {
          return (
            <div key={type.key} className="mb-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
              <div className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-600 text-xl font-semibold text-accent bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]">
                {type.label} Leaf - New UI
              </div>
              <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                <p className="text-accent text-center">New UI for {type.label.toLowerCase()} shisha</p>
                <p className="text-leaf text-sm text-center mt-2">
                  Coming soon...
                </p>
              </div>
            </div>
          );
        }
      })}
    </>
  );
}
