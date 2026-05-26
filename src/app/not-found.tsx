import Link from 'next/link';
import { Gem } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Gem className="text-amber-300 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-10 px-4 text-sm bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
