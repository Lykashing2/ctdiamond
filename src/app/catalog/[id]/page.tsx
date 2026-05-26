import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Gem, Heart, Share2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { formatUSD } from '@/lib/utils/pricing';
import { getProductById, getRelatedProducts, computeKhr } from '@/lib/supabase/catalog';
import { ProductGallery } from './ProductGallery';
import { ProductDetailClient } from './ProductDetailClient';
import { RelatedProducts } from './RelatedProducts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'Product Not Found | CT Diamond' };
  }

  return {
    title: `${product.name} | CT Diamond`,
    description: product.description || `Shop ${product.name} at CT Diamond Jewelry. ${product.carat_weight ? `${product.carat_weight}ct, ` : ''}${product.certification && product.certification !== 'none' ? `${product.certification} Certified.` : ''}`,
    openGraph: {
      title: `${product.name} | CT Diamond`,
      description: product.description || undefined,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 4);
  const isCertified = product.certification && product.certification !== 'none';
  const khrPrice = product.price_khr || computeKhr(product.price_usd);

  const certLink = product.certification === 'GIA'
    ? `https://www.gia.edu/report-check?reportno=${product.certificate_number}`
    : product.certification === 'IGI'
      ? `https://www.igi.org/verify/${product.certificate_number}`
      : null;

  const specs: Array<{ label: string; value: string }> = [
    { label: 'Category', value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
    { label: 'Material', value: product.material || '—' },
    { label: 'Gold Type', value: product.gold_type ? product.gold_type.charAt(0).toUpperCase() + product.gold_type.slice(1) : '—' },
    { label: 'Carat Weight', value: product.carat_weight ? `${product.carat_weight.toFixed(2)} ct` : '—' },
    { label: 'Diamond Clarity', value: product.diamond_clarity || '—' },
    { label: 'Diamond Color', value: product.diamond_color || '—' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Catalog', href: '/catalog' },
            { label: product.name },
          ]}
        />

        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div>
            {isCertified && (
              <div className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold mb-3"
                style={{
                  backgroundColor: product.certification === 'GIA' ? '#1a3a5c' : '#8b1a1a',
                  color: 'white',
                }}
              >
                <Gem size={12} />
                {product.certification} Certified
                {certLink && (
                  <a
                    href={certLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 ml-1 underline opacity-80 hover:opacity-100"
                  >
                    Verify <ExternalLink size={10} />
                  </a>
                )}
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {product.subcategory && (
              <p className="text-sm text-amber-600 font-medium uppercase tracking-wider mb-4">
                {product.subcategory}
              </p>
            )}

            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <div className="border-t border-gray-100 pt-6 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  {formatUSD(product.price_usd)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                ៛ {khrPrice.toLocaleString()}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <Link
                href={`/appointment?product=${encodeURIComponent(product.name)}`}
                className="flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 h-12 px-6 text-base bg-amber-600 text-white hover:bg-amber-700 shadow-sm w-full"
              >
                Book a Consultation
              </Link>
              <ProductDetailClient productName={product.name} />
            </div>

            {/* Specs table */}
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Specifications
              </h2>
              <div className="divide-y divide-gray-50">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>

              {product.certificate_number && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Certificate #</span>
                    <span className="text-sm font-mono text-gray-900">{product.certificate_number}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <Suspense fallback={null}>
            <RelatedProducts products={related} category={product.category} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
