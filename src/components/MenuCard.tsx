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
      className={`p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 group ${!isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-xl font-bold text-purple-100 group-hover:text-purple-300 transition-colors duration-200">
          {name}
        </span>
        <span className="text-lg font-semibold text-purple-400">
          ${price.toFixed(2)}
        </span>
      </div>
      
      {description && (
        <div className="text-gray-400 text-sm mb-2">
          {description}
        </div>
      )}
      
      {type && (
        <div className="text-xs text-purple-400 mb-1">
          Type: {type}
        </div>
      )}
      
      {brand && (
        <div className="text-xs text-purple-400 mb-1">
          Brand: {brand}
        </div>
      )}
      
      {!isActive && (
        <div className="mt-2 text-xs font-semibold text-red-400 uppercase tracking-wide">
          Not available
        </div>
      )}
    </li>
  );
} 