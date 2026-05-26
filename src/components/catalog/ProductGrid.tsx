import Link from 'next/link';
import { Gem } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';
import type { CatalogProduct } from '@/lib/supabase/catalog';

interface ProductGridProps {
  products: CatalogProduct[];
  total: number;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ProductGrid({ products, total }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12 pointer-events-none opacity-30">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <Gem className="mx-auto text-amber-300 mb-4" size={48} />
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">
          Our collection is being curated
        </h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Book a free in-store consultation to see our full range of diamond and gold jewelry.
        </p>
        <Link href="/appointment">
          <Button variant="outline" size="lg">
            Book a Consultation
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Showing {total} {total === 1 ? 'piece' : 'pieces'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
