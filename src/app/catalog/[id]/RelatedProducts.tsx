import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/catalog/ProductCard';
import type { CatalogProduct } from '@/lib/supabase/catalog';

interface RelatedProductsProps {
  products: CatalogProduct[];
  category: string;
}

export function RelatedProducts({ products, category }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-100 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif font-bold text-gray-900">
          More {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        <Link
          href={`/catalog?category=${category}`}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
