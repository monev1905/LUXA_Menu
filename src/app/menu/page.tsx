"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MenuCard from '@/components/MenuCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import DrinksMenu from '@/components/DrinksMenu';
import ShishaMenu from '@/components/ShishaMenu';

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const typeParam = searchParams.get('type');
  const sectionParam = searchParams.get('section');
  const [loading, setLoading] = useState(true);
  const [venueName, setVenueName] = useState('');
  const [venueSubtitle, setVenueSubtitle] = useState('');
  const [shishaType, setShishaType] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setVenueName(data[0].name);
          setVenueSubtitle(data[0].subtitle || '');
        }
        setLoading(false);
      });
  }, []);

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
        ) : tabParam === 'drink' ? (
          <DrinksMenu sectionParam={sectionParam} />
        ) : tabParam === 'shisha' ? (
          <ShishaMenu 
            typeParam={typeParam} 
            shishaType={shishaType} 
            onShishaTypeChange={setShishaType} 
          />
        ) : null}
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
