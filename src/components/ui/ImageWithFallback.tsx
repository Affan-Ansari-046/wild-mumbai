import React, { useState } from 'react';
import { ImageOff, Camera } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  categoryBadge?: string;
  attribution?: string;
  aspectRatioClass?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackSubtitle,
  categoryBadge,
  attribution,
  className = 'w-full h-full object-cover',
  aspectRatioClass = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className={`relative w-full h-full bg-[#09150e] border border-[#1b3425] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden ${aspectRatioClass}`}>
        {/* Subtle patterned background */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-transparent to-transparent opacity-50" />
        
        {categoryBadge && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#050c08] border border-emerald-800 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            {categoryBadge}
          </div>
        )}

        <div className="w-12 h-12 rounded-2xl bg-[#0e2016] border border-[#234533] flex items-center justify-center text-emerald-400 mb-2 shadow-inner">
          <Camera className="w-6 h-6 text-emerald-500/70" />
        </div>

        <div className="text-xs font-bold text-neutral-200 line-clamp-1 max-w-[90%]">
          {fallbackTitle || alt || 'SGNP Verified Record'}
        </div>
        
        <div className="text-[10px] text-neutral-400 font-serif line-clamp-1 mt-0.5">
          {fallbackSubtitle || 'Sourced via Maharashtra Forest Dept'}
        </div>

        <div className="absolute bottom-2 text-[9px] text-emerald-500/70 uppercase tracking-widest font-semibold flex items-center gap-1">
          <span>Protected Field Sighting</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${aspectRatioClass}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#0d1a13] animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
        {...props}
      />
      {attribution && !isLoading && (
        <div className="absolute bottom-1 right-2 text-[9px] text-white/60 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none">
          {attribution}
        </div>
      )}
    </div>
  );
};
