"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [isProduction, setIsProduction] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadComplete, setPreloadComplete] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsProduction(process.env.NEXT_PUBLIC_ENVIRONMENT === "production");

    // Pre-load database data in the background
    if (!isProduction) {
      preloadMenuData();
    }
  }, [isProduction]);

  const preloadMenuData = async () => {
    try {
      setIsPreloading(true);
      const startTime = Date.now();

      // Pre-load all menu data via API calls
      const [
        venuesRes,
        drinkCategoriesRes,
        shishaSelectionsRes,
        shishaFlavorsRes,
      ] = await Promise.all([
        fetch("/api/venues"),
        fetch("/api/drink-categories"),
        fetch("/api/shisha-selections"),
        fetch("/api/shisha-flavors"),
      ]);

      // Check if all requests were successful
      if (
        venuesRes.ok &&
        drinkCategoriesRes.ok &&
        shishaSelectionsRes.ok &&
        shishaFlavorsRes.ok
      ) {
        setPreloadComplete(true);
      } else {
        throw new Error("Some API requests failed");
      }
    } catch (error) {
      // Pre-loading failed, menu will load on demand
    } finally {
      setIsPreloading(false);
    }
  };

  const handleWelcome = () => {
    router.push("/menu"); // Navigate to menu
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent">
      {/* Smoke effect background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/smoke.gif"
          alt="Smoke effect"
          fill
          className="object-cover"
          style={{
            opacity: 0.3,
            animation: "fade-in-out 4s ease-in-out infinite",
            mixBlendMode: "screen",
          }}
          priority
        />
      </div>

      <div className="relative w-48 h-48 mb-8 z-10">
        {/* Logo image */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={192}
          height={192}
          className="w-full h-full object-contain"
          style={{ display: "block" }}
          priority
        />
      </div>

      {!isClient ? (
        // Show loading state during hydration
        <div className="text-center z-10">
          <div className="text-2xl font-bold text-white mb-4">Loading...</div>
        </div>
      ) : isProduction ? (
        // Production - Show Coming Soon message
        <div className="text-center z-10">
          <div className="text-2xl font-bold text-white mb-4">
            🚀 Coming Soon
          </div>
          <div className="text-lg text-white/90">
            We&apos;re working hard to bring you something amazing!
          </div>
          <div className="text-sm mt-2 text-white/70">
            Stay tuned for updates!
          </div>
        </div>
      ) : (
        // Staging/Development - Show Welcome button that navigates to /menu
        <div className="text-center z-10">
          <button
            onClick={handleWelcome}
            disabled={isPreloading}
            className="group relative mt-4 px-10 py-4 rounded-xl text-white text-xl font-bold shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backgroundImage:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.4) 100%)",
              }}
            />
            <span className="relative z-10">Welcome</span>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
