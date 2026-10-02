import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlipBook, FlipBookRef } from './components/FlipBook';
import { MobileSpreadView } from './components/MobileSpreadView';
import { PageControls } from './components/PageControls';
import { ThumbnailStrip } from './components/ThumbnailStrip';
import { ZoomModal } from './components/ZoomModal';
import { LoadingScreen } from './components/LoadingScreen';
import { AmbientBackground } from './components/AmbientBackground';
import { albumData, AlbumImage } from './albumData';
import { audioEngine } from './utils/audioEngine';
import { BookOpen, Layers, Smartphone } from 'lucide-react';

export const App: React.FC = () => {
  const flipBookRef = useRef<FlipBookRef>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(false);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [zoomedImage, setZoomedImage] = useState<AlbumImage | null>(null);
  const [viewMode, setViewMode] = useState<'3d-book' | 'mobile-spread'>('3d-book');
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [showOrientationHint, setShowOrientationHint] = useState<boolean>(true);

  const totalSheets = albumData.sheets.length;
  const totalPages = totalSheets * 2;

  // Mobile screen detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileDevice(isMobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload initial critical images and smoothly dismiss loading screen
  useEffect(() => {
    let loadedCount = 0;
    const initialImagesToPreload = albumData.sheets.slice(0, 3);

    if (initialImagesToPreload.length === 0) {
      setTimeout(() => setIsLoading(false), 500);
      return;
    }

    initialImagesToPreload.forEach((img) => {
      const imageObj = new Image();
      imageObj.src = img.src;
      imageObj.onload = imageObj.onerror = () => {
        loadedCount++;
        if (loadedCount >= initialImagesToPreload.length) {
          setTimeout(() => setIsLoading(false), 600);
        }
      };
    });

    // Fallback timer in case network is slow
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if interacting with an input or zoom modal
      if (zoomedImage) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (viewMode === '3d-book') {
            flipBookRef.current?.flipNext();
          } else {
            const currentSpread = Math.max(0, Math.floor((currentPage - 1) / 2));
            if (currentSpread < totalSheets - 1) {
              const nextSpread = currentSpread + 1;
              setCurrentPage(nextSpread * 2 + 1);
            }
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (viewMode === '3d-book') {
            flipBookRef.current?.flipPrev();
          } else {
            const currentSpread = Math.max(0, Math.floor((currentPage - 1) / 2));
            if (currentSpread > 0) {
              const prevSpread = currentSpread - 1;
              setCurrentPage(prevSpread * 2 + 1);
            }
          }
          break;
        case 'Home':
          e.preventDefault();
          flipBookRef.current?.turnToPage(0);
          setCurrentPage(0);
          break;
        case 'End':
          e.preventDefault();
          flipBookRef.current?.turnToPage(totalPages + 1);
          setCurrentPage(totalPages + 1);
          break;
        case ' ':
          e.preventDefault();
          setIsPlayingSlideshow((prev) => !prev);
          break;
        case 'Escape':
          if (isThumbnailsOpen) {
            setIsThumbnailsOpen(false);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage, isThumbnailsOpen, totalPages, viewMode, currentPage, totalSheets]);

  // Slideshow auto-advance timer
  useEffect(() => {
    let interval: any = null;
    if (isPlayingSlideshow) {
      interval = setInterval(() => {
        if (viewMode === '3d-book') {
          if (flipBookRef.current) {
            const current = flipBookRef.current.getCurrentPage();
            if (current >= totalPages + 1) {
              setIsPlayingSlideshow(false); // Stop when reaching back cover
            } else {
              flipBookRef.current.flipNext();
            }
          }
        } else {
          setCurrentPage((prev) => {
            const currentSpread = Math.max(0, Math.floor((prev - 1) / 2));
            if (currentSpread >= totalSheets - 1) {
              setIsPlayingSlideshow(false);
              return prev;
            }
            return (currentSpread + 1) * 2 + 1;
          });
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingSlideshow, totalPages, viewMode, totalSheets]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.warn('Exit fullscreen error:', err);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Music toggle
  const handleToggleMusic = () => {
    const playing = audioEngine.toggleMusic();
    setIsMusicPlaying(playing);
  };

  // Sound effects toggle
  const handleToggleSound = () => {
    const nextState = !isSoundEnabled;
    setIsSoundEnabled(nextState);
    audioEngine.setSoundEnabled(nextState);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectPage = (targetPageIndex: number) => {
    setCurrentPage(targetPageIndex);
    flipBookRef.current?.turnToPage(targetPageIndex);
    setIsThumbnailsOpen(false);
  };

  const currentSpreadIdx = Math.max(0, Math.min(totalSheets - 1, Math.floor((currentPage - 1) / 2)));

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center bg-[#120e0d] select-none">
      
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* Ambient Romantic Background */}
      <AmbientBackground />

      {/* Top Header Branding (Minimalist, Responsive & Luxury) */}
      <header className="relative z-20 w-full px-3 sm:px-6 pt-2.5 sm:pt-4 pb-1 sm:pb-2 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#dfc296]/60 flex items-center justify-center bg-[#1c1513]/80 shadow-gold-glow-sm">
            <span className="font-serif text-xs sm:text-sm text-[#dfc296] font-semibold">R&S</span>
          </div>
          <div>
            <h1 className="font-serif text-[11px] sm:text-sm tracking-[0.18em] sm:tracking-[0.25em] uppercase text-[#dfc296] font-semibold truncate max-w-[170px] xs:max-w-[240px] sm:max-w-none">
              {albumData.title}
            </h1>
            <p className="font-sans text-[8.5px] sm:text-[10px] tracking-wider text-[#cbbaa1]/70 truncate max-w-[170px] xs:max-w-[240px] sm:max-w-none">
              {albumData.subtitle} • {albumData.date}
            </p>
          </div>
        </div>

        {/* Top Right Controls & View Mode Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-sans text-[#cbbaa1]/80">
          {/* Mobile View Switcher (3D Book vs Panoramic Spread) */}
          <div className="flex items-center p-0.5 rounded-full bg-[#1c1614]/90 border border-[#dfc296]/30">
            <button
              onClick={() => setViewMode('3d-book')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] transition-all cursor-pointer ${
                viewMode === '3d-book'
                  ? 'bg-[#cea267] text-[#140a1c] font-semibold shadow-xs'
                  : 'text-[#dfc296]/80 hover:text-white'
              }`}
              title="3D FlipBook Mode"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden xs:inline">3D Book</span>
            </button>
            <button
              onClick={() => setViewMode('mobile-spread')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] transition-all cursor-pointer ${
                viewMode === 'mobile-spread'
                  ? 'bg-[#cea267] text-[#140a1c] font-semibold shadow-xs'
                  : 'text-[#dfc296]/80 hover:text-white'
              }`}
              title="Full 10800x3600 Spread Mode"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden xs:inline">Panoramic</span>
            </button>
          </div>

          <span className="hidden md:inline-block px-3 py-1 rounded-full bg-[#1c1614]/80 border border-[#dfc296]/20">
            Drag corners or ← → keys
          </span>
        </div>
      </header>

      {/* Mobile Orientation Hint (Fades out when dismissed) */}
      {showOrientationHint && (
        <div className="relative z-20 flex sm:hidden items-center justify-between gap-2 px-3 py-1 mt-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#dfc296]/30 text-[9.5px] font-sans text-[#ffd782] shadow-md">
          <span>Rotate phone horizontally for full 2-page 3:1 spread 🔄</span>
          <button
            onClick={() => setShowOrientationHint(false)}
            className="text-white/60 hover:text-white px-1 text-[11px] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Center Main Stage (3D FlipBook or Panoramic Spread Flow) */}
      <section className="relative z-10 w-full flex-1 flex items-center justify-center px-1 sm:px-4">
        {viewMode === '3d-book' ? (
          <FlipBook
            ref={flipBookRef}
            onPageChange={handlePageChange}
            onZoomImage={(img) => setZoomedImage(img)}
          />
        ) : (
          <MobileSpreadView
            currentSpreadIndex={currentSpreadIdx}
            onSpreadChange={(idx) => setCurrentPage(idx * 2 + 1)}
            onZoomImage={(img) => setZoomedImage(img)}
            onOpenBookMode={() => setViewMode('3d-book')}
          />
        )}
      </section>

      {/* Floating Bottom Control Bar */}
      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={() => {
          if (viewMode === '3d-book') {
            flipBookRef.current?.flipNext();
          } else {
            if (currentSpreadIdx < totalSheets - 1) {
              setCurrentPage((currentSpreadIdx + 1) * 2 + 1);
            }
          }
        }}
        onPrev={() => {
          if (viewMode === '3d-book') {
            flipBookRef.current?.flipPrev();
          } else {
            if (currentSpreadIdx > 0) {
              setCurrentPage((currentSpreadIdx - 1) * 2 + 1);
            }
          }
        }}
        onJumpPage={(p) => {
          setCurrentPage(p);
          flipBookRef.current?.turnToPage(p);
        }}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isThumbnailsOpen={isThumbnailsOpen}
        onToggleThumbnails={() => setIsThumbnailsOpen((prev) => !prev)}
        isPlayingSlideshow={isPlayingSlideshow}
        onToggleSlideshow={() => setIsPlayingSlideshow((prev) => !prev)}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        onOpenZoom={() => {
          const sheetIndex = currentSpreadIdx;
          if (sheetIndex >= 0 && sheetIndex < albumData.sheets.length) {
            setZoomedImage(albumData.sheets[sheetIndex]);
          }
        }}
      />

      {/* Collapsible Thumbnail Filmstrip */}
      <ThumbnailStrip
        isOpen={isThumbnailsOpen}
        onClose={() => setIsThumbnailsOpen(false)}
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
      />

      {/* Fullscreen HD Zoom Inspector Lightbox */}
      <ZoomModal
        image={zoomedImage}
        images={albumData.sheets}
        onClose={() => setZoomedImage(null)}
        onSelectImage={(img) => setZoomedImage(img)}
      />
    </main>
  );
};
