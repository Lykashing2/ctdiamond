'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, Languages, Heart, DollarSign } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useCartStore } from '@/lib/stores/cartStore';
import { useProductStore } from '@/lib/stores/productStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCurrencyStore } from '@/lib/stores/currencyStore';
import { useState } from 'react';
import { DrawerMenu } from './DrawerMenu';

export function Header() {
  const { t, lang, setLang } = useLanguage();
  const itemCount = useCartStore((s) => s.itemCount());
  const productCount = useProductStore((s) => s.products.length);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { currency, toggle: toggleCurrency } = useCurrencyStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="CT Diamond Jewelry"
                width={140}
                height={45}
                className="h-9 w-auto object-contain drop-shadow-sm"
                priority
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/catalog" className="hover:text-amber-600 transition-colors">
              {t('nav.catalog')}
            </Link>
            <Link href="/appointment" className="hover:text-amber-600 transition-colors">
              {t('nav.appointments')}
            </Link>
            <Link href="/support" className="hover:text-amber-600 transition-colors">
              {t('nav.support')}
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-amber-600 border border-gray-200 rounded-md hover:border-amber-300 transition-colors"
              title={currency === 'USD' ? 'Switch to KHR' : 'Switch to USD'}
            >
              <DollarSign size={14} />
              {currency}
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'km' : 'en')}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-amber-600 border border-gray-200 rounded-md hover:border-amber-300 transition-colors"
            >
              <Languages size={14} />
              {lang === 'en' ? 'KH' : 'EN'}
            </button>
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-amber-600">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {productCount > 0 && (
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-amber-600">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>
      <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
