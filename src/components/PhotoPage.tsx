import React, { useState } from 'react';
import { ZoomIn, ImageOff, Sparkles, Heart } from 'lucide-react';
import { AlbumImage } from '../albumData';

interface PhotoPageProps {
  image: AlbumImage;
  side: 'left' | 'right';
  sheetNumber: number;
  totalSheets: number;
  onZoom: (image: AlbumImage) => void;
}

export const PhotoPage: React.FC<PhotoPageProps> = ({
  image,
  side,
  sheetNumber,
  totalSheets,
  onZoom,
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Construct reliable image source
  const getImgSrc = () => {
    if (retryCount === 0) return image.src.startsWith('/') ? image.src : `/${image.src}`;
    if (retryCount === 1) return `album/${image.filename}`;
    if (retryCount === 2) return `./album/${image.filename}`;
    return image.filename;
  };

  const handleError = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
    } else {
      console.error(`Failed to load photo spread: ${image.filename}`);
      setHasError(true);
    }
  };

  const isLeft = side === 'left';

  return (
    <div
      className={`w-full h-full relative select-none overflow-hidden bg-[#160d0b] text-[#f7f1e5] ${
        isLeft ? 'page-left' : 'page-right'
      }`}
    >
      {hasError ? (
        /* Error Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#dfc296] bg-[#1a1210]">
          <ImageOff className="w-12 h-12 mb-2 opacity-60" />
          <p className="font-serif text-sm font-semibold">Spread Loading Error</p>
          <p className="font-sans text-[10px] opacity-75 mt-1">{image.filename}</p>
        </div>
      ) : (
        /* 10800x3600 Double-Page Spread Sliced View (Left 50% on Left page, Right 50% on Right page) */
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0908]">
          <img
            src={getImgSrc()}
            alt={`${image.title || `Spread ${sheetNumber}`} - ${isLeft ? 'Left' : 'Right'} Page`}
            onError={handleError}
            className="absolute top-0 h-full max-w-none transition-transform duration-300"
            style={{
              width: '200%',
              left: isLeft ? '0%' : '-100%',
              objectFit: 'cover',
              objectPosition: isLeft ? 'left center' : 'right center',
            }}
          />

          {/* Spine Depth Shadow Gradient */}
          {isLeft ? (
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/40 via-black/15 to-transparent pointer-events-none" />
          ) : (
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />
          )}

          {/* Ultra-subtle Outer Gold Border Line */}
          <div className="absolute inset-0 border border-white/[0.06] pointer-events-none" />
        </div>
      )}

      {/* Floating Header Info Overlay */}
      <div 
        className={`absolute top-2.5 z-20 flex items-center gap-2 text-[10px] font-sans text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] px-3 py-1 rounded-full bg-black/45 backdrop-blur-xs border border-white/10 ${
          isLeft ? 'left-3' : 'right-3'
        }`}
      >
        {isLeft ? (
          <>
            <Heart className="w-3 h-3 text-[#ffd782] fill-[#ffd782]" />
            <span className="font-serif tracking-wider">Ramya & Saravanan</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 text-[#ffd782]" />
            <span className="font-serif tracking-wider">Spread {sheetNumber} of {totalSheets}</span>
          </>
        )}
      </div>

      {/* Floating Bottom Footer with HD Zoom Button */}
      <div 
        className={`absolute bottom-2.5 z-20 flex items-center gap-2 text-[10px] font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] ${
          isLeft ? 'left-3' : 'right-3'
        }`}
      >
        {isLeft ? (
          <div className="px-2.5 py-0.5 rounded-full bg-black/50 text-[#ffd782] backdrop-blur-xs border border-white/10 font-serif text-[10px] tracking-widest">
            {image.filename}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onZoom(image);
              }}
              title="Inspect Full 10800x3600 HD Panoramic Spread"
              className="px-3 py-1 rounded-full bg-[#1b0e2b]/85 hover:bg-[#ffd782] text-[#ffd782] hover:text-[#180a26] border border-[#ffd782]/40 transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-lg backdrop-blur-sm group"
            >
              <ZoomIn className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="font-sans font-bold text-[10px] tracking-wider uppercase">HD 10800×3600</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

