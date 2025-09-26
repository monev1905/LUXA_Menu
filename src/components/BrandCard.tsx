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
      className="relative w-[90%] mx-auto rounded-lg border-2 border-gray-600 overflow-hidden mb-4 cursor-pointer hover:border-accent transition-all duration-200"
      style={{
        backgroundImage: brand.logoUrl ? `url(${brand.logoUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '150px'
      }}
      onClick={handleBrandClick}
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
    </div>
  );
}
