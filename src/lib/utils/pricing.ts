import type { LineItem, ProductPricing, GoldRate } from '@/lib/types';

export function calculateGoldCost(
  goldPurity: string | null | undefined,
  goldWeightGrams: number | null | undefined,
  goldRates: GoldRate[]
): number {
  if (!goldPurity || !goldWeightGrams) return 0;
  const rate = goldRates.find((r) => r.purity_type_en === goldPurity);
  return rate ? goldWeightGrams * rate.base_rate_per_unit_usd : 0;
}

export function recalculateLineItemCost(
  item: LineItem,
  goldRates: GoldRate[]
): number {
  if (item.gold_purity && item.gold_weight_grams) {
    const goldCost = calculateGoldCost(item.gold_purity, item.gold_weight_grams, goldRates);
    return Math.round(goldCost * 100) / 100;
  }
  return item.unit_cost_usd;
}

export function calculateProductPricing(
  lineItems: LineItem[],
  discountUsd = 0,
  goldRates?: GoldRate[]
): ProductPricing {
  const totalCostUsd = lineItems.reduce((sum, item) => {
    const cost = goldRates ? recalculateLineItemCost(item, goldRates) : item.unit_cost_usd;
    return sum + item.quantity * cost;
  }, 0);
  const totalSellingUsd = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unit_selling_usd,
    0
  );
  const netProfitUsd = totalSellingUsd - totalCostUsd - discountUsd;
  const markupPercentage =
    totalCostUsd > 0
      ? Math.round(((totalSellingUsd - totalCostUsd) / totalCostUsd) * 10000) / 100
      : 0;
  const profitMarginPercentage =
    totalSellingUsd > 0
      ? Math.round(((totalSellingUsd - totalCostUsd) / totalSellingUsd) * 10000) / 100
      : 0;

  return {
    line_items: lineItems,
    discount_usd: discountUsd,
    total_cost_usd: Math.round(totalCostUsd * 100) / 100,
    total_selling_usd: Math.round(totalSellingUsd * 100) / 100,
    net_profit_usd: Math.round(netProfitUsd * 100) / 100,
    markup_percentage: markupPercentage,
    profit_margin_percentage: profitMarginPercentage,
  };
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getReturnPolicy(categoryEn: string): { exchange: string; cashReturn: string } {
  const cat = categoryEn.toLowerCase();
  if (cat.includes('white gold')) return { exchange: '-5%', cashReturn: '-10%' };
  if (cat.includes('diamond')) return { exchange: '-3%', cashReturn: '-7%' };
  if (cat.includes('italian gold')) return { exchange: '-0%', cashReturn: '-20%' };
  return { exchange: '-5%', cashReturn: '-10%' };
}
