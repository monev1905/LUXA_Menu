import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MenuCard from '@/components/MenuCard';

const DRINK_TYPES = [
  { key: 'lemonades', label: 'Lemonades & Iced Tea', emoji: '🍋' },
  { key: 'alcohol', label: 'Alcohol', emoji: '🥃' },
  { key: 'smoothies', label: 'Smoothies & Milkshakes', emoji: '🥤' },
  { key: 'softdrinks', label: 'Soft Drinks', emoji: '��' },
  { key: 'nuts', label: 'Nuts', emoji: '🥜' },
  { key: 'hotdrinks', label: 'Hot Drinks', emoji: '☕' },
];

interface MenuItem {
  id: string;
  name: string;
  price?: number;
  isActive: boolean;
  type?: string;
  imageUrl?: string;
}

interface DrinksMenuProps {
  sectionParam: string | null;
}

export default function DrinksMenu({ sectionParam }: DrinksMenuProps) {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/drinks')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Loading drinks...</div>;
  }

  if (!sectionParam) {
    // Show drink categories
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 justify-start">
        {DRINK_TYPES.map(type => (
          <MenuCard
            key={type.key}
            name={type.label}
            description={undefined}
            price={0}
            isActive={true}
            onClick={() => router.replace(`/menu?tab=drink&section=${type.key}`)}
            fontSize="text-[1.50rem]"
          />
        ))}
      </div>
    );
  }

  // Show filtered drinks for the selected section
  const filteredItems = items.filter(item => item.type === sectionParam);

  if (filteredItems.length === 0) {
    return <div className="text-center text-gray-500 py-10">No drinks found.</div>;
  }

  return (
    <ul className="space-y-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
      {filteredItems.map(item => (
        <li
          key={item.id}
          className={`w-[90%] mx-auto p-4 rounded-xl flex flex-col border-2 border-gray-600 shadow-md transition-all duration-200 ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
          style={{ fontFamily: 'CardFont, sans-serif', fontWeight: 500, letterSpacing: '0.01em' }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg text-leaf font-bold">{item.name}</span>
            <span className="text-leaf font-semibold text-base font-roboto">${item.price?.toFixed(2) || '0.00'}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
