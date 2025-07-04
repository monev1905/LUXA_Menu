'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Footer() {
  const [venueName, setVenueName] = useState('');

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setVenueName(data[0].name);
      });
  }, []);

  return (
    <footer className="w-full border-t border-gray-700 bg-gray-900 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <div className="flex space-x-8 text-gray-300 text-lg md:text-base justify-center md:justify-start w-full md:w-auto">
          <Link href="/locations" className="hover:text-purple-300 transition-colors">Locations</Link>
          <Link href="/reservations" className="hover:text-purple-300 transition-colors">Reservations</Link>
        </div>
        <div className="text-gray-400 text-center md:text-right text-base md:text-sm w-full md:w-auto">
          © {venueName || '...'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 