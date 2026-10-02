import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { PageFlip } from 'page-flip';
import { albumData, AlbumImage } from '../albumData';
import { AlbumCover } from './AlbumCover';
import { PhotoPage } from './PhotoPage';
import { BackCover } from './BackCover';
import { audioEngine } from '../utils/audioEngine';

export interface FlipBookRef {
  flipNext: () => void;
  flipPrev: () => void;
  turnToPage: (pageIndex: number) => void;
  getCurrentPage: () => number;
  openAlbum: () => void;
  closeAlbum: () => void;
}

interface FlipBookProps {
  onPageChange?: (page: number, total: number) => void;
  onZoomImage: (image: AlbumImage) => void;
}

const FlipBookComponent = forwardRef<FlipBookRef, FlipBookProps>(({
  onPageChange,
  onZoomImage
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);
  const currentPageRef = useRef<number>(0);
  const isFlippingRef = useRef<boolean>(false);

  const totalPages = albumData.images.length;

  useEffect(() => {
    if (!bookRef.current) return;

    // Calculate responsive dimensions per single page (3:2 ratio = 1.5:1, Open Spread = 3:1 = 10800x3600)
    const getResponsiveDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isLandscape = w > h;

      if (w < 768) {
        if (isLandscape) {
          // Mobile Landscape: Maximize height without overflowing header & controls (~120px)
          const availableHeight = Math.max(180, Math.min(h - 110, 360));
          const singleWidth = Math.round(availableHeight * 1.5);
          return { width: singleWidth, height: availableHeight };
        } else {
          // Mobile Portrait: Fit single page inside screen width
          const singleWidth = Math.min(w - 20, 380);
          const singleHeight = Math.round(singleWidth / 1.5);
          return { width: singleWidth, height: singleHeight };
        }
      } else if (w < 1180) {
        return { width: 460, height: 306 };
      } else if (w >= 1600) {
        return { width: 660, height: 440 };
      } else {
        return { width: 570, height: 380 };
      }
    };

    const { width: baseWidth, height: baseHeight } = getResponsiveDimensions();

    let pf: PageFlip | null = null;

    try {
      pf = new PageFlip(bookRef.current, {
        width: baseWidth,
        height: baseHeight,
        size: 'fixed',
        minWidth: 220,
        maxWidth: 750,
        minHeight: 150,
        maxHeight: 500,
        maxShadowOpacity: 0.6,
        showCover: true,
        mobileScrollSupport: false,
        flippingTime: 650,
        useMouseEvents: true,
        clickEventForward: true,
        usePortrait: true,
        startPage: currentPageRef.current || 0,
        drawShadow: true,
        showPageCorners: true,
        swipeDistance: 20
      });

      const pageElements = bookRef.current.querySelectorAll('.page-item');
      if (pageElements.length > 0) {
        pf.loadFromHTML(pageElements as unknown as NodeListOf<HTMLElement>);
        pageFlipInstance.current = pf;
      }

      // Event Listeners
      pf.on('flip', (e: { data: number }) => {
        const page = e.data;
        currentPageRef.current = page;
        audioEngine.playPageTurn();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(10);
        }
        if (onPageChange) {
          onPageChange(page, totalPages);
        }
      });

      pf.on('changeState', (e: { data: string }) => {
        isFlippingRef.current = (e.data === 'flipping');
      });

    } catch (err) {
      console.error('Error initializing PageFlip', err);
    }

    // Handle Window Resize and Orientation Change dynamically
    let resizeTimer: any = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (pageFlipInstance.current && bookRef.current) {
          const { width, height } = getResponsiveDimensions();
          try {
            // Update PageFlip configuration if dimensions shift
            (pageFlipInstance.current as any).update({
              width,
              height,
            });
          } catch (e) {
            // Ignore if update method signature differs
          }
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Touch Swipe Gesture Support for Mobile Devices
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = Math.abs(e.changedTouches[0].clientY - startY);
        const elapsed = Date.now() - startTime;

        // Detect horizontal swipe gesture (<500ms, >30px horizontal, <90px vertical)
        if (elapsed < 500 && Math.abs(deltaX) > 30 && deltaY < 90) {
          if (deltaX < 0) {
            // Swipe left -> flip to next page
            if (pageFlipInstance.current && !isFlippingRef.current) {
              pageFlipInstance.current.flipNext();
            }
          } else {
            // Swipe right -> flip to previous page
            if (pageFlipInstance.current && !isFlippingRef.current) {
              pageFlipInstance.current.flipPrev();
            }
          }
        }
      }
    };

    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      try {
        if (pf) {
          if ((pf as any).block) {
            (pf as any).block.remove = () => {};
          }
          pf.destroy();
          pageFlipInstance.current = null;
        }
      } catch (err) {
        console.warn('Error destroying pageFlip', err);
      }
    };
  }, []);

  // Expose imperative handle for external controls
  useImperativeHandle(ref, () => ({
    flipNext: () => {
      if (pageFlipInstance.current && !isFlippingRef.current) {
        pageFlipInstance.current.flipNext();
      }
    },
    flipPrev: () => {
      if (pageFlipInstance.current && !isFlippingRef.current) {
        pageFlipInstance.current.flipPrev();
      }
    },
    turnToPage: (targetPage: number) => {
      if (pageFlipInstance.current && !isFlippingRef.current) {
        pageFlipInstance.current.turnToPage(targetPage);
      }
    },
    getCurrentPage: () => currentPageRef.current,
    openAlbum: () => {
      if (pageFlipInstance.current) {
        audioEngine.playCoverThud();
        pageFlipInstance.current.flipNext();
      }
    },
    closeAlbum: () => {
      if (pageFlipInstance.current) {
        audioEngine.playCoverThud();
        pageFlipInstance.current.turnToPage(0);
      }
    }
  }));

  const handleOpenCover = () => {
    if (pageFlipInstance.current) {
      audioEngine.playCoverThud();
      pageFlipInstance.current.flipNext();
    }
  };

  const handleRestartAlbum = () => {
    if (pageFlipInstance.current) {
      audioEngine.playCoverThud();
      pageFlipInstance.current.turnToPage(0);
    }
  };

  const totalSheets = albumData.sheets.length;

  return (
    <div 
      ref={containerRef}
      className="flipbook-container w-full max-w-[1400px] h-[78vh] min-h-[420px] max-h-[750px] my-auto relative z-10 flex items-center justify-center p-2 sm:p-4"
    >
      {/* 3D FlipBook Element (Aspect Ratio 3:1 Spread) */}
      <div 
        ref={bookRef} 
        className="shadow-book-deep rounded-sm"
      >
        {/* PAGE 0: Front Cover (Hardcover) */}
        <div className="page-item hardcover-page" data-density="hard">
          <AlbumCover onOpen={handleOpenCover} />
        </div>

        {/* DOUBLE-PAGE SPREADS: Left + Right Half of each 10800x3600 sheet */}
        {albumData.sheets.flatMap((sheet, sheetIdx) => [
          <div 
            key={`${sheet.id}-left`} 
            className="page-item" 
            data-density="soft"
          >
            <PhotoPage
              image={sheet}
              side="left"
              sheetNumber={sheetIdx + 1}
              totalSheets={totalSheets}
              onZoom={onZoomImage}
            />
          </div>,
          <div 
            key={`${sheet.id}-right`} 
            className="page-item" 
            data-density="soft"
          >
            <PhotoPage
              image={sheet}
              side="right"
              sheetNumber={sheetIdx + 1}
              totalSheets={totalSheets}
              onZoom={onZoomImage}
            />
          </div>
        ])}

        {/* LAST PAGE: Back Cover (Hardcover) */}
        <div className="page-item hardcover-page" data-density="hard">
          <BackCover onRestart={handleRestartAlbum} />
        </div>
      </div>
    </div>
  );
});

export const FlipBook = React.memo(FlipBookComponent);
