'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { formatUSD } from '@/lib/utils/pricing';
import type { ProductPricing } from '@/lib/types';

interface PriceBreakdownProps {
  pricing: ProductPricing;
  showCost?: boolean;
}

export function PriceBreakdown({ pricing, showCost = false }: PriceBreakdownProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
      <h4 className="font-semibold text-gray-900 mb-1">{t('product.price_breakdown')}</h4>

      {/* Header row */}
      <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 font-medium border-b pb-1">
        <span>{t('invoice.item')}</span>
        <span className="text-center">{t('invoice.quantity')}</span>
        {showCost && <span className="text-right">Cost</span>}
        <span className="text-right">{t('invoice.price')}</span>
      </div>

      {pricing.line_items.map((item) => (
        <div key={item.id} className="grid grid-cols-4 gap-2 text-gray-700">
          <span className="text-xs truncate">{item.name_en}</span>
          <span className="text-center">{item.quantity}</span>
          {showCost && (
            <span className="text-right text-gray-400">{formatUSD(item.unit_cost_usd)}</span>
          )}
          <span className="text-right font-medium">{formatUSD(item.unit_selling_usd)}</span>
        </div>
      ))}

      {pricing.discount_usd > 0 && (
        <div className="flex justify-between text-red-500 border-t pt-2">
          <span>{t('invoice.total')} Discount</span>
          <span>-{formatUSD(pricing.discount_usd)}</span>
        </div>
      )}

      <div className="border-t pt-2 space-y-1">
        {showCost && (
          <div className="flex justify-between text-gray-500 text-xs">
            <span>Total Cost</span>
            <span>{formatUSD(pricing.total_cost_usd)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-900">
          <span>{t('product.total')}</span>
          <span className="text-amber-700">{formatUSD(pricing.total_selling_usd)}</span>
        </div>
        {showCost && (
          <>
            <div className="flex justify-between text-xs">
              <span className="text-green-600 font-medium">Net Profit</span>
              <span className="text-green-600 font-medium">
                {formatUSD(pricing.net_profit_usd)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Markup</span>
              <span>{pricing.markup_percentage}%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Margin</span>
              <span>{pricing.profit_margin_percentage}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
