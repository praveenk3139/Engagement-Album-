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

    // Responsive width / height calculations per single page (3:2 ratio = 1.5:1, Open Spread = 3:1 = 10800x3600)
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1180;
    const isLarge = window.innerWidth >= 1600;

    const baseWidth = isMobile ? 360 : isTablet ? 450 : isLarge ? 660 : 570;
    const baseHeight = isMobile ? 240 : isTablet ? 300 : isLarge ? 440 : 380;

    let pf: PageFlip | null = null;

    try {
      pf = new PageFlip(bookRef.current, {
        width: baseWidth,
        height: baseHeight,
        size: 'fixed',
        minWidth: 300,
        maxWidth: 750,
        minHeight: 200,
        maxHeight: 500,
        maxShadowOpacity: 0.6,
        showCover: true,
        mobileScrollSupport: false,
        flippingTime: 800,
        useMouseEvents: true,
        clickEventForward: true,
        usePortrait: true,
        startPage: 0,
        drawShadow: true,
        showPageCorners: true,
        swipeDistance: 30
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

    return () => {
      try {
        if (pf) {
          // Prevent page-flip from removing the host element from DOM during React lifecycle
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
