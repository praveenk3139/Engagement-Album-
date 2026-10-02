import React from 'react';
import { Heart, RotateCcw, Sparkles } from 'lucide-react';
import { albumData } from '../albumData';

interface BackCoverProps {
  onRestart: () => void;
}

export const BackCover: React.FC<BackCoverProps> = ({ onRestart }) => {
  return (
    <div className="w-full h-full p-6 sm:p-10 flex flex-col items-center justify-between hardcover-texture rounded-l-md select-none relative overflow-hidden text-[#ece3d6]">
      {/* Outer Gold Foil Framing Border */}
      <div className="absolute inset-4 sm:inset-6 border-[2px] border-[#dfc296]/60 rounded-sm pointer-events-none" />
      <div className="absolute inset-5 sm:inset-7 border-[1px] border-[#cea267]/30 rounded-sm pointer-events-none" />

      {/* Top Header Badge */}
      <div className="pt-6 sm:pt-8 text-center flex flex-col items-center">
        <div className="flex items-center space-x-2 text-[#dfc296]/80 text-xs sm:text-sm tracking-[0.35em] uppercase font-sans font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#dfc296]" />
          <span>Happily Engaged</span>
          <Sparkles className="w-3.5 h-3.5 text-[#dfc296]" />
        </div>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#dfc296]/60 to-transparent mt-2" />
      </div>

      {/* Center Closing Seal */}
      <div className="my-auto text-center flex flex-col items-center max-w-[85%]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#dfc296]/70 flex items-center justify-center p-2 mb-4 shadow-gold-glow relative bg-[#1c1614]/80">
          <Heart className="w-8 h-8 text-[#dfc296] fill-[#dfc296]/30" />
        </div>

        <h2 className="font-serif text-lg sm:text-xl text-[#f7f1e5] tracking-widest uppercase mb-2">
          Two Souls, One Promise
        </h2>

        <p className="font-script text-3xl sm:text-4xl text-[#dfc296] my-2 leading-relaxed">
          &ldquo;May your love grow deeper with every passing sunrise on the road to forever.&rdquo;
        </p>

        <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#cbbaa1] mt-3">
          {albumData.couple}
        </p>
        <p className="font-sans text-[11px] tracking-widest text-[#cbbaa1]/70 mt-1">
          {albumData.location}
        </p>
      </div>

      {/* Bottom Button Action */}
      <div className="pb-4 sm:pb-6 text-center w-full flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
          }}
          className="gold-shimmer-btn group px-7 py-3 rounded-full text-[#1a120c] font-sans font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center space-x-2 shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#1a120c] group-hover:-rotate-90 transition-transform" />
          <span>REPLAY ALBUM</span>
        </button>

        <p className="text-[10px] tracking-widest uppercase text-[#cbbaa1]/60 mt-3 font-sans">
          End of Photo Collection
        </p>
      </div>
    </div>
  );
};
