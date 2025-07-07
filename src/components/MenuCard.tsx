interface MenuCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  type?: string;
  brand?: string;
  category?: string;
}

export default function MenuCard({ 
  id, 
  name, 
  description, 
  price, 
  isActive, 
  type, 
  brand, 
  category 
}: MenuCardProps) {
  return (
    <li
      className={`px-4 py-3 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 group border-2 border-forest bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e] ${!isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-accent group-hover:text-leaf transition-colors duration-200">
          {name}
        </span>
        <span className="text-lg font-semibold text-leaf">
          ${price.toFixed(2)}
        </span>
      </div>
      
      {description && (
        <div className="text-leaf text-sm mb-2">
          {description}
        </div>
      )}
      
      {brand && (
        <div className="text-xs text-blue mb-1">
          Brand: {brand}
        </div>
      )}
      
      {!isActive && (
        <div className="mt-2 text-xs font-semibold text-brown uppercase tracking-wide">
          Not available
        </div>
      )}
    </li>
  );
} 