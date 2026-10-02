import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlbumImage } from '../albumData';

interface ZoomModalProps {
  image: AlbumImage | null;
  images: AlbumImage[];
  onClose: () => void;
  onSelectImage: (image: AlbumImage) => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({
  image,
  images,
  onClose,
  onSelectImage,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentIndex = image ? images.findIndex((img) => img.src === image.src) : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < images.length - 1) {
      onSelectImage(images[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectImage(images[currentIndex - 1]);
    }
  };

  useEffect(() => {
    // Reset zoom when image changes
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [image?.src]);

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, images, currentIndex]);

  if (!image) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoomLevel > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none touch-none"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Controls */}
      <div 
        className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#181211]/95 border border-[#dfc296]/30 text-[#dfc296] z-50 max-w-[95vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-serif text-[11px] sm:text-xs text-[#f7f1e5] pr-2 border-r border-[#dfc296]/20 whitespace-nowrap">
          {currentIndex + 1} / {images.length}
        </span>

        <button
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-1.5 rounded-full hover:bg-[#cea267]/20 text-[#f7f1e5] cursor-pointer active:scale-90"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="p-1.5 rounded-full hover:bg-[#cea267]/20 text-[#f7f1e5] cursor-pointer active:scale-90"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetZoom}
          title="Reset Zoom (100%)"
          className="p-1.5 rounded-full hover:bg-[#cea267]/20 text-[#f7f1e5] cursor-pointer active:scale-90 hidden xs:inline-flex"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <a
          href={image.src}
          download={image.filename}
          title="Download Photograph"
          className="p-1.5 rounded-full hover:bg-[#cea267]/20 text-[#f7f1e5] cursor-pointer active:scale-90"
        >
          <Download className="w-4 h-4" />
        </a>

        <button
          onClick={onClose}
          title="Close Inspector (ESC)"
          className="p-1.5 rounded-full hover:bg-[#cea267]/40 text-[#dfc296] ml-1 cursor-pointer active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Prev / Next Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#181211]/80 hover:bg-[#cea267] text-[#f7f1e5] hover:text-[#181211] transition-all cursor-pointer z-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#181211]/80 hover:bg-[#cea267] text-[#f7f1e5] hover:text-[#181211] transition-all cursor-pointer z-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Zoomable Image Canvas */}
      <div
        className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          src={image.src}
          alt={image.title}
          className="max-w-[90vw] max-h-[85vh] object-contain transition-transform duration-100 ease-out drop-shadow-2xl select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          }}
        />
      </div>

      {/* Bottom Photo Metadata Caption */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs font-serif text-[#cbbaa1] bg-[#181211]/80 px-4 py-1.5 rounded-full border border-[#dfc296]/20"
        onClick={(e) => e.stopPropagation()}
      >
        <span>{image.filename}</span>
        <span className="mx-2 text-[#cea267]">•</span>
        <span>Drag to pan when zoomed</span>
      </div>
    </div>
  );
};
