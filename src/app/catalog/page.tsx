import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FilterSidebarDesktop } from '@/components/catalog/FilterSidebar';
import { ProductGrid, ProductGridSkeleton } from '@/components/catalog/ProductGrid';
import { getProducts } from '@/lib/supabase/catalog';
import { CatalogFilterClient } from './CatalogFilterClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category as string | undefined;

  const title = category && category !== 'all'
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} | CT Diamond Catalog`
    : 'Diamond & Gold Jewelry Catalog | CT Diamond';

  const description = category && category !== 'all'
    ? `Browse our exquisite ${category} collection at CT Diamond Jewelry. GIA certified diamonds, white gold, and platinum pieces in Phnom Penh.`
    : 'Explore premium diamond and gold jewelry at CT Diamond. GIA certified diamonds, custom designs, and luxury pieces available in Phnom Penh.';

  return { title, description, openGraph: { title, description } };
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const category = (params.category as string) || undefined;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const materials = params.material
    ? (Array.isArray(params.material) ? params.material : [params.material])
    : undefined;
  const certifications = params.certification
    ? (Array.isArray(params.certification) ? params.certification : [params.certification])
    : undefined;
  const minCarat = params.minCarat ? Number(params.minCarat) : undefined;
  const maxCarat = params.maxCarat ? Number(params.maxCarat) : undefined;
  const sort = (params.sort as 'featured' | 'price_asc' | 'price_desc' | 'newest') || undefined;

  const { products, total } = await getProducts({
    category: category === 'all' ? undefined : category,
    minPrice,
    maxPrice,
    materials,
    certifications,
    minCarat,
    maxCarat,
    sort,
  });

  const categoryLabel = category && category !== 'all'
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Our Collection';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Catalog' },
          ]}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 mt-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              {categoryLabel}
            </h1>
            {products.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {total} {total === 1 ? 'piece' : 'pieces'}
              </p>
            )}
          </div>
          <Suspense fallback={null}>
            <CatalogFilterClient />
          </Suspense>
        </div>

        <div className="flex gap-8">
          <Suspense fallback={null}>
            <FilterSidebarDesktop />
          </Suspense>

          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products} total={total} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
