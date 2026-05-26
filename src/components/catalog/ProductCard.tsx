'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Gem } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatUSD } from '@/lib/utils/pricing';
import type { CatalogProduct } from '@/lib/supabase/catalog';

interface ProductCardProps {
  product: CatalogProduct;
}

function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('ctd_wishlist_v2') || '[]');
      setIsWishlisted(stored.includes(productId));
    } catch {
      setIsWishlisted(false);
    }
  }, [productId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('ctd_wishlist_v2') || '[]');
      let newItems: string[];
      if (stored.includes(productId)) {
        newItems = stored.filter((id: string) => id !== productId);
      } else {
        newItems = [...stored, productId];
      }
      localStorage.setItem('ctd_wishlist_v2', JSON.stringify(newItems));
      setIsWishlisted(!isWishlisted);
    } catch {
      // localStorage unavailable
    }
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={15}
        className={cn(
          'transition-colors',
          isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
        )}
      />
    </button>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const imgSrc = product.images?.[0] || '/images/placeholder.svg';
  const certification = product.certification;
  const isCertified = certification && certification !== 'none';
  const materialParts: string[] = [];
  if (product.gold_type) {
    materialParts.push(product.gold_type.charAt(0).toUpperCase() + product.gold_type.slice(1));
  }
  if (product.carat_weight) {
    materialParts.push(`${product.carat_weight.toFixed(2)}ct`);
  }

  return (
    <div className="group relative">
      <Link
        href={`/catalog/${product.id}`}
        className="block bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Gem className="text-amber-300 group-hover:text-amber-500 transition-colors" size={48} />
          )}

          {isCertified && (
            <span
              className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold shadow-sm"
              style={{
                backgroundColor: certification === 'GIA' ? '#1a3a5c' : '#8b1a1a',
                color: 'white',
              }}
            >
              {certification} Certified
            </span>
          )}

          <WishlistButton productId={product.id} />

          <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white bg-amber-700/80 px-3 py-1.5 rounded-full text-xs">
              <Gem size={14} />
              View Details
            </div>
          </div>
        </div>

        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {materialParts.length > 0 && (
            <p className="text-xs text-gray-500">
              {materialParts.join(' · ')}
            </p>
          )}

          <div>
            <p className="text-base font-bold text-gray-900">
              {formatUSD(product.price_usd)}
            </p>
            <p className="text-[11px] text-gray-400">
              ៛ {(product.price_khr || product.price_usd * 4100).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
