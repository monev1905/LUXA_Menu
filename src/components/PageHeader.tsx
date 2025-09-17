import React from "react";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export default function PageHeader({
  title,
  children,
  className = "",
  leftSlot,
  rightSlot,
}: PageHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 w-full shadow-md py-2 h-14 ${className} bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]`}
      style={{ minHeight: "400px" }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 w-full h-full -z-10"
        style={{
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
          backgroundImage: 'url(/background.jpg)',
          backgroundColor: '#243325',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
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
      
      <div className="relative flex items-center w-full mx-auto px-2">
        {/* Left slot: absolute on sm+ */}
        <div className="flex-shrink-0 flex items-center min-w-[40px] h-10 sm:absolute sm:left-2 sm:static">
          {leftSlot}
        </div>
        {/* Logo instead of title */}
        <div className="flex-1 flex justify-center">
          <img
            src="/logo.png"
            alt="Noir Hookah Lounge Logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>
        {/* Right slot: absolute on sm+ */}
        <div className="flex-shrink-0 flex items-center min-w-[40px] h-10 justify-end sm:absolute sm:right-2 sm:static">
          {rightSlot}
        </div>
      </div>
      
      {/* Venue name overlay on background image */}
      <div className="absolute inset-0 flex items-center justify-center -z-5">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-wider drop-shadow-2xl" style={{ fontFamily: 'CardFont, sans-serif', textShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
            Noir
          </h2>
          <h3 className="text-2xl md:text-4xl font-semibold text-white/80 tracking-wide drop-shadow-xl" style={{ fontFamily: 'CardFont, sans-serif', textShadow: '0 0 15px rgba(0,0,0,0.8)' }}>
            Hookah Lounge
          </h3>
        </div>
      </div>
      {children && (
        <div className="mt-2 flex flex-col items-center">{children}</div>
      )}
    </header>
  );
}
 