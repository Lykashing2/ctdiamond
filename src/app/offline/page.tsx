'use client';

import { Gem } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import Link from 'next/link';

export default function OfflinePage() {
  const { lang } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        <Gem className="text-amber-300 mx-auto mb-4" size={48} />
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {lang === 'km' ? 'គ្មានបណ្តាញ' : 'You\'re Offline'}
        </h1>
        <p className="text-gray-500 mb-6">
          {lang === 'km'
            ? 'សូមភ្ជាប់អ៊ីនធឺណិត ហើយព្យាយាមម្តងទៀត'
            : 'Please connect to the internet and try again'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
        >
          {lang === 'km' ? 'ត្រឡប់ទៅដើមវិញ' : 'Go Home'}
        </Link>
      </div>
    </div>
  );
}
