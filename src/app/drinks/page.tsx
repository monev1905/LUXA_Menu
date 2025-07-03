import Link from 'next/link';

const drinkSections = [
  {
    key: 'lemonades',
    label: 'Lemonades & Iced Tea',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <circle cx="32" cy="32" r="28" fill="#a78bfa"/>
        <rect x="20" y="36" width="24" height="10" rx="5" fill="#fff"/>
        <rect x="28" y="18" width="8" height="18" rx="4" fill="#fff"/>
      </svg>
    ),
  },
  {
    key: 'alcohol',
    label: 'Alcohol',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <rect x="28" y="10" width="8" height="32" rx="4" fill="#a78bfa"/>
        <rect x="24" y="42" width="16" height="8" rx="4" fill="#fff"/>
        <circle cx="32" cy="54" r="6" fill="#a78bfa"/>
      </svg>
    ),
  },
  {
    key: 'smoothies',
    label: 'Smoothies & Milkshakes',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <ellipse cx="32" cy="44" rx="16" ry="10" fill="#a78bfa"/>
        <rect x="24" y="18" width="16" height="26" rx="8" fill="#fff"/>
      </svg>
    ),
  },
  {
    key: 'softdrinks',
    label: 'Soft Drinks',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <rect x="20" y="10" width="24" height="44" rx="8" fill="#a78bfa"/>
        <rect x="28" y="18" width="8" height="28" rx="4" fill="#fff"/>
        <circle cx="32" cy="54" r="4" fill="#fff"/>
      </svg>
    ),
  },
  {
    key: 'nuts',
    label: 'Nuts',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <ellipse cx="32" cy="44" rx="16" ry="10" fill="#a78bfa"/>
        <ellipse cx="32" cy="32" rx="8" ry="4" fill="#fff"/>
      </svg>
    ),
  },
  {
    key: 'hotdrinks',
    label: 'Hot Drinks',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <rect x="24" y="18" width="16" height="26" rx="8" fill="#a78bfa"/>
        <rect x="28" y="36" width="8" height="8" rx="4" fill="#fff"/>
      </svg>
    ),
  },
];

export default function DrinksEntrancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <header className="bg-gray-950 shadow-md py-6 mb-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-300 tracking-tight">Drinks Menu</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-4">
          {drinkSections.map(section => (
            <Link
              key={section.key}
              href={`/menu?tab=drink&section=${section.key}`}
              className="bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-gray-800 hover:border-purple-500 transition-all duration-200 group"
            >
              {section.icon}
              <span className="text-2xl font-bold text-purple-100 group-hover:text-purple-300 mt-2">{section.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
} 