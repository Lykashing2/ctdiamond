'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Gem, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useCartStore } from '@/lib/stores/cartStore';
import { PriceBreakdown } from '@/components/product/PriceBreakdown';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatUSD } from '@/lib/utils/pricing';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import type { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        {t('common.loading')}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">{t('common.error')}</p>
        <Link href="/catalog">
          <Button variant="outline">{t('common.retry')}</Button>
        </Link>
      </div>
    );
  }

  const title = product.title[lang] || product.title.en;
  const category = product.category[lang] || product.category.en;
  const isAvailable = product.stock_status === 'AVAILABLE';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-700 mb-6"
      >
        <ArrowLeft size={16} /> {t('catalog.title')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-amber-50 rounded-lg flex items-center justify-center border border-gray-100 relative overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <Gem className="text-amber-300" size={80} />
          )}
        </div>

        <div>
          <Badge variant={product.stock_status} className="mb-2">
            {product.stock_status === 'AVAILABLE'
              ? t('product.stock.available')
              : product.stock_status === 'PENDING_PAYMENT'
                ? t('product.stock.pending')
                : t('product.stock.sold')}
          </Badge>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">
            {category}
          </p>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-1">
            {t('product.sku')}: {product.product_sku}
          </p>

          <p className="text-3xl font-bold text-amber-700 my-6">
            {formatUSD(product.pricing.total_selling_usd)}
          </p>

          <PriceBreakdown pricing={product.pricing} />

          <div className="mt-6 space-y-3">
            {isAvailable ? (
              <>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => addItem(product)}
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {t('product.add_to_cart')}
                </Button>
                <Link href={`/checkout?product=${product.product_id}`}>
                  <Button variant="outline" className="w-full" size="lg">
                    {t('catalog.buy_now')}
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-red-500 text-center py-3">
                {t('product.not_available')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
