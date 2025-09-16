import React from 'react';

interface LogoLoaderProps {
  onWelcome: () => void;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({ onWelcome }) => {
  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  
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
      
      {isProduction ? (
        // Production - Show Coming Soon message
        <div className="text-center z-10">
          <div className="text-2xl font-bold text-white mb-4">
            🚀 Coming Soon
          </div>
          <div className="text-lg text-white/90">
            We're working hard to bring you something amazing!
          </div>
          <div className="text-sm mt-2 text-white/70">
            Stay tuned for updates!
          </div>
        </div>
      ) : (
        // Staging/Development - Show Welcome button
        <button
          onClick={onWelcome}
          className="mt-4 px-8 py-3 rounded-lg bg-leaf text-white text-xl font-semibold shadow-lg hover:bg-leaf/80 transition-all duration-200 border-2 border-leaf z-10"
        >
          Welcome
        </button>
      )}
      
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