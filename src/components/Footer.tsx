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
    <footer className="w-full border-t-2 border-forest bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e] py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
        <div className="flex space-x-8 text-accent text-lg md:text-base justify-center md:justify-start w-full md:w-auto">
          <Link href="/locations" className="hover:text-leaf transition-colors">Locations</Link>
          <Link href="/reservations" className="hover:text-leaf transition-colors">Reservations</Link>
        </div>
        <div className="text-leaf text-center md:text-right text-base md:text-sm w-full md:w-auto">
          © {venueName || '...'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 