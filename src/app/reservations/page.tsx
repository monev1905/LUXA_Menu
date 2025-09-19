'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';
import MenuCard from '@/components/MenuCard';

interface Venue {
  id: string;
  name: string;
  subtitle?: string;
  address: string;
  phone: string;
  mapUrl: string;
}

export default function ReservationsPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [venueName, setVenueName] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        setVenues(data);
        if (data && data.length > 0) setVenueName(data[0].name);
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    router.push('/menu');
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
        title={venueName ? `${venueName}` : 'Reservations'}
        subtitle={venues.length > 0 && venues[0].subtitle ? venues[0].subtitle : 'Reservations'}
        leftSlot={<HamburgerMenu inHeader />}
        rightSlot={
          <button
            onClick={handleBack}
            className="p-2 rounded-md bg-jungle-dark text-accent hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Back to Menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />
      
      <main className="w-full min-h-[60vh] flex flex-col items-center p-8 bg-transparent">
        <div className="text-lg text-gray-400 text-center mb-8" style={{ paddingInline: 'calc(var(--spacing) * 4)' }}>
          Call us to reserve your table or ask for more info.
        </div>
        
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : venues.length === 0 ? (
          <div className="text-gray-400">No venues found.</div>
        ) : (
          <div className="flex justify-center w-full max-w-4xl px-4">
            {venues.map(venue => (
              <MenuCard
                key={venue.id}
                name={venue.name}
                description={`${venue.address}\nPhone: ${venue.phone}`}
                isActive={true}
                fontSize="text-2xl"
                minHeight="h-[12rem]"
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 