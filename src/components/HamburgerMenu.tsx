"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

interface MenuCategory {
  label: string;
  key: string;
  types?: { label: string; key: string; brands?: { label: string; key: string }[] }[];
}

interface DrinkCategory {
  id: string;
  Category: string;
  Order: number | null;
}

interface HamburgerMenuProps {
  inHeader?: boolean;
}

export default function HamburgerMenu({ inHeader = false }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        // Fetch drink categories
        const drinkCategoriesRes = await fetch("/api/drink-categories");
        const drinkCategories = await drinkCategoriesRes.json();
        
        // Fetch shisha selections to get brands
        const selectionsRes = await fetch("/api/shisha-selections");
        const selections = await selectionsRes.json();

        // Create menu structure
        const menuData: MenuCategory[] = [
          {
            key: 'drinks',
            label: 'Drinks',
            types: drinkCategories.map((category: DrinkCategory) => ({
              key: category.Category.toLowerCase().replace(/\s+/g, '-'),
              label: category.Category
            }))
          },
          {
            key: 'shisha',
            label: 'Shisha',
            types: []
          }
        ];

        // Process shisha data
        const shishaCategory = menuData.find(cat => cat.key === 'shisha');
        if (shishaCategory) {
          // Group brands by leaf type
          const brandsByType: Record<string, Set<string>> = {
            blond: new Set(),
            dark: new Set(),
            cigar: new Set()
          };

          // Get brands from selections that have brands
          selections.forEach((selection: any) => {
            if (selection.brands && selection.brands.length > 0) {
              selection.brands.forEach((brand: any) => {
                if (brand.brand && brand.type) {
                  brandsByType[brand.type]?.add(brand.brand);
                }
              });
            }
          });

          // Create types with their brands
          shishaCategory.types = [
            {
              key: 'blond',
              label: 'Blond Leaf',
              brands: Array.from(brandsByType.blond).map(brand => ({
                key: brand,
                label: brand
              }))
            },
            {
              key: 'dark',
              label: 'Dark Leaf',
              brands: Array.from(brandsByType.dark).map(brand => ({
                key: brand,
                label: brand
              }))
            },
            {
              key: 'cigar',
              label: 'Cigar Leaf',
              brands: Array.from(brandsByType.cigar).map(brand => ({
                key: brand,
                label: brand
              }))
            }
          ].filter(type => type.brands.length > 0); // Only show types that have brands
        }

        setMenu(menuData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    }
    fetchMenu();
  }, []);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="fixed top-2 left-2 z-50 p-2 rounded-md bg-jungle-dark text-accent shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Side drawer */}
      <aside
        className={`fixed top-0 left-0 h-full min-w-[250px] z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-gradient-to-b from-[#030f0c] via-[#1a241b] to-[#030f0c] shadow-2xl border-r-2 border-[#04100C]`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#04100C]">
          <span className="text-2xl font-bold text-accent">Menu</span>
          <button
            className="text-leaf hover:text-accent focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>
        <nav className="px-6 py-4 space-y-2">
          <Link
            href="/menu"
            className="block py-2 text-lg text-accent hover:text-leaf"
            onClick={() => setOpen(false)}
          >
            Menu
          </Link>
          
          {menu.map(cat => (
            <div key={cat.key}>
              <button
                className={`w-full flex items-center justify-between py-2 text-left text-leaf uppercase tracking-wider text-xs font-bold ${openCategory === cat.key ? 'text-accent' : ''}`}
                onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
                aria-expanded={openCategory === cat.key}
              >
                {cat.label}
                <span>{openCategory === cat.key ? '▲' : '▼'}</span>
              </button>
              {openCategory === cat.key && (
                <div className="pl-4 space-y-1">
                  {cat.types?.map(type => (
                    <div key={type.key}>
                      <Link
                        href={cat.key === 'drinks' ? `/menu?tab=drink&section=${type.key}` : `/menu?tab=shisha&type=${type.key}`}
                        className="block py-2 text-base text-accent hover:text-leaf"
                        onClick={() => setOpen(false)}
                      >
                        {type.label}
                      </Link>
                      {type.brands && type.brands.length > 0 && (
                        <div className="pl-4 space-y-1">
                          {type.brands.map(brand => (
                            <Link
                              key={brand.key}
                              href={`/flavors/${encodeURIComponent(brand.key)}`}
                              className="block py-1 text-sm text-accent/80 hover:text-leaf"
                              onClick={() => setOpen(false)}
                            >
                              {brand.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/reservations"
            className="block py-2 text-lg text-accent hover:text-leaf"
            onClick={() => setOpen(false)}
          >
            Reservations
          </Link>
        </nav>
      </aside>
    </>
  );
}
