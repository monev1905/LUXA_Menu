"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const cards = [
  {
    key: 'drink',
    label: 'Drinks',
    href: '/drinks',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <rect x="20" y="10" width="24" height="44" rx="8" fill="#a78bfa"/>
        <rect x="28" y="18" width="8" height="28" rx="4" fill="#fff"/>
        <circle cx="32" cy="54" r="4" fill="#fff"/>
      </svg>
    ),
  },
  {
    key: 'shisha',
    label: 'Shisha',
    href: '/menu?tab=shisha',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
        <rect x="28" y="10" width="8" height="32" rx="4" fill="#a78bfa"/>
        <rect x="24" y="42" width="16" height="8" rx="4" fill="#fff"/>
        <circle cx="32" cy="54" r="6" fill="#a78bfa"/>
      </svg>
    ),
  },
];

export default function HomePage() {
  const [venueName, setVenueName] = useState('');

  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setVenueName(data[0].name);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <PageHeader title={venueName || '...'} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-4">
          {cards.map(card => (
            <Link
              key={card.key}
              href={card.href}
              className="bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-gray-800 hover:border-purple-500 transition-all duration-200 group"
            >
              {card.icon}
              <span className="text-2xl font-bold text-purple-100 group-hover:text-purple-300 mt-2">{card.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
