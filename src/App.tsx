import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlipBook, FlipBookRef } from './components/FlipBook';
import { PageControls } from './components/PageControls';
import { ThumbnailStrip } from './components/ThumbnailStrip';
import { ZoomModal } from './components/ZoomModal';
import { LoadingScreen } from './components/LoadingScreen';
import { AmbientBackground } from './components/AmbientBackground';
import { albumData, AlbumImage } from './albumData';
import { audioEngine } from './utils/audioEngine';

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

  const totalSheets = albumData.sheets.length;
  const totalPages = totalSheets * 2;

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
          flipBookRef.current?.flipNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          flipBookRef.current?.flipPrev();
          break;
        case 'Home':
          e.preventDefault();
          flipBookRef.current?.turnToPage(0);
          break;
        case 'End':
          e.preventDefault();
          flipBookRef.current?.turnToPage(totalPages + 1);
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
  }, [zoomedImage, isThumbnailsOpen, totalPages]);

  // Slideshow auto-advance timer
  useEffect(() => {
    let interval: any = null;
    if (isPlayingSlideshow) {
      interval = setInterval(() => {
        if (flipBookRef.current) {
          const current = flipBookRef.current.getCurrentPage();
          if (current >= totalPages + 1) {
            setIsPlayingSlideshow(false); // Stop when reaching back cover
          } else {
            flipBookRef.current.flipNext();
          }
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingSlideshow, totalPages]);

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
    flipBookRef.current?.turnToPage(targetPageIndex);
    setIsThumbnailsOpen(false);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center bg-[#120e0d] select-none">
      
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} />

      {/* Ambient Romantic Background */}
      <AmbientBackground />

      {/* Top Header Branding (Minimalist & Luxury) */}
      <header className="relative z-20 w-full px-6 pt-4 pb-2 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border border-[#dfc296]/60 flex items-center justify-center bg-[#1c1513]/80 shadow-gold-glow-sm">
            <span className="font-serif text-sm text-[#dfc296] font-semibold">R&S</span>
          </div>
          <div>
            <h1 className="font-serif text-xs sm:text-sm tracking-[0.25em] uppercase text-[#dfc296] font-semibold">
              {albumData.title}
            </h1>
            <p className="font-sans text-[10px] tracking-wider text-[#cbbaa1]/70">
              {albumData.subtitle} • {albumData.date} • <span className="text-[#dfc296] font-mono">10800×3600 HD Panoramic Spread</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans text-[#cbbaa1]/80">
          <span className="hidden md:inline-block px-3 py-1 rounded-full bg-[#1c1614]/80 border border-[#dfc296]/20">
            Drag page corners or use arrow keys ← →
          </span>
        </div>
      </header>

      {/* Center 3D FlipBook Stage */}
      <section className="relative z-10 w-full flex-1 flex items-center justify-center">
        <FlipBook
          ref={flipBookRef}
          onPageChange={handlePageChange}
          onZoomImage={(img) => setZoomedImage(img)}
        />
      </section>

      {/* Floating Bottom Control Bar */}
      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={() => flipBookRef.current?.flipNext()}
        onPrev={() => flipBookRef.current?.flipPrev()}
        onJumpPage={(p) => flipBookRef.current?.turnToPage(p)}
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
          if (currentPage > 0 && currentPage <= totalPages) {
            const sheetIndex = Math.floor((currentPage - 1) / 2);
            if (sheetIndex >= 0 && sheetIndex < albumData.sheets.length) {
              setZoomedImage(albumData.sheets[sheetIndex]);
            }
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
