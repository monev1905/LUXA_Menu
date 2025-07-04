'use client';
import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        setVenues(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center pt-12 pb-24">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-200 mb-2">Reservations</h2>
      <div className="text-lg text-gray-400 text-center mb-8" style={{ paddingInline: 'calc(var(--spacing) * 4)' }}>Call us to reserve your table or ask for more info.</div>
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
    </div>
  );
} 