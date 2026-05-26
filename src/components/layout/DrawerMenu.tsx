'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Home, ShoppingBag, Calendar, HeadphonesIcon, User, Settings, Globe, Music, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useAdminStore } from '@/lib/stores/adminStore';
import { useProductStore } from '@/lib/stores/productStore';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const socialLinks = [
  { icon: Globe, href: 'https://facebook.com/ctdiamondjewelry', label: 'Facebook' },
  { icon: Music, href: 'https://tiktok.com/@ctdiamondjewelry', label: 'TikTok' },
  { icon: MessageCircle, href: 'https://instagram.com/ctdiamondjewelry', label: 'Instagram' },
];

export function DrawerMenu({ open, onClose }: DrawerMenuProps) {
  const { t } = useLanguage();
  const isAdmin = useAdminStore((s) => s.isAuthenticated);
  const productCount = useProductStore((s) => s.products.length);

  const menuItems = [
    { href: '/', icon: Home, labelKey: 'nav.home' },
    { href: '/catalog', icon: ShoppingBag, labelKey: 'nav.catalog' },
    { href: '/appointment', icon: Calendar, labelKey: 'nav.appointments' },
    ...(productCount > 0 ? [{ href: '/cart', icon: ShoppingBag, labelKey: 'nav.cart' }] : []),
    { href: '/support', icon: HeadphonesIcon, labelKey: 'nav.support' },
    { href: '/profile', icon: User, labelKey: 'nav.profile' },
    ...(isAdmin ? [{ href: '/admin', icon: Settings, labelKey: 'nav.admin' }] : []),
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="p-2">
            <Image
              src="/images/logo.png"
              alt="CT Diamond Jewelry"
              width={160}
              height={50}
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
              >
                <Icon size={18} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 mb-2 font-medium">{t('support.hours')}</p>
          <a href="tel:061626789" className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 mb-3">
            <Phone size={14} />
            {t('common.phone')}
          </a>
          <div className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                  aria-label={s.label}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
