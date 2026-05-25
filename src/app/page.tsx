'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { ProductCard } from '@/components/product/ProductCard';
import { useProductStore } from '@/lib/stores/productStore';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const availableProducts = products.filter((p) => p.stock_status === 'AVAILABLE').slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="mb-6 inline-block bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-amber-100">
              <Image
                src="/images/logo.png"
                alt="CT Diamond Jewelry"
                width={220}
                height={70}
                className="h-16 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-4">
              {t('home.hero.title')}
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 mb-8 font-serif"
              style={lang === 'km' ? { wordSpacing: '0.1em' } : undefined}
            >
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/catalog">
                <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white">
                  {t('home.hero.cta')}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/appointment">
                <Button size="lg" variant="outline">
                  {t('nav.appointments')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-100/40 to-transparent hidden lg:block" />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            {t('home.featured')}
          </h2>
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 font-medium"
          >
            {t('catalog.title')} <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
        {!loading && availableProducts.length === 0 && (
          <p className="text-center text-gray-400 py-8">{t('catalog.empty')}</p>
        )}
      </section>

      {/* Store Info */}
      <section className="bg-amber-50/60 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-4 max-w-lg mx-auto text-center flex-col items-center">
            <MapPin className="text-amber-700" size={28} />
            <div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                {t('home.visit')}
              </h3>
              <p className="text-gray-600">
                #1A CTD, St. 484, Phum 3, Sangkat Phsar Daeum Thkov,<br />
                Khan Chamkar Mon, Phnom Penh, Cambodia
              </p>
              <p className="text-amber-700 font-medium mt-2">{t('common.phone')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
