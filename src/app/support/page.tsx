'use client';

import { useEffect } from 'react';
import { Phone, MessageCircle, Globe, Music, MapPin, Clock, ExternalLink } from 'lucide-react';
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
  { icon: Globe, labelKey: 'support.facebook', href: 'https://facebook.com/ctdiamondjewelry' },
  { icon: Music, labelKey: 'support.tiktok', href: 'https://tiktok.com/@ctdiamondjewelry' },
  { icon: MessageCircle, labelKey: 'support.instagram', href: 'https://instagram.com/ctdiamondjewelry' },
];

export default function SupportPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = 'Customer Support | CT Diamond Jewelry';
  }, []);

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

      {/* Map */}
      <a
        href="https://www.google.com/maps?ll=11.547908,104.902909&z=13&t=m&hl=en-US&gl=US&mapclient=embed&cid=5058729923754564393"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all mb-3"
      >
        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
          <MapPin className="text-amber-600" size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{t('home.visit')}</p>
          <p className="text-xs text-gray-500">84 J Street 430, Sangkat Tumnup Teuk, Phnom Penh</p>
        </div>
        <ExternalLink size={16} className="ml-auto text-amber-400 shrink-0" />
      </a>

      {/* Map Embed */}
      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm h-[220px] mb-3">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15635.525566174432!2d104.902909!3d11.547908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951ef8e492f29%3A0x4634381038079b29!2sCT%20Diamond!5e0!3m2!1sen!2skh!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="CT Diamond Jewelry Location"
        />
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <Clock size={14} className="mt-0.5 text-amber-600 shrink-0" />
          <span>{t('support.hours')}</span>
        </div>
      </div>
    </div>
  );
}
