import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
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
          <div className="absolute inset-0 border border-white/[0.04] pointer-events-none" />
        </div>
      )}
    </div>
  );
};

