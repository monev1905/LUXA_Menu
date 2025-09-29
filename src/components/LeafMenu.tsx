import { useState, useEffect } from 'react';
import BrandCard from '@/components/BrandCard';

interface Brand {
  id: string;
  brand: string;
  type: string | null;
  logoUrl: string | null;
}

interface LeafMenuProps {
  leafType: string;
  selectionId?: string;
  brands?: Brand[]; // Optional brands prop for dark leaf
}

export default function LeafMenu({ leafType, selectionId, brands }: LeafMenuProps) {
  const [brandsState, setBrandsState] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If brands are provided (for dark leaf), use them directly
    if (brands && brands.length > 0) {
      setBrandsState(brands);
      setLoading(false);
      return;
    }

    // Otherwise, fetch brands from API (for cigar leaf)
    setLoading(true);
    Promise.all([
      fetch('/api/shisha-selections').then(res => res.json()),
      fetch('/api/shisha-flavors').then(res => res.json())
    ]).then(([selectionsData, flavorsData]) => {
      // Find the selection by ID or name
      const targetSelection = selectionsData.find((selection: any) => 
        selectionId ? selection.id === selectionId : 
        selection.selection?.trim().toLowerCase().includes(leafType.toLowerCase())
      );
      
      if (targetSelection) {
        // Get all brands of this type
        const allBrands = targetSelection.brands
          .filter((brand: any) => brand.type === leafType)
          .map((brand: any, index: number) => ({
            ...brand,
            id: brand.id || `${leafType}-brand-${index}`, // Ensure unique ID
          }));
        
        // Filter brands that have flavors
        const brandsWithFlavors = allBrands.filter((brand: any) => {
          const hasFlavors = flavorsData.some((flavor: any) => 
            flavor.brand === brand.brand && flavor.type === leafType
          );
          return hasFlavors;
        });
        
        setBrandsState(brandsWithFlavors);
      }
      
      setLoading(false);
    }).catch(error => {
      console.error(`Error fetching ${leafType} data:`, error);
      setLoading(false);
    });
  }, [leafType, selectionId, brands]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        Loading {leafType} leaf...
      </div>
    );
  }

  if (brandsState.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-accent text-xl font-semibold mb-2">{leafType.charAt(0).toUpperCase() + leafType.slice(1)} Leaf</h3>
        <p className="text-leaf text-sm">No {leafType} brands with flavors available yet</p>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 justify-start bg-transparent">
      {brandsState.map((brand, index) => (
        <BrandCard
          key={brand.id || `${leafType}-brand-${index}`} // Fallback key
          brand={brand}
        />
      ))}
    </div>
  );
}
