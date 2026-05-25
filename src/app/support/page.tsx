'use client';

import { Phone, MessageCircle, Globe, Music, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const contactChannels = [
  {
    icon: Phone,
    labelKey: 'support.phone',
    href: 'tel:061626789',
    sub: '061 626 789 / 089 435 521',
    primary: true,
  },
  {
    icon: MessageCircle,
    labelKey: 'support.chat_telegram',
    href: 'https://t.me/ctdiamond',
    sub: '@ctdiamond',
  },
  {
    icon: MessageCircle,
    labelKey: 'support.chat_messenger',
    href: 'https://m.me/ctdiamond',
    sub: 'm.me/ctdiamond',
  },
];

const socialChannels = [
  { icon: Globe, labelKey: 'support.facebook', href: 'https://facebook.com' },
  { icon: Music, labelKey: 'support.tiktok', href: 'https://tiktok.com' },
  { icon: MessageCircle, labelKey: 'support.instagram', href: 'https://instagram.com' },
];

export default function SupportPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">{t('support.title')}</h1>

      {/* Contact */}
      <div className="space-y-3 mb-8">
        {contactChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <a
              key={channel.labelKey}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                <Icon className={channel.primary ? 'text-amber-700' : 'text-amber-600'} size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{t(channel.labelKey)}</p>
                {channel.sub && <p className="text-xs text-gray-500">{channel.sub}</p>}
              </div>
            </a>
          );
        })}
      </div>

      {/* Social */}
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Social</h3>
      <div className="flex gap-3 mb-8">
        {socialChannels.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.labelKey}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-white rounded-lg border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all"
            >
              <Icon className="text-amber-600" size={22} />
              <span className="text-xs text-gray-600">{t(s.labelKey)}</span>
            </a>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 text-amber-600 shrink-0" />
          <span>#1A CTD, St. 484, Phnom Penh</span>
        </div>
        <div className="flex items-start gap-2">
          <Clock size={14} className="mt-0.5 text-amber-600 shrink-0" />
          <span>{t('support.hours')}</span>
        </div>
      </div>
    </div>
  );
}
