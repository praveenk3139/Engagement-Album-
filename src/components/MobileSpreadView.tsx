import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { albumData, AlbumImage } from '../albumData';
import { audioEngine } from '../utils/audioEngine';

interface MobileSpreadViewProps {
  currentSpreadIndex: number;
  onSpreadChange: (index: number) => void;
  onZoomImage: (image: AlbumImage) => void;
  onOpenBookMode: () => void;
}

export const MobileSpreadView: React.FC<MobileSpreadViewProps> = ({
  currentSpreadIndex,
  onSpreadChange,
  onZoomImage,
  onOpenBookMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const totalSpreads = albumData.sheets.length;

  const currentSheet = albumData.sheets[currentSpreadIndex] || albumData.sheets[0];

  const handleNext = () => {
    if (currentSpreadIndex < totalSpreads - 1) {
      audioEngine.playPageTurn();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      onSpreadChange(currentSpreadIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSpreadIndex > 0) {
      audioEngine.playPageTurn();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
      onSpreadChange(currentSpreadIndex - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || e.changedTouches.length !== 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStart.y);
    const elapsed = Date.now() - touchStart.time;

    // Detect fast horizontal swipe
    if (elapsed < 450 && Math.abs(deltaX) > 40 && deltaY < 80) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStart(null);
  };

  // Double tap to zoom
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      onZoomImage(currentSheet);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleDoubleTap}
      className="relative w-full h-full flex flex-col items-center justify-center px-2 py-1 select-none"
    >
      {/* Spread Card Container */}
      <div className="relative w-full max-w-[98vw] aspect-[3/1] max-h-[70vh] rounded-lg overflow-hidden border border-[#dfc296]/30 shadow-2xl bg-[#0e0a09] flex items-center justify-center group">
        
        {/* Full 10800x3600 Panoramic Image */}
        <img
          src={currentSheet.src}
          alt={currentSheet.title || `Spread ${currentSpreadIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-active:scale-[1.02]"
        />

        {/* Subtle center spine fold line to preserve photobook feeling */}
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-black/50 via-white/10 to-black/50 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

        {/* Left Arrow Button for Easy Touch */}
        {currentSpreadIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/90 active:scale-90 border border-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Button for Easy Touch */}
        {currentSpreadIndex < totalSpreads - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/90 active:scale-90 border border-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Swipe Instruction on Mobile */}
      <div className="flex items-center justify-between w-full max-w-[98vw] mt-2 px-2 text-[10px] font-sans text-[#cbbaa1]/80">
        <span>Swipe ↔ or tap arrows to browse</span>
        <button
          onClick={onOpenBookMode}
          className="flex items-center gap-1 text-[#ffd782] hover:underline"
        >
          <BookOpen className="w-3 h-3" />
          <span>Switch to 3D FlipBook</span>
        </button>
      </div>
    </div>
  );
};
