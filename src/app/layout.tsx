import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b45309',
};

export const metadata: Metadata = {
  title: 'CT Diamond Jewelry | Luxury Jewelry Phnom Penh',
  description:
    'Premium luxury jewelry store in Phnom Penh, Cambodia. Browse diamond, white gold, and Italian gold collections. In-store consultations and custom designs available.',
  keywords: ['diamond', 'jewelry', 'gold', 'Phnom Penh', 'Cambodia', 'engagement ring', 'luxury'],
  authors: [{ name: 'CT Diamond Jewelry' }],
  metadataBase: new URL('https://ctdiamond.vercel.app'),
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
  openGraph: {
    title: 'CT Diamond Jewelry',
    description: 'Timeless Luxury, Crafted for You. Premium jewelry in Phnom Penh.',
    url: 'https://ctdiamond.vercel.app',
    siteName: 'CT Diamond Jewelry',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/images/logo.png', width: 1080, height: 1080 }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'CT Diamond',
    statusBarStyle: 'default',
    startupImage: '/images/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
