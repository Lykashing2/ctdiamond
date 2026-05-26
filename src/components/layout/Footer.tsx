'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Clock, ExternalLink, Globe, Music, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="CT Diamond Jewelry"
                width={180}
                height={55}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-400">
              {t('home.hero.subtitle')}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">{t('home.visit')}</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-amber-500 shrink-0" />
                84 J Street 430, Sangkat Tumnup Teuk, Khan Chamkar Mon, Phnom Penh 120102
              </p>
              <a
                href="https://www.google.com/maps?ll=11.547908,104.902909&z=13&t=m&hl=en-US&gl=US&mapclient=embed&cid=5058729923754564393"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
              >
                <ExternalLink size={12} />
                {t('home.view_map')}
              </a>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-500 shrink-0" />
                {t('common.phone')}
              </p>
              <p className="flex items-center gap-2">
                <Clock size={14} className="text-amber-500 shrink-0" />
                {t('support.hours')}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/catalog" className="block hover:text-amber-400">{t('nav.catalog')}</Link>
              <Link href="/appointment" className="block hover:text-amber-400">{t('nav.appointments')}</Link>
              <Link href="/support" className="block hover:text-amber-400">{t('nav.support')}</Link>
            </div>
            <h4 className="font-semibold text-white mb-3 mt-6">Learn</h4>
            <div className="space-y-2 text-sm">
              <Link href="/learn/diamond-guide" className="block hover:text-amber-400">Diamond Guide</Link>
              <Link href="/learn/gold-types" className="block hover:text-amber-400">Gold Types</Link>
              <Link href="/learn/gemstone-guide" className="block hover:text-amber-400">Gemstone Guide</Link>
            </div>
            <h4 className="font-semibold text-white mb-3 mt-6">Social</h4>
            <div className="flex gap-3">
              <a href="https://facebook.com/ctdiamondjewelry" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-amber-400 transition-colors rounded-full hover:bg-gray-800" aria-label="Facebook">
                <Globe size={18} />
              </a>
              <a href="https://tiktok.com/@ctdiamondjewelry" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-amber-400 transition-colors rounded-full hover:bg-gray-800" aria-label="TikTok">
                <Music size={18} />
              </a>
              <a href="https://instagram.com/ctdiamondjewelry" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-amber-400 transition-colors rounded-full hover:bg-gray-800" aria-label="Instagram">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CT Diamond Jewelry. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
