'use client';

import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useCartStore } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { formatUSD } from '@/lib/utils/pricing';

export default function CartPage() {
  const { t, lang } = useLanguage();
  const { items, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('cart.title')}</h1>
        <p className="text-gray-500 mb-6">{t('cart.empty')}</p>
        <Link href="/catalog">
          <Button>{t('home.hero.cta')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('cart.title')}</h1>

      <div className="space-y-4">
        {items.map((item) => {
          const title = item.product.title[lang] || item.product.title.en;
          return (
            <div
              key={item.product.product_id}
              className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-amber-50 rounded flex items-center justify-center shrink-0">
                <ShoppingBag className="text-amber-300" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">
                  {t('invoice.quantity')}: {item.quantity}
                </p>
                <p className="text-sm font-semibold text-amber-700 mt-1">
                  {formatUSD(item.product.pricing.total_selling_usd * item.quantity)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.product.product_id)}
                className="p-1 text-gray-400 hover:text-red-500"
                aria-label={t('cart.remove')}
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>{t('cart.subtotal')}</span>
          <span className="text-amber-700">{formatUSD(subtotal())}</span>
        </div>
      </div>

      <Link href="/checkout" className="block mt-6">
        <Button className="w-full" size="lg">
          {t('cart.checkout')} <ArrowRight size={18} className="ml-2" />
        </Button>
      </Link>
    </div>
  );
}
