"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogoLoader from '@/components/LogoLoader';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleWelcome = () => {
    setLoading(false);
    router.push('/menu');
  };

  if (loading) {
    return <LogoLoader onWelcome={handleWelcome} />;
  }

  // This should never be reached in normal flow
  return null;
}
