import BrandCard from "@/components/BrandCard";
import { ShishaSelection, ShishaFlavor, ShishaBrand } from "@/lib/data";

interface LeafMenuProps {
  leafType: string;
  selectionId?: string;
  brands?: ShishaBrand[]; // Optional brands prop for dark leaf
  shishaSelections: ShishaSelection[];
  shishaFlavors: ShishaFlavor[];
}

export default function LeafMenu({
  leafType,
  selectionId,
  brands,
  shishaSelections,
  shishaFlavors,
}: LeafMenuProps) {
  // If brands are provided (for dark leaf), use them directly
  if (brands && brands.length > 0) {
    return (
      <div className="mb-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 justify-start bg-transparent">
        {brands.map((brand, index) => (
          <BrandCard
            key={brand.id || `${leafType}-brand-${index}`}
            brand={brand}
          />
        ))}
      </div>
    );
  }

  // Otherwise, find brands from provided data (for cigar leaf)
  const targetSelection = shishaSelections.find((selection) =>
    selectionId
      ? selection.id === selectionId
      : selection.selection
          ?.trim()
          .toLowerCase()
          .includes(leafType.toLowerCase())
  );

  if (!targetSelection) {
    return (
      <div className="text-center py-10">
        <h3 className="text-accent text-xl font-semibold mb-2">
          {leafType.charAt(0).toUpperCase() + leafType.slice(1)} Leaf
        </h3>
        <p className="text-leaf text-sm">
          No selection found for {leafType} leaf
        </p>
      </div>
    );
  }

  // Get all brands of this type
  const allBrands = targetSelection.brands
    .filter((brand) => brand.type === leafType)
    .map((brand, index) => ({
      ...brand,
      id: brand.id || `${leafType}-brand-${index}`, // Ensure unique ID
    }));

  // Filter brands that have flavors
  const brandsWithFlavors = allBrands.filter((brand) => {
    const hasFlavors = shishaFlavors.some(
      (flavor) => flavor.brand === brand.brand && flavor.type === leafType
    );
    return hasFlavors;
  });

  if (brandsWithFlavors.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-accent text-xl font-semibold mb-2">
          {leafType.charAt(0).toUpperCase() + leafType.slice(1)} Leaf
        </h3>
        <p className="text-leaf text-sm">
          No {leafType} brands with flavors available yet
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4 justify-start bg-transparent">
      {brandsWithFlavors.map((brand, index) => (
        <BrandCard
          key={brand.id || `${leafType}-brand-${index}`} // Fallback key
          brand={brand}
        />
      ))}
    </div>
  );
}
