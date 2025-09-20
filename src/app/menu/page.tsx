"use client";

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';

const SHISHA_TYPES = [
  { key: 'blond', label: 'Blond' },
  { key: 'dark', label: 'Dark' },
];

const DRINK_TYPES = [
  { key: 'lemonades', label: 'Lemonades & Iced Tea', emoji: '🍋' },
  { key: 'alcohol', label: 'Alcohol', emoji: '🥃' },
  { key: 'smoothies', label: 'Smoothies & Milkshakes', emoji: '🥤' },
  { key: 'softdrinks', label: 'Soft Drinks', emoji: '🥤' },
  { key: 'nuts', label: 'Nuts', emoji: '🥜' },
  { key: 'hotdrinks', label: 'Hot Drinks', emoji: '☕' },
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  type?: string;
  brand?: string;
}

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const typeParam = searchParams.get('type');
  const sectionParam = searchParams.get('section');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openBrands, setOpenBrands] = useState<string[]>([]);
  const [venueName, setVenueName] = useState('');
  const [venueSubtitle, setVenueSubtitle] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const [dynamicPadding, setDynamicPadding] = useState(0);
  const [shishaType, setShishaType] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setVenueName(data[0].name);
          setVenueSubtitle(data[0].subtitle || '');
        }
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (tabParam === 'shisha') {
      fetch('/api/shisha-flavors')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    } else {
      fetch('/api/drinks')
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });
    }
  }, [tabParam]);

  useEffect(() => {
    if (tabParam === 'shisha' && headerRef.current && tocRef.current) {
      setDynamicPadding(headerRef.current.offsetHeight + tocRef.current.offsetHeight + 16); // 16px extra spacing
    } else {
      setDynamicPadding(0);
    }
  }, [tabParam, venueName, items]);

  // Filter by type if present (for shisha) or section (for drinks)
  const filteredItems = (tabParam === 'shisha' && (typeParam || shishaType))
    ? items.filter(item => item.type === (typeParam || shishaType))
    : (tabParam === 'drink' && sectionParam)
      ? items.filter(item => item.type === sectionParam)
      : items;

  // Show back button whenever in shisha or drinks menu
  const showBackButton = tabParam === 'shisha' || tabParam === 'drink';
  const handleBack = () => {
    if (tabParam === 'shisha') {
      if (typeParam || shishaType) {
        setShishaType(null);
        router.replace('/menu?tab=shisha');
      } else {
        router.replace('/menu');
      }
    } else if (tabParam === 'drink') {
      if (sectionParam) {
        router.replace('/menu?tab=drink');
      } else {
        router.replace('/menu');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Hexagon SVG pattern overlay */}
      <svg className="fixed inset-0 w-full h-full -z-10 opacity-20 pointer-events-none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexPattern" width="48" height="55.425" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <polygon points="24,0 48,13.856 48,41.568 24,55.425 0,41.568 0,13.856" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
      {/* Animated shine effect */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none" style={{overflow: 'hidden'}}>
        <div className="absolute w-[150%] h-[60%] left-[-25%] top-[40%] opacity-10 rotate-12 animate-shine" style={{background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)'}} />
      </div>
      <PageHeader
        title={venueName ? `${venueName}` : ''}
        subtitle={venueSubtitle || ''}
        leftSlot={<HamburgerMenu inHeader />}
        rightSlot={showBackButton && (
          <button
            onClick={handleBack}
            className="p-2 rounded-md bg-jungle-dark text-accent hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Back"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      />
      <main className="w-full min-h-[60vh] flex flex-col items-center p-8 bg-transparent">
        {loading ? (
          <LoadingSpinner />
        ) : !tabParam ? (
          // Show main menu cards when no tab is selected
          <div className="flex-1 flex flex-col items-center justify-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-4">
              <MenuCard
                key="drink"
                name="Drinks"
                href="/menu?tab=drink"
                bgImage="/cocktail.png"
                minHeight="h-[10rem]"
              />
              <MenuCard
                key="shisha"
                name="Shisha"
                href="/menu?tab=shisha"
                bgImage="/hookah.png"
                minHeight="h-[10rem]"
              />
            </div>
          </div>
        ) : tabParam === 'shisha' && !typeParam && !shishaType ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 px-4 justify-start bg-transparent">
            <MenuCard
              name="Blond Leaf"
              description=""
              price={0}
              isActive={true}
              onClick={() => setShishaType('blond')}
              fontSize="text-xl"
            />
            <MenuCard
              name="Dark Leaf"
              description=""
              price={0}
              isActive={true}
              onClick={() => setShishaType('dark')}
              fontSize="text-xl"
            />
          </div>
        ) : tabParam === 'drink' && !sectionParam ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 px-4 justify-start">
            {DRINK_TYPES.map(type => (
              <MenuCard
                key={type.key}
                name={type.label}
                description={undefined}
                price={0}
                isActive={true}
                onClick={() => router.replace(`/menu?tab=drink&section=${type.key}`)}
                fontSize="text-xl"
              />
            ))}
          </div>
        ) : tabParam === 'shisha' ? (
          <>
            {SHISHA_TYPES.map(type => {
              // Only show brands for the selected type (shishaType or typeParam)
              const activeType = typeParam || shishaType;
              if (activeType && activeType !== type.key) return null;
              const brands = Array.from(new Set(
                items.filter(item => item.type === type.key && typeof item.brand === 'string' && item.brand.trim() !== '')
                  .map(item => item.brand as string)
              ));
              return brands.map(brand => {
                const brandItems = items.filter(item => item.type === type.key && item.brand === brand);
                return (
                  <div key={brand} id={`shisha-${type.key}-${brand.replace(/\s+/g, '-')}`} className="mb-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 ${openBrands.includes(brand) ? 'border-accent' : 'border-gray-600'} text-xl font-semibold text-accent flex justify-between items-center focus:outline-none transition-all duration-200 hover:border-leaf`}
                      style={{ fontFamily: 'CardFont, sans-serif' }}
                      onClick={() => setOpenBrands(openBrands.includes(brand)
                        ? openBrands.filter(b => b !== brand)
                        : [brand])}
                    >
                      {brand} 
                      <span className="ml-2 transition-transform duration-200">
                        {openBrands.includes(brand) ? (
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
                    {openBrands.includes(brand) && (
                      <ul className="mt-2 space-y-2 w-full">
                        {brandItems.map(item => (
                          <li key={item.id} className={`w-[90%] mx-auto p-3 rounded-lg flex justify-between items-center border-2 border-gray-600 ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                            <span className="text-accent font-roboto">{item.name}</span>
                            <span className="text-leaf font-roboto">${item.price.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              });
            })}
          </>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No items found.</div>
        ) : (
          <ul className="space-y-6 w-[95vw] sm:w-[22rem] md:w-[25rem]">
            {filteredItems.map(item => (
              <li
                key={item.id}
                className={`w-[90%] mx-auto p-4 rounded-xl flex flex-col border-2 border-gray-600 shadow-md transition-all duration-200 ${!item.isActive ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                style={{ fontFamily: 'CardFont, sans-serif', fontWeight: 500, letterSpacing: '0.01em' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg text-leaf font-bold">{item.name}</span>
                  <span className="text-leaf font-semibold text-base font-roboto">${item.price.toFixed(2)}</span>
                </div>
                {item.description && (
                  <div className="text-accent text-sm mb-1 font-roboto">{item.description}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
} 