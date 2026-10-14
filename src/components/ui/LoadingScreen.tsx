import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050a07] text-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Forest Emblem */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-950 flex items-center justify-center border border-emerald-400/30 shadow-2xl">
            <span className="text-4xl select-none animate-bounce">🌿</span>
          </div>
        </div>

        {/* Cinematic Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest font-['Cinzel'] text-emerald-400 text-center mb-1">
          WILD MUMBAI
        </h1>
        <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-6">
          Sanjay Gandhi National Park
        </p>

        {/* Ambient Loading Bar */}
        <div className="w-48 h-1 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-900/40">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 w-full animate-[shimmer_1.5s_infinite] origin-left"></div>
        </div>

        <p className="text-[11px] text-emerald-500/80 mt-4 tracking-wider animate-pulse">
          Entering the Canopy...
        </p>
      </div>
    </div>
  );
};
