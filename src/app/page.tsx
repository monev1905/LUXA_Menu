"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import MenuCard from '@/components/MenuCard';

const cards = [
  {
    key: 'drink',
    label: 'Drinks',
    href: '/menu?tab=drink',
    icon: null,
  },
  {
    key: 'shisha',
    label: 'Shisha',
    href: '/menu?tab=shisha',
    icon: null,
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
            <MenuCard
              key={card.key}
              name={card.label}
              href={card.href}
              bgImage={card.key === 'shisha' ? '/hookah.png' : card.key === 'drink' ? '/cocktail.png' : undefined}
              minHeight="h-[250px]"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
