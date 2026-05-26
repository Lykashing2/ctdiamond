'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Gem } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasGallery = images.length > 1;

  if (!images.length) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-amber-50 rounded-lg flex items-center justify-center border border-gray-100">
        <Gem className="text-amber-300" size={80} />
      </div>
    );
  }

  return (
    <div>
      <div className="relative group aspect-square bg-gradient-to-br from-gray-50 to-amber-50 rounded-lg overflow-hidden border border-gray-100">
        <img
          src={images[selectedIndex]}
          alt={`${name}${hasGallery ? ` - Image ${selectedIndex + 1}` : ''}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
        />

        {hasGallery && selectedIndex > 0 && (
          <button
            onClick={() => setSelectedIndex((i) => i - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}
        {hasGallery && selectedIndex < images.length - 1 && (
          <button
            onClick={() => setSelectedIndex((i) => i + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>

      {hasGallery && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-16 h-16 rounded-md border-2 overflow-hidden flex-shrink-0 transition-colors ${
                i === selectedIndex ? 'border-amber-500' : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
