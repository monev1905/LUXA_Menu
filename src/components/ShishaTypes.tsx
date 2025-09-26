import { useState, useEffect } from 'react';
import MenuCard from '@/components/MenuCard';

interface ShishaTypesProps {
  onTypeSelect: (type: string) => void;
}

const SHISHA_TYPES = [
  { key: 'blond', label: 'Blond Leaf' },
  { key: 'dark', label: 'Dark Leaf' },
  { key: 'cigar', label: 'Cigar Leaf' },
];

export default function ShishaTypes({ onTypeSelect }: ShishaTypesProps) {
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/shisha-selections').then(res => res.json()),
      fetch('/api/shisha-flavors').then(res => res.json())
    ]).then(([selectionsData, flavorsData]) => {
      const typesWithBrands = SHISHA_TYPES.filter(type => {
        let hasBrandsWithFlavors = false;
        
        if (type.key === 'dark') {
          // For dark leaf, check in "Finest" and "Classic" selections
          const darkSelections = selectionsData.filter((sel: any) => 
            sel.selection?.trim() === 'Finest' || sel.selection?.trim() === 'Classic'
          );
          
          hasBrandsWithFlavors = darkSelections.some((selection: any) => {
            return selection.brands.some((brand: any) => {
              if (brand.type !== 'dark') return false;
              
              const hasFlavors = flavorsData.some((flavor: any) => 
                flavor.brand === brand.brand && flavor.type === 'dark'
              );
              
              return hasFlavors;
            });
          });
        } else if (type.key === 'cigar') {
          // For cigar leaf, check in selection with id='3' or name containing 'cigar'
          const cigarSelection = selectionsData.find((sel: any) => 
            sel.id === '3' || sel.selection?.trim().toLowerCase().includes('cigar')
          );
          
          if (cigarSelection) {
            hasBrandsWithFlavors = cigarSelection.brands.some((brand: any) => {
              if (brand.type !== 'cigar') return false;
              
              const hasFlavors = flavorsData.some((flavor: any) => 
                flavor.brand === brand.brand && flavor.type === 'cigar'
              );
              
              return hasFlavors;
            });
          }
        } else if (type.key === 'blond') {
          // For blond leaf, check in any selection that might contain blond brands
          const blondSelection = selectionsData.find((sel: any) => 
            sel.selection?.trim().toLowerCase().includes('blond')
          );
          
          if (blondSelection) {
            hasBrandsWithFlavors = blondSelection.brands.some((brand: any) => {
              if (brand.type !== 'blond') return false;
              
              const hasFlavors = flavorsData.some((flavor: any) => 
                flavor.brand === brand.brand && flavor.type === 'blond'
              );
              
              return hasFlavors;
            });
          }
        }
        
        return hasBrandsWithFlavors;
      });
      
      setAvailableTypes(typesWithBrands.map(t => t.key));
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching shisha data:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        Loading shisha types...
      </div>
    );
  }

  if (availableTypes.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-accent text-xl font-semibold mb-2">No Shisha Available</h3>
        <p className="text-leaf text-sm">No shisha types with flavors available yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 px-4 justify-start bg-transparent">
      {SHISHA_TYPES.filter(type => availableTypes.includes(type.key)).map(type => (
        <MenuCard
          key={type.key}
          name={type.label}
          description=""
          isActive={true}
          onClick={() => onTypeSelect(type.key)}
          fontSize="text-xl"
        />
      ))}
    </div>
  );
}
