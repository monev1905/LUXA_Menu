'use client';
import React, { useEffect, useState } from 'react';

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
        setLoading(false);
      })
      .catch(() => {
        setVenues([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center pt-12 pb-24 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-200 mb-8">Find us at this location!</h2>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : venues.length === 0 ? (
        <div className="text-gray-400">No venues found.</div>
      ) : (
        venues.map(venue => (
          <div key={venue.id} className="bg-gray-900 rounded-2xl shadow-xl p-2 flex flex-col items-center border-2 border-gray-800 mb-8 max-w-xl w-full mx-auto">
            <span className="text-2xl font-bold text-purple-100 mb-4 text-center">{venue.name}</span>
            <span className="text-gray-300 text-lg mb-2 text-center">{venue.address}</span>
            <span className="text-gray-400 text-base mb-4 text-center">Open every day at 10:00 AM</span>
            <div className="rounded-xl overflow-hidden border border-gray-700 w-full">
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
        ))
      )}
    </div>
  );
} 