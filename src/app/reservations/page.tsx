'use client';
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';

interface Venue {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
}

export default function ReservationsPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [venueName, setVenueName] = useState('');

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        setVenues(data);
        if (data && data.length > 0) setVenueName(data[0].name);
        setLoading(false);
      });
  }, []);

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
        title={venueName ? `${venueName} Reservations` : 'Reservations'}
        leftSlot={<HamburgerMenu inHeader />}
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
          <ul className="w-full max-w-xl px-4">
            {venues.map(venue => (
              <li key={venue.id} className="bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-gray-800 mb-8">
                <span className="text-2xl font-bold text-purple-100 mb-4 text-center">{venue.name}</span>
                <span className="text-gray-300 text-lg mb-2 text-center">{venue.address}</span>
                <span className="text-purple-400 text-lg font-semibold mb-1 text-center">Phone: <a href={`tel:${venue.phone.replace(/\s+/g, '')}`} className="hover:underline">{venue.phone}</a></span>
              </li>
            ))}
          </ul>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 