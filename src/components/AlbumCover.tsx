import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { albumData } from '../albumData';

interface AlbumCoverProps {
  onOpen: () => void;
}

export const AlbumCover: React.FC<AlbumCoverProps> = ({ onOpen }) => {
  const [retry, setRetry] = useState(0);

  const getHeroSrc = () => {
    if (retry === 0) return '/album/0O0A5313.JPG';
    if (retry === 1) return 'album/0O0A5313.JPG';
    if (retry === 2) return './album/0O0A5313.JPG';
    return '0O0A5313.JPG';
  };

  return (
    <div className="w-full h-full relative flex flex-col justify-between overflow-hidden rounded-r-md select-none bg-[#140a1c] text-[#f7f1e5]">
      
      {/* 1. Full-Bleed Original Hero Engagement Photograph */}
      <img
        src={getHeroSrc()}
        alt="Ramya & Saravanan Engagement Portrait"
        onError={() => {
          if (retry < 3) setRetry(r => r + 1);
        }}
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.01]"
      />

      {/* 2. Soft Luxury Edge Vignette & Gradients (Keeps couple's faces pristine and clear) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(16, 4, 26, 0.72) 0%, rgba(16, 4, 26, 0.35) 18%, transparent 35%, transparent 68%, rgba(16, 4, 26, 0.45) 82%, rgba(16, 4, 26, 0.85) 100%),
            radial-gradient(ellipse at center, transparent 55%, rgba(10, 2, 18, 0.45) 100%)
          `
        }}
      />

      {/* 3. Hardcover Photo-Laminate Sheen */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/[0.04] to-amber-200/[0.07]" />

      {/* 4. Elegant Double Gold Framing Border with Inset Corner Accents */}
      <div className="absolute inset-3.5 sm:inset-5 border border-[#ffd782]/70 rounded-[2px] pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]" />
      <div className="absolute inset-4.5 sm:inset-6.5 border border-[#dfc296]/35 rounded-[1px] pointer-events-none" />

      {/* Corner Ornaments */}
      <div className="absolute top-5 left-5 text-[#ffd782]/80 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor">
          <path d="M0 0h30v2H2v28H0V0z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      </div>
      <div className="absolute top-5 right-5 text-[#ffd782]/80 rotate-90 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor">
          <path d="M0 0h30v2H2v28H0V0z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      </div>
      <div className="absolute bottom-5 left-5 text-[#ffd782]/80 -rotate-90 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor">
          <path d="M0 0h30v2H2v28H0V0z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      </div>
      <div className="absolute bottom-5 right-5 text-[#ffd782]/80 rotate-180 pointer-events-none">
        <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor">
          <path d="M0 0h30v2H2v28H0V0z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      </div>

      {/* ===================================================
          UPPER SECTION: Main Title Typography
          Positioned elegantly above the couple
          =================================================== */}
      <div className="relative z-10 pt-6 sm:pt-8 px-6 text-center flex flex-col items-center">
        
        {/* Subtle Top Badge */}
        <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-[#ffd782] font-serif font-medium mb-1 drop-shadow-md">
          <Sparkles className="w-3 h-3 text-[#ffd782]" />
          <span>OUR ENGAGEMENT ALBUM</span>
          <Sparkles className="w-3 h-3 text-[#ffd782]" />
        </div>

        {/* Couple Names (Main Title) */}
        <h1 className="font-serif text-2xl sm:text-4xl text-[#fff7e6] font-semibold tracking-[0.18em] uppercase my-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          RAMYA <span className="font-light text-[#ffd782] text-xl sm:text-3xl">&</span> SARAVANAN
        </h1>

        {/* Subtitle with Gold Dividers */}
        <div className="flex items-center space-x-3 mt-1 mb-1">
          <div className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-[#ffd782]/80" />
          <p className="font-serif italic text-xs sm:text-sm text-[#ffe8b3] tracking-widest drop-shadow-md">
            Two Hearts • Engaged to be Married
          </p>
          <div className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-[#ffd782]/80" />
        </div>
      </div>

      {/* ===================================================
          LOWER SECTION: Wedding Date & Open Album Button
          =================================================== */}
      <div className="relative z-10 pb-6 sm:pb-8 px-6 text-center flex flex-col items-center">
        
        {/* Wedding Date */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#ffd782] font-serif tracking-[0.25em] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] mb-3">
          <span>{albumData.date}</span>
        </div>

        {/* Open Album Interactive Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="gold-shimmer-btn group px-7 sm:px-9 py-2.5 sm:py-3 rounded-full text-[#1b0a2a] font-sans font-bold text-xs sm:text-sm tracking-[0.25em] uppercase flex items-center space-x-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-[#fff3d1]/40"
        >
          <BookOpen className="w-4 h-4 text-[#1b0a2a] group-hover:rotate-12 transition-transform" />
          <span>OPEN ALBUM</span>
        </button>

        <p className="text-[10px] tracking-widest uppercase text-[#ffe8b3]/75 mt-2.5 font-sans drop-shadow-sm">
          {albumData.totalImages} Sacred Photographs
        </p>
      </div>

      {/* Left-edge Spine Depth Groove & Shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};
