import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  LayoutGrid,
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

interface PageControlsProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  onJumpPage: (page: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isThumbnailsOpen: boolean;
  onToggleThumbnails: () => void;
  isPlayingSlideshow: boolean;
  onToggleSlideshow: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenZoom: () => void;
}

export const PageControls: React.FC<PageControlsProps> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onJumpPage,
  isFullscreen,
  onToggleFullscreen,
  isThumbnailsOpen,
  onToggleThumbnails,
  isPlayingSlideshow,
  onToggleSlideshow,
  isMusicPlaying,
  onToggleMusic,
  isSoundEnabled,
  onToggleSound,
  onOpenZoom,
}) => {
  // Fire champagne gold & rose confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#dfc296', '#cea267', '#f7f1e5', '#e8b4b8', '#ffffff'],
      ticks: 200,
    });
  };

  // Convert internal page index (0=Cover, 1..2N=Spreads, 2N+1=Back Cover) to friendly spread label
  const totalSpreads = Math.floor(totalPages / 2);
  const isCover = currentPage === 0;
  const isBackCover = currentPage > totalPages;
  const currentSpread = isCover || isBackCover ? 0 : Math.ceil(currentPage / 2);

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 max-w-[98vw] pointer-events-auto">
      {/* Floating Glassmorphic Luxury Control Bar */}
      <div className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#181211]/95 backdrop-blur-md border border-[#dfc296]/30 shadow-2xl shadow-black/80 text-[#dfc296] max-w-full">
        
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          title="Previous Page"
          className="p-2 sm:p-2 rounded-full hover:bg-[#cea267]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 text-[#f7f1e5] cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Page / Spread Indicator Badge */}
        <div className="flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-[#0e0a09]/80 border border-[#dfc296]/20 text-xs sm:text-sm font-sans tracking-wider select-none">
          {isCover ? (
            <span className="font-serif italic text-[#dfc296] px-1 text-[11px] sm:text-xs">Album Cover</span>
          ) : isBackCover ? (
            <span className="font-serif italic text-[#dfc296] px-1 text-[11px] sm:text-xs">Closing Seal</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[#a36c36] text-[10px] sm:text-[11px] uppercase tracking-wider hidden xs:inline">Spread</span>
              <span className="font-semibold text-[#f7f1e5] text-xs sm:text-sm">{String(currentSpread).padStart(2, '0')}</span>
              <span className="text-[#a36c36]/70 text-xs">/</span>
              <span className="text-[#cbbaa1] text-xs">{totalSpreads}</span>
              <span className="text-[10px] text-[#dfc296]/60 font-mono hidden md:inline ml-1">10800×3600</span>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentPage > totalPages}
          title="Next Page"
          className="p-2 sm:p-2 rounded-full hover:bg-[#cea267]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 text-[#f7f1e5] cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="w-[1px] h-4 bg-[#dfc296]/20 mx-0.5 sm:mx-1" />

        {/* Thumbnails Drawer Toggle */}
        <button
          onClick={onToggleThumbnails}
          title="Photo Filmstrip"
          className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer ${
            isThumbnailsOpen
              ? 'bg-[#cea267] text-[#181211]'
              : 'hover:bg-[#cea267]/20 text-[#dfc296]'
          }`}
        >
          <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slideshow / Autoplay Toggle */}
        <button
          onClick={onToggleSlideshow}
          title={isPlayingSlideshow ? 'Pause Slideshow' : 'Play Slideshow'}
          className={`p-2 rounded-full transition-all active:scale-90 cursor-pointer ${
            isPlayingSlideshow
              ? 'bg-[#cea267] text-[#181211] shadow-gold-glow-sm'
              : 'hover:bg-[#cea267]/20 text-[#dfc296]'
          }`}
        >
          {isPlayingSlideshow ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Music Controller Button */}
        <button
          onClick={onToggleMusic}
          title={isMusicPlaying ? 'Pause Romantic Music' : 'Play Romantic Music'}
          className={`p-2 rounded-full transition-all active:scale-90 relative cursor-pointer ${
            isMusicPlaying
              ? 'bg-[#cea267]/30 text-[#f7f1e5] ring-1 ring-[#cea267]'
              : 'hover:bg-[#cea267]/20 text-[#cbbaa1]'
          }`}
        >
          <Music className="w-4 h-4 sm:w-5 sm:h-5" />
          {isMusicPlaying && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#dfc296] animate-ping" />
          )}
        </button>

        {/* Realistic Page Flip Sound FX Toggle (Hidden on extra small mobile) */}
        <button
          onClick={onToggleSound}
          title={isSoundEnabled ? 'Page Turn Sound: ON' : 'Page Turn Sound: OFF'}
          className={`hidden xs:inline-flex p-2 rounded-full hover:bg-[#cea267]/20 transition-all active:scale-90 cursor-pointer ${
            isSoundEnabled ? 'text-[#dfc296]' : 'text-[#cbbaa1]/40'
          }`}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Fullscreen Mode Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          className="p-2 rounded-full hover:bg-[#cea267]/20 transition-all active:scale-90 text-[#dfc296] cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Romantic Confetti Celebration (Hidden on small mobile) */}
        <button
          onClick={triggerConfetti}
          title="Celebrate with Confetti"
          className="hidden sm:inline-flex p-2 rounded-full hover:bg-[#cea267]/20 transition-all active:scale-90 text-[#dfc296] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
