'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useProductStore } from '@/lib/stores/productStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export default function CatalogPage() {
  const { t } = useLanguage();
  const { products, fetchProducts, subscribeToProducts, loading } = useProductStore();
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'SOLD'>('ALL');

  useEffect(() => {
    fetchProducts();
    const unsub = subscribeToProducts();
    return unsub;
  }, [fetchProducts, subscribeToProducts]);

  const filtered =
    filter === 'ALL'
      ? products
      : filter === 'AVAILABLE'
        ? products.filter((p) => p.stock_status === 'AVAILABLE')
        : products.filter((p) => p.stock_status === 'SOLD');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">{t('catalog.title')}</h1>
        <div className="flex gap-2">
          {(['ALL', 'AVAILABLE', 'SOLD'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {t(
                f === 'ALL'
                  ? 'catalog.filter.all'
                  : f === 'AVAILABLE'
                    ? 'catalog.filter.available'
                    : 'catalog.filter.sold'
              )}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">{t('catalog.empty')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
