import React from 'react';

interface LogoLoaderProps {
  onWelcome: () => void;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({ onWelcome }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent">
      {/* Smoke effect background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/smoke.gif"
          alt="Smoke effect"
          className="w-full h-full object-cover"
          style={{ 
            opacity: 0.3,
            animation: 'fade-in-out 4s ease-in-out infinite',
            mixBlendMode: 'screen'
          }}
        />
      </div>
      
      <div className="relative w-48 h-48 mb-8 z-10">
        {/* Logo image */}
        <img
          src="/logo.png"
          alt="Logo"
          className="w-full h-full object-contain"
          style={{ display: 'block' }}
        />
      </div>
      
      <button
        onClick={onWelcome}
        className="mt-4 px-8 py-3 rounded-lg bg-leaf text-white text-xl font-semibold shadow-lg hover:bg-leaf/80 transition-all duration-200 border-2 border-leaf z-10"
      >
        Welcome
      </button>
      
      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default LogoLoader;