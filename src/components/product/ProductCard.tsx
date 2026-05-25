'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Gem, Eye } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Badge } from '@/components/ui/Badge';
import { formatUSD } from '@/lib/utils/pricing';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, lang } = useLanguage();
  const title = product.title[lang] || product.title.en;
  const category = product.category[lang] || product.category.en;

  return (
    <Link
      href={`/catalog/${product.product_id}`}
      className={cn(
        'group block bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden',
        product.stock_status !== 'AVAILABLE' && 'opacity-70 pointer-events-none'
      )}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
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
          {formatUSD(product.pricing.total_selling_usd)}
        </p>
      </div>
    </Link>
  );
}
