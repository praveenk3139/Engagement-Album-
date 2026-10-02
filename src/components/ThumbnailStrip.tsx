import React, { useRef, useEffect } from 'react';
import { X, BookOpen, Heart } from 'lucide-react';
import { albumData } from '../albumData';

interface ThumbnailStripProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSelectPage: (pageIndex: number) => void;
}

export const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll active thumbnail into view
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`[data-thumb-index="${currentPage}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [isOpen, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[96vw] max-w-[1100px] bg-[#140f0e]/95 backdrop-blur-xl border border-[#dfc296]/40 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#ece3d6] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#dfc296]/20 px-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#dfc296]" />
          <span className="font-serif text-sm tracking-wider uppercase text-[#f7f1e5]">
            Photo Collection Filmstrip
          </span>
          <span className="text-xs text-[#a36c36] font-sans">
            ({albumData.totalImages} photos)
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#cea267]/20 text-[#cbbaa1] hover:text-[#f7f1e5] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Scrollable Thumbnails List */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto py-2 px-1 scroll-smooth"
      >
        {/* Front Cover Thumbnail */}
        <button
          data-thumb-index={0}
          onClick={() => onSelectPage(0)}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            currentPage === 0
              ? 'border-[#dfc296] bg-[#cea267]/20 ring-2 ring-[#cea267]/60 scale-105'
              : 'border-[#dfc296]/20 hover:border-[#dfc296]/60 bg-[#0e0a09]'
          }`}
        >
          <div className="w-24 h-12 sm:w-28 sm:h-14 rounded bg-gradient-to-br from-[#2c2220] to-[#120e0d] flex flex-col items-center justify-center border border-[#cea267]/30 shadow-md">
            <Heart className="w-4 h-4 text-[#dfc296] mb-0.5" />
            <span className="font-serif text-[10px] text-[#dfc296] tracking-widest uppercase">Cover</span>
          </div>
          <span className="text-[10px] font-sans font-medium text-[#cbbaa1]">Cover</span>
        </button>

        {/* 48 Panoramic Spread Thumbnails (3:1) */}
        {albumData.sheets.map((sheet, idx) => {
          const spreadPageIndex = idx * 2 + 1;
          const isActive = currentPage === spreadPageIndex || currentPage === spreadPageIndex + 1;

          return (
            <button
              key={sheet.id || idx}
              data-thumb-index={spreadPageIndex}
              onClick={() => onSelectPage(spreadPageIndex)}
              className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-lg border transition-all duration-200 cursor-pointer group ${
                isActive
                  ? 'border-[#dfc296] bg-[#cea267]/25 ring-2 ring-[#cea267]/70 scale-105 shadow-gold-glow-sm'
                  : 'border-[#dfc296]/20 hover:border-[#dfc296]/60 bg-[#0e0a09]/80'
              }`}
            >
              <div className="w-28 h-10 sm:w-36 sm:h-12 rounded overflow-hidden bg-[#181211] border border-[#dfc296]/30 flex items-center justify-center relative">
                <img
                  src={sheet.thumbSrc || sheet.src}
                  alt={sheet.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-white/75 bg-black/60 px-1 rounded">
                  3:1
                </span>
              </div>
              <span className={`text-[10px] font-sans font-medium ${isActive ? 'text-[#dfc296]' : 'text-[#cbbaa1]'}`}>
                Spread {String(idx + 1).padStart(2, '0')}
              </span>
            </button>
          );
        })}

        {/* Back Cover Thumbnail */}
        <button
          data-thumb-index={albumData.sheets.length * 2 + 1}
          onClick={() => onSelectPage(albumData.sheets.length * 2 + 1)}
          className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            currentPage > albumData.sheets.length * 2
              ? 'border-[#dfc296] bg-[#cea267]/20 ring-2 ring-[#cea267]/60 scale-105'
              : 'border-[#dfc296]/20 hover:border-[#dfc296]/60 bg-[#0e0a09]'
          }`}
        >
          <div className="w-24 h-12 sm:w-28 sm:h-14 rounded bg-gradient-to-br from-[#2c2220] to-[#120e0d] flex flex-col items-center justify-center border border-[#cea267]/30 shadow-md">
            <Heart className="w-4 h-4 text-[#dfc296] mb-0.5" />
            <span className="font-serif text-[10px] text-[#dfc296] tracking-widest uppercase">Back</span>
          </div>
          <span className="text-[10px] font-sans font-medium text-[#cbbaa1]">End</span>
        </button>
      </div>
    </div>
  );
};
