'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, X, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { t } = useLanguage();
  const { items, remove, clear } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    document.title = 'My Wishlist | CT Diamond Jewelry';
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Heart className="mx-auto text-gray-300 mb-4" size={48} />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {t('wishlist.title') || 'My Wishlist'}
        </h1>
        <p className="text-gray-500 mb-6">Your wishlist is empty</p>
        <Link href="/catalog">
          <Button>{t('home.hero.cta') || 'Browse Catalog'}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            {t('wishlist.title') || 'My Wishlist'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => clear()}>
            <X size={14} className="mr-1" /> Clear All
          </Button>
          <Button size="sm" onClick={() => items.forEach((p) => addItem(p))}>
            <ShoppingBag size={14} className="mr-1" /> Add All to Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => (
          <div key={product.product_id} className="relative group">
            <button
              onClick={() => remove(product.product_id)}
              className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
              aria-label="Remove from wishlist"
            >
              <X size={14} />
            </button>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
