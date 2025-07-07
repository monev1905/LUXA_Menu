"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';

const cards = [
  {
    key: 'drink',
    label: 'Drinks',
    href: '/menu?tab=drink',
    icon: <span className="text-6xl mb-4">🍋</span>,
  },
  {
    key: 'shisha',
    label: 'Shisha',
    href: '/menu?tab=shisha',
    icon: <span className="text-6xl mb-4">🌑</span>,
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
    <div className="min-h-screen flex flex-col relative">
      {/* Simple static background */}
      <div
        className="fixed inset-0 w-full h-full -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundColor: '#1a241b', // matches jungle-dark
        }}
        aria-hidden="true"
      />
      <PageHeader
        title={venueName || '...'}
        leftSlot={<HamburgerMenu inHeader />}
        rightSlot={null}
      />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-4">
          {cards.map(card => (
            <Link
              key={card.key}
              href={card.href}
              className="bg-jungle-light/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-brown hover:border-accent transition-all duration-200 group"
            >
              {card.icon}
              <span className="text-2xl font-bold text-accent group-hover:text-leaf mt-2">{card.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
