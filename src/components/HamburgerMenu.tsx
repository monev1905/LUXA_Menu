"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

interface MenuCategory {
  label: string;
  key: string;
  types?: { label: string; key: string }[];
}

const CATEGORY_LABELS: Record<string, string> = {
  drinks: "Drinks",
  shisha: "Shisha",
};

const TYPE_LABELS: Record<string, string> = {
  lemonades: "Lemonades & Iced Tea",
  alcohol: "Alcohol",
  smoothies: "Smoothies & Milkshakes",
  softdrinks: "Soft Drinks",
  nuts: "Nuts",
  hotdrinks: "Hot Drinks",
  blond: "Blond",
  black: "Black",
};

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      // Fetch drinks
      const drinksRes = await fetch("/api/drinks");
      const drinks = await drinksRes.json();
      // Fetch shisha flavors
      const shishaRes = await fetch("/api/shisha-flavors");
      const shisha = await shishaRes.json();

      // Group by category
      const all = [...drinks, ...shisha];
      const categories = Array.from(
        new Set(all.map((item: any) => item.category).filter(Boolean))
      ) as string[];
      const menuData: MenuCategory[] = categories.map((category) => {
        const items = all.filter((item: any) => item.category === category);
        const types = Array.from(
          new Set(items.map((item: any) => item.type).filter(Boolean))
        ) as string[];
        return {
          key: category,
          label: CATEGORY_LABELS[category] || category,
          types: types.map((type) => ({
            key: type,
            label: TYPE_LABELS[type] || type,
          })),
        };
      });
      setMenu(menuData);
    }
    fetchMenu();
  }, []);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Side drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
          <span className="text-2xl font-bold text-white">Menu</span>
          <button
            className="text-gray-400 hover:text-white focus:outline-none"
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
          <a
            href="#"
            className="block py-2 text-lg text-white hover:text-purple-300"
          >
            Home
          </a>
          {menu.map(cat => (
            <div key={cat.key}>
              {cat.key === 'shisha' ? (
                <Link
                  href="/menu?tab=shisha"
                  className="block py-2 text-lg text-white hover:text-purple-300 uppercase tracking-wider text-xs font-bold"
                  onClick={() => setOpen(false)}
                >
                  {cat.label}
                </Link>
              ) : (
                <>
                  <button
                    className={`w-full flex items-center justify-between py-2 text-left text-gray-400 uppercase tracking-wider text-xs font-bold ${openCategory === cat.key ? 'text-purple-300' : ''}`}
                    onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
                    aria-expanded={openCategory === cat.key}
                  >
                    {cat.label}
                    {cat.types && cat.types.length > 0 && (
                      <span>{openCategory === cat.key ? '▲' : '▼'}</span>
                    )}
                  </button>
                  {cat.types && cat.types.length > 0 && openCategory === cat.key && (
                    <div className="pl-4 space-y-1">
                      {cat.types.map(type => (
                        <Link
                          key={type.key}
                          href={`/menu?tab=${cat.key}&type=${type.key}`}
                          className="block py-2 text-base text-white hover:text-purple-300"
                          onClick={() => setOpen(false)}
                        >
                          {type.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
