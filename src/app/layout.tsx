import type { Metadata, Viewport } from 'next';
import { Geist, Noto_Sans_Khmer } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: '--font-noto-sans-khmer',
  subsets: ['khmer'],
  weight: ['400', '500', '700'],
});

import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b45309',
};

export const metadata: Metadata = {
  title: {
    default: 'CT Diamond Jewelry | Luxury Jewelry Phnom Penh',
    template: '%s | CT Diamond Jewelry',
  },
  description:
    'Premium luxury jewelry store in Phnom Penh, Cambodia. Browse diamond, white gold, and Italian gold collections. In-store consultations and custom designs available.',
  keywords: ['diamond', 'jewelry', 'gold', 'Phnom Penh', 'Cambodia', 'engagement ring', 'luxury'],
  authors: [{ name: 'CT Diamond Jewelry' }],
  metadataBase: new URL('https://ctdiamond.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
      { url: '/images/logo.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'CT Diamond',
    statusBarStyle: 'default',
    startupImage: '/images/logo.png',
  },
  openGraph: {
    title: 'CT Diamond Jewelry | Luxury Jewelry Phnom Penh',
    description: 'Timeless Luxury, Crafted for You. Premium jewelry in Phnom Penh.',
    url: 'https://ctdiamond.vercel.app',
    siteName: 'CT Diamond Jewelry',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/og-card.svg', width: 1080, height: 1080 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CT Diamond Jewelry',
    description: 'Timeless Luxury, Crafted for You. Premium jewelry in Phnom Penh.',
    images: ['/images/og-card.svg'],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${notoSansKhmer.variable} h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CT Diamond" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                setTimeout(() => {
                  if (!localStorage.getItem('ctd_install_dismissed')) {
                    const banner = document.createElement('div');
                    banner.id = 'install-banner';
                    banner.style.cssText = 'position:fixed;bottom:80px;left:16px;right:16px;background:white;border-radius:12px;padding:16px;box-shadow:0 4px 24px rgba(0,0,0,0.15);z-index:999;display:flex;align-items:center;gap:12px;border:1px solid #f0f0f0;max-width:400px;margin:0 auto;';
                    banner.innerHTML = '<div style="flex:1"><p style="font-size:14px;font-weight:600;margin:0;color:#1a1a1a">Add CT Diamond to your home screen</p><p style="font-size:12px;margin:4px 0 0;color:#666">Quick access to luxury jewelry</p></div><button id="install-btn" style="background:#b45309;color:white;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap">Install</button><button id="install-close" style="background:none;border:none;color:#999;font-size:18px;cursor:pointer;padding:4px">&times;</button>';
                    document.body.appendChild(banner);
                    document.getElementById('install-btn').onclick = () => {
                      deferredPrompt.prompt();
                      banner.remove();
                    };
                    document.getElementById('install-close').onclick = () => {
                      banner.remove();
                      localStorage.setItem('ctd_install_dismissed', 'true');
                    };
                  }
                }, 8000);
              });
            `,
          }}
        />
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'JewelryStore',
              name: 'CT Diamond Jewelry',
              image: 'https://ctdiamond.vercel.app/images/logo.png',
              url: 'https://ctdiamond.vercel.app',
              telephone: '+855-61-626-789',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '84 J Street 430, Sangkat Tumnup Teuk',
                addressLocality: 'Khan Chamkar Mon',
                postalCode: '120102',
                addressRegion: 'Phnom Penh',
                addressCountry: 'KH',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  opens: '09:00',
                  closes: '18:00',
                },
              ],
              priceRange: '$$',
            }),
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
