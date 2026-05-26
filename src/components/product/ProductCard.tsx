'use client';

import Link from 'next/link';
import { Gem, Eye, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Badge } from '@/components/ui/Badge';
import { formatUSD } from '@/lib/utils/pricing';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useLanguage();
  const formatCurrency = useCurrencyStore((s) => s.format);
  const wishlist = useWishlistStore();
  const title = product.title[lang] || product.title.en;
  const category = product.category[lang] || product.category.en;
  const isWishlisted = wishlist.has(product.product_id);

  return (
    <div className="group relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          wishlist.toggle(product);
        }}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={16}
          className={cn(
            'transition-colors',
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
          )}
        />
      </button>
      <Link
        href={`/catalog/${product.product_id}`}
        className={cn(
          'block bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden',
          product.stock_status !== 'AVAILABLE' && 'opacity-70 pointer-events-none'
        )}
      >
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
          {(product.image_phone || product.images?.[0]) ? (
            <picture className="absolute inset-0 w-full h-full">
              <source media="(min-width: 1024px)" srcSet={product.image_desktop || product.image_tablet || product.image_phone || product.images[0]} />
              <source media="(min-width: 640px)" srcSet={product.image_tablet || product.image_phone || product.images[0]} />
              <img
                src={product.image_phone || product.images[0]}
                alt={title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </picture>
          ) : (
            <Gem className="text-amber-300 group-hover:text-amber-500 transition-colors" size={48} />
          )}
          {product.stock_status !== 'AVAILABLE' && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Badge variant={product.stock_status}>
                {product.stock_status === 'PENDING_PAYMENT'
                  ? t('product.stock.pending')
                  : t('product.stock.sold')}
              </Badge>
            </div>
          )}
          {product.stock_status === 'AVAILABLE' && (
            <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-white bg-amber-700/80 px-3 py-1.5 rounded-full text-xs">
                <Eye size={14} />
                {t('catalog.view_details')}
              </div>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-amber-600 font-medium mb-1">{category}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-2">{title}</h3>
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(product.pricing.total_selling_usd)}
          </p>
        </div>
      </Link>
    </div>
  );
}
