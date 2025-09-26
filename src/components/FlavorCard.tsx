interface FlavorCardProps {
  flavor: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    imageUrl: string;
    brand: string | null;
    type: string | null;
  };
}

export default function FlavorCard({ flavor }: FlavorCardProps) {
  return (
    <div 
      className={`relative w-[90%] mx-auto rounded-lg border-2 border-gray-600 overflow-hidden mb-4 ${!flavor.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
      style={{
        backgroundImage: flavor.imageUrl ? `url(${flavor.imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '180px'
      }}
    >
      {/* Flavor info - positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="text-right">
          <h3 className="text-leaf font-roboto text-xl font-semibold mb-1">{flavor.name}</h3>
          {flavor.description && (
            <p className="text-accent text-sm mb-2">{flavor.description}</p>
          )}
        </div>
      </div>

      {/* Fallback content if no image */}
      {!flavor.imageUrl && (
        <div className="flex items-center justify-center h-44 bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]">
          <div className="text-center">
            <div className="text-accent font-roboto text-lg font-semibold">{flavor.name}</div>
            {flavor.description && (
              <div className="text-leaf text-sm mt-2">{flavor.description}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
