import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ShishaSelectionDropdownProps {
  selection: string;
  brands: Array<{
    id: string;
    brand: string;
    type: string | null;
    logoUrl: string | null;
  }>;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ShishaSelectionDropdown({ 
  selection, 
  brands, 
  isOpen, 
  onToggle 
}: ShishaSelectionDropdownProps) {
  const router = useRouter();
  const [brandsWithFlavors, setBrandsWithFlavors] = useState<any[]>([]);

  useEffect(() => {
    // Fetch flavors data to filter brands
    fetch('/api/shisha-flavors')
      .then(res => res.json())
      .then(flavorsData => {
        // Filter brands that have flavors
        const filteredBrands = brands.filter((brand: any) => {
          const hasFlavors = flavorsData.some((flavor: any) => 
            flavor.brand === brand.brand && flavor.type === brand.type
          );
          return hasFlavors;
        });
        
        setBrandsWithFlavors(filteredBrands);
      })
      .catch(error => {
        console.error('Error fetching flavors:', error);
        setBrandsWithFlavors(brands); // Fallback to original brands
      });
  }, [brands]);

  const handleBrandClick = (brand: any) => {
    // Navigate to flavors page for the selected brand
    const brandIdentifier = encodeURIComponent(brand.brand);
    router.push(`/flavors/${brandIdentifier}`);
  };

  // Don't show dropdown if no brands have flavors
  if (brandsWithFlavors.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
      <button
        className={`w-full text-left px-4 py-3 rounded-lg border-2 ${isOpen ? 'border-accent' : 'border-gray-600'} text-xl font-semibold text-accent flex justify-between items-center focus:outline-none transition-all duration-200 hover:border-leaf`}
        style={{ fontFamily: 'CardFont, sans-serif' }}
        onClick={onToggle}
      >
        {selection} 
        <span className="ml-2 transition-transform duration-200">
          {isOpen ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </span>
      </button>
      
      {isOpen && (
        <ul className="mt-2 space-y-2 w-full">
          {brandsWithFlavors.map((brand, index) => (
            <li 
              key={brand.id || `brand-${index}`} 
              className="relative w-[90%] mx-auto rounded-lg border-2 border-gray-600 overflow-hidden cursor-pointer hover:border-accent transition-all duration-200"
              style={{
                backgroundImage: brand.logoUrl ? `url(${brand.logoUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '120px'
              }}
              onClick={() => handleBrandClick(brand)}
            >
              {/* Brand name - positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <div className="text-right">
                  <span className="text-leaf font-roboto text-lg font-semibold">{brand.brand}</span>
                </div>
              </div>

              {/* Fallback content if no logo */}
              {!brand.logoUrl && (
                <div className="flex items-center justify-center h-32 bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]">
                  <div className="text-center">
                    <div className="text-accent font-roboto text-sm">{brand.brand}</div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
