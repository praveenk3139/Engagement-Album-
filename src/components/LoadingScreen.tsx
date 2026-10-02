import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { albumData } from '../albumData';

interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, progress = 100 }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#120e0d] text-[#ece3d6] transition-opacity duration-700">
      {/* Background radial ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bg-[#cea267]/15 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Gold Crest */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-[#dfc296]/30 border-t-[#dfc296] animate-spin flex items-center justify-center shadow-gold-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#dfc296] fill-[#dfc296]/40 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center space-x-2 text-xs tracking-[0.4em] uppercase text-[#dfc296]/80 font-serif mb-1">
          <Sparkles className="w-3 h-3 text-[#dfc296]" />
          <span>OUR ENGAGEMENT</span>
          <Sparkles className="w-3 h-3 text-[#dfc296]" />
        </div>

        <h2 className="font-script text-3xl sm:text-4xl text-[#f7f1e5] my-2">
          {albumData.couple}
        </h2>

        <p className="font-serif italic text-xs text-[#cbbaa1] tracking-widest mt-2 animate-pulse">
          Preparing Memories...
        </p>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-[#2a201c] rounded-full overflow-hidden mt-6 border border-[#dfc296]/20">
          <div 
            className="h-full bg-gradient-to-r from-[#cea267] to-[#dfc296] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
