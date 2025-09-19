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
  address: string;
  phone: string;
  mapUrl: string;
}

export default function LocationsPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [venueName, setVenueName] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/venues')
      .then(async res => {
        if (!res.ok) throw new Error('Network response was not ok');
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then(data => {
        setVenues(data);
        if (data && data.length > 0) setVenueName(data[0].name);
        setLoading(false);
      })
      .catch(() => {
        setVenues([]);
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
        title={venueName ? `${venueName}` : 'Locations'}
        subtitle="Locations"
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
          Find us at this location!
        </div>
        
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : venues.length === 0 ? (
          <div className="text-gray-400">No venues found.</div>
        ) : (
          <div className="w-full max-w-4xl px-4">
            {venues.map(venue => (
              <div key={venue.id} className="mb-8">
                <MenuCard
                  name={venue.name}
                  description={`${venue.address}\nOpen every day at 10:00 AM`}
                  isActive={true}
                  fontSize="text-2xl"
                  minHeight="h-[8rem]"
                />
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-700 w-full">
                  <iframe
                    src={venue.mapUrl}
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${venue.name} Location`}
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 