"use client";

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FlavorCard from '@/components/FlavorCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageHeader from '@/components/PageHeader';
import HamburgerMenu from '@/components/HamburgerMenu';
import Footer from '@/components/Footer';

interface Flavor {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  imageUrl: string;
  brand: string | null;
  type: string | null;
}

function FlavorsContent() {
  const params = useParams();
  const router = useRouter();
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [brandName, setBrandName] = useState<string>('');
  const [flavorType, setFlavorType] = useState<string>('');
  const [selection, setSelection] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Decode the brand name from the URL parameter
    const decodedBrandName = decodeURIComponent(params.brandId as string);
    
    Promise.all([
      fetch('/api/shisha-flavors').then(res => res.json()),
      fetch('/api/shisha-selections').then(res => res.json())
    ]).then(([flavorsData, selectionsData]) => {
      // Find the flavor type by looking at the first matching brand
      const matchingFlavor = flavorsData.find((flavor: Flavor) => 
        flavor.brand === decodedBrandName
      );
      
      const type = matchingFlavor?.type || 'cigar'; // Default to cigar if not found
      setFlavorType(type);
      
      // Filter flavors for this specific brand and type
      const brandFlavors = flavorsData.filter((flavor: Flavor) => {
        return flavor.brand === decodedBrandName && flavor.type === type;
      });
      
      // Find the selection and price for this brand
      const brandSelection = selectionsData.find((sel: any) => {
        return sel.brands.some((brand: any) => 
          brand.brand === decodedBrandName && brand.type === type
        );
      });
      
      if (brandSelection) {
        setSelection(brandSelection.selection);
        setPrice(brandSelection.price);
      }
      
      setBrandName(decodedBrandName);
      setFlavors(brandFlavors);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching flavors:', error);
      setLoading(false);
    });
  }, [params.brandId]);

  const handleBack = () => {
    // Navigate back to the appropriate shisha type
    router.push(`/menu?tab=shisha&type=${flavorType}`);
  };

  // Create subtitle with selection and price info
  const subtitle = selection && price 
    ? `${selection} • ${price.toFixed(2)} лв / €${(price / 1.96).toFixed(2)}`
    : '';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <PageHeader
          title="Loading..."
          leftSlot={<HamburgerMenu inHeader />}
          rightSlot={
            <button
              onClick={handleBack}
              className="p-2 rounded-md bg-jungle-dark text-accent hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Back"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          }
        />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <svg className="fixed inset-0 w-full h-full -z-10 opacity-20 pointer-events-none" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexPattern" width="48" height="55.425" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <polygon points="24,0 48,13.856 48,41.568 24,55.425 0,41.568 0,13.856" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none" style={{overflow: 'hidden'}}>
        <div className="absolute w-[150%] h-[60%] left-[-25%] top-[40%] opacity-10 rotate-12 animate-shine" style={{background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)'}} />
      </div>

      <PageHeader
        title={brandName}
        subtitle={subtitle}
        leftSlot={<HamburgerMenu inHeader />}
        rightSlot={
          <button
            onClick={handleBack}
            className="p-2 rounded-md bg-jungle-dark text-accent hover:bg-leaf focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Back"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      />

      <main className="w-full min-h-[60vh] flex flex-col items-center p-8 bg-transparent">
        {flavors.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-accent text-xl font-semibold mb-2">No Flavors Available</h3>
            <p className="text-leaf text-sm">No flavors found for this brand</p>
            <p className="text-gray-400 text-xs mt-2">Brand Name: {brandName || 'Not found'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {flavors.map((flavor, index) => (
              <FlavorCard 
                key={flavor.id || `flavor-${index}`} 
                flavor={flavor} 
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function FlavorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FlavorsContent />
    </Suspense>
  );
}
