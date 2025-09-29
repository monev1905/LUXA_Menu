import { useRouter } from 'next/navigation';

interface BrandCardProps {
  brand: {
    id: string;
    brand: string;
    type: string | null;
    logoUrl: string | null;
  };
}

export default function BrandCard({ brand }: BrandCardProps) {
  const router = useRouter();

  const handleBrandClick = () => {
    // Use brand name as the identifier since IDs are empty
    const brandIdentifier = encodeURIComponent(brand.brand);
    router.push(`/flavors/${brandIdentifier}`);
  };

  return (
    <div 
      className="relative w-[90%] mx-auto rounded-lg border-2 border-gray-600 overflow-hidden cursor-pointer hover:border-accent transition-all duration-200"
      style={{
        backgroundImage: brand.logoUrl ? `url(${brand.logoUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '180px'
      }}
      onClick={handleBrandClick}
    >
      {/* Brand name - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="text-end">
          <span className="text-leaf font-roboto text-xl font-semibold">{brand.brand}</span>
        </div>
      </div>

      {/* Fallback content if no logo */}
      {!brand.logoUrl && (
        <div className="flex items-center justify-center h-44 bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]">
          <div className="text-center">
            <div className="text-accent font-roboto text-lg font-semibold">{brand.brand}</div>
          </div>
        </div>
      )}
    </div>
  );
}
