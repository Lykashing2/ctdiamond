'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useProductStore } from '@/lib/stores/productStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { formatUSD } from '@/lib/utils/pricing';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const { t } = useLanguage();
  const { products, fetchProducts, loading } = useProductStore();
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.confirm_delete'))) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('product_id', id);
    fetchProducts();
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t('admin.products')}</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-8 px-3 text-xs bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
        >
          <Plus size={16} className="mr-1" /> {t('admin.add_product')}
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-3">{t('admin.product_sku')}</th>
                <th className="p-3">{t('admin.product_title_en')}</th>
                <th className="p-3">Selling</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Profit</th>
                <th className="p-3">Markup</th>
                <th className="p-3">{t('admin.product_stock')}</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: Product) => (
                <tr key={product.product_id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs text-gray-600">{product.product_sku}</td>
                  <td className="p-3 font-medium text-gray-900">{product.title.en}</td>
                  <td className="p-3 font-semibold text-amber-700">
                    {formatUSD(product.pricing.total_selling_usd)}
                  </td>
                  <td className="p-3 text-gray-500">
                    {formatUSD(product.pricing.total_cost_usd)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-medium ${
                        product.pricing.net_profit_usd >= 0
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {formatUSD(product.pricing.net_profit_usd)}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    {product.pricing.markup_percentage}%
                  </td>
                  <td className="p-3">
                    <Badge variant={product.stock_status}>
                      {product.stock_status === 'AVAILABLE'
                        ? t('product.stock.available')
                        : product.stock_status === 'PENDING_PAYMENT'
                          ? t('product.stock.pending')
                          : t('product.stock.sold')}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Link
                        href={`/admin/products/${product.product_id}`}
                        className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-8 px-3 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        <Edit size={14} />
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.product_id)}
                        disabled={deleting === product.product_id}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
