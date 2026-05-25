'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { calculateProductPricing, formatUSD, calculateGoldCost } from '@/lib/utils/pricing';
import { Plus, Trash2, Gem } from 'lucide-react';
import type { Product, LineItem, GoldRate } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
}

function generateId() {
  return `li-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ProductForm({ product }: ProductFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const isEdit = !!product;

  const [titleEn, setTitleEn] = useState(product?.title.en || '');
  const [titleKm, setTitleKm] = useState(product?.title.km || '');
  const [categoryEn, setCategoryEn] = useState(product?.category.en || '');
  const [categoryKm, setCategoryKm] = useState(product?.category.km || '');
  const [descEn, setDescEn] = useState(product?.description?.en || '');
  const [descKm, setDescKm] = useState(product?.description?.km || '');
  const [sku, setSku] = useState(product?.product_sku || '');
  const [isVisible, setIsVisible] = useState(product?.is_visible ?? true);
  const [stockStatus, setStockStatus] = useState<string>(product?.stock_status || 'AVAILABLE');
  const [lineItems, setLineItems] = useState<LineItem[]>(
    product?.pricing.line_items || []
  );
  const [discount, setDiscount] = useState(product?.pricing.discount_usd?.toString() || '0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);

  useEffect(() => {
    supabase.from('gold_rates').select('*').order('purity_type_en').then(({ data }) => {
      if (data) setGoldRates(data as GoldRate[]);
    });
  }, []);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: generateId(),
        name_km: '',
        name_en: '',
        quantity: 1,
        unit_cost_usd: 0,
        unit_selling_usd: 0,
        gold_purity: null,
        gold_weight_grams: null,
      },
    ]);
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const updated = lineItems.map((item, i) => {
      if (i !== index) return item;
      const next = { ...item };
      if (field === 'name_km' || field === 'name_en') {
        (next as Record<string, unknown>)[field] = value;
      } else if (field === 'gold_purity') {
        next.gold_purity = value as string;
        if (next.gold_weight_grams && goldRates.length > 0) {
          next.unit_cost_usd = calculateGoldCost(next.gold_purity, next.gold_weight_grams, goldRates);
        }
      } else if (field === 'gold_weight_grams') {
        next.gold_weight_grams = Number(value) || 0;
        if (next.gold_purity && goldRates.length > 0) {
          next.unit_cost_usd = calculateGoldCost(next.gold_purity, next.gold_weight_grams, goldRates);
        }
      } else if (field === 'quantity') {
        next.quantity = Number(value) || 0;
      } else if (field === 'unit_cost_usd') {
        next.unit_cost_usd = Number(value) || 0;
        next.gold_purity = null;
        next.gold_weight_grams = null;
      } else if (field === 'unit_selling_usd') {
        next.unit_selling_usd = Number(value) || 0;
      }
      return next;
    });
    setLineItems(updated);
  };

  const removeItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const computedPricing = calculateProductPricing(
    lineItems,
    parseFloat(discount) || 0,
    goldRates
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const payload = {
      product_sku: sku,
      sku_prefix: sku.split('-').slice(0, 2).join('-') || sku,
      category: { en: categoryEn, km: categoryKm },
      title: { en: titleEn, km: titleKm },
      description: { en: descEn, km: descKm },
      images: [],
      is_visible: isVisible,
      stock_status: stockStatus,
      pricing: computedPricing,
    };

    try {
      if (isEdit && product) {
        const { error: err } = await supabase
          .from('products')
          .update(payload)
          .eq('product_id', product.product_id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('products').insert(payload);
        if (err) throw err;
      }
      router.push('/admin/products');
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('admin.product_title_en')} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        <Input label={t('admin.product_title_km')} value={titleKm} onChange={(e) => setTitleKm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('admin.product_category_en')} value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} />
        <Input label={t('admin.product_category_km')} value={categoryKm} onChange={(e) => setCategoryKm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('admin.product_desc_en')} value={descEn} onChange={(e) => setDescEn(e.target.value)} />
        <Input label={t('admin.product_desc_km')} value={descKm} onChange={(e) => setDescKm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label={t('admin.product_sku')} value={sku} onChange={(e) => setSku(e.target.value)} />
        <Select
          label={t('admin.product_visible')}
          value={isVisible ? 'true' : 'false'}
          onChange={(e) => setIsVisible(e.target.value === 'true')}
          options={[
            { value: 'true', label: 'Visible' },
            { value: 'false', label: 'Hidden' },
          ]}
        />
        <Select
          label={t('admin.product_stock')}
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
          options={[
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
            { value: 'SOLD', label: 'Sold' },
          ]}
        />
      </div>

      {/* Line Items */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Line Items</h3>
          <Button variant="outline" size="sm" onClick={addLineItem}>
            <Plus size={14} className="mr-1" /> Add Item
          </Button>
        </div>

        {lineItems.length > 0 && (
          <div className="space-y-4">
            {lineItems.map((item, i) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="EN name"
                    value={item.name_en}
                    onChange={(e) => updateItem(i, 'name_en', e.target.value)}
                    className="text-xs"
                  />
                  <Input
                    placeholder="ឈ្មោះខ្មែរ"
                    value={item.name_km}
                    onChange={(e) => updateItem(i, 'name_km', e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2 items-end">
                  <Input
                    type="number"
                    step="0.01"
                    label="Qty"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                  />
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      <Gem size={12} className="inline mr-1 text-amber-600" />
                      Gold?
                    </label>
                    <select
                      value={item.gold_purity || ''}
                      onChange={(e) => updateItem(i, 'gold_purity', e.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">Not gold</option>
                      {goldRates.map((r) => (
                        <option key={r.id} value={r.purity_type_en}>
                          {r.purity_type_en} (${r.base_rate_per_unit_usd}/g)
                        </option>
                      ))}
                    </select>
                  </div>
                  {item.gold_purity ? (
                    <Input
                      type="number"
                      step="0.01"
                      label="Weight (g)"
                      value={item.gold_weight_grams ?? ''}
                      onChange={(e) => updateItem(i, 'gold_weight_grams', e.target.value)}
                    />
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      label="Cost $"
                      value={item.unit_cost_usd || ''}
                      onChange={(e) => updateItem(i, 'unit_cost_usd', e.target.value)}
                    />
                  )}
                  <Input
                    type="number"
                    step="0.01"
                    label="Sell $"
                    value={item.unit_selling_usd || ''}
                    onChange={(e) => updateItem(i, 'unit_selling_usd', e.target.value)}
                  />
                  <Button variant="ghost" className="text-red-500 mt-5" onClick={() => removeItem(i)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
                {item.gold_purity && item.gold_weight_grams && (
                  <p className="text-[10px] text-amber-600">
                    Gold cost: {item.gold_weight_grams}g × ${goldRates.find(r => r.purity_type_en === item.gold_purity)?.base_rate_per_unit_usd.toFixed(2) ?? '?'}/g = ${item.unit_cost_usd.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <Input
            label="Discount ($)"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      {/* Computed Summary */}
      {lineItems.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total Cost</span>
            <span className="font-semibold">{formatUSD(computedPricing.total_cost_usd)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Selling</span>
            <span className="font-semibold text-amber-700">{formatUSD(computedPricing.total_selling_usd)}</span>
          </div>
          <div className="flex justify-between text-green-700 font-medium">
            <span>Net Profit</span>
            <span>{formatUSD(computedPricing.net_profit_usd)}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Markup: {computedPricing.markup_percentage}%</span>
            <span>Margin: {computedPricing.profit_margin_percentage}%</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleSubmit} disabled={loading}>
          {t('admin.save')}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          {t('admin.cancel')}
        </Button>
      </div>
    </div>
  );
}
