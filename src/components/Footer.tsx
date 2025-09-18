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
    <footer className="w-full border-t-2 border-[#1a241b] py-6 px-4 relative">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
          backgroundImage: 'url(/background.jpg)',
          backgroundColor: '#243325',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
          opacity: 0.5
        }}
        aria-hidden="true"
      />
      
      {/* Hexagon SVG pattern overlay */}
      <svg className="absolute inset-0 w-full h-full -z-10 opacity-20 pointer-events-none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexPattern" width="48" height="55.425" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <polygon points="24,0 48,13.856 48,41.568 24,55.425 0,41.568 0,13.856" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
      
      {/* Animated shine effect */}
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none" style={{overflow: 'hidden'}}>
        <div className="absolute w-[150%] h-[60%] left-[-25%] top-[40%] opacity-10 rotate-12 animate-shine" style={{background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)'}} />
      </div>
      
      <div className="max-w-4xl mx-auto flex flex-col items-center md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0 relative z-10">
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