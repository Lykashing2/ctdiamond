'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Calendar, TrendingUp, Gem, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { supabase } from '@/lib/supabase/client';
import { formatUSD, recalculateLineItemCost } from '@/lib/utils/pricing';
import { cn } from '@/lib/utils/cn';
import type { Product, GoldRate } from '@/lib/types';

interface DashboardStats {
  products: number;
  orders: number;
  pendingAppointments: number;
  totalCost: number;
  totalRevenue: number;
  totalProfit: number;
  soldValue: number;
  profitByCategory: { category: string; profit: number; revenue: number }[];
  topProducts: { sku: string; title: string; profit: number; margin: number }[];
  bottomProducts: { sku: string; title: string; profit: number; margin: number }[];
  goldImpact: number;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [goldRates, setGoldRates] = useState<GoldRate[]>([]);
  const [selectedGoldRate, setSelectedGoldRate] = useState<string>('');
  const [appointmentsThisWeek, setAppointmentsThisWeek] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [weekChartData, setWeekChartData] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    async function loadStats() {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
      ]);

      const { data: products } = await supabase.from('products').select('*');
      const allProducts = (products as Product[]) || [];

      const { data: goldData } = await supabase.from('gold_rates').select('*').order('purity_type_en');
      const rates = (goldData as GoldRate[]) || [];
      setGoldRates(rates);
      if (rates.length > 0) setSelectedGoldRate(rates[0].purity_type_en);

      const pendingAptRes = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      const soldProducts = allProducts.filter((p) => p.stock_status === 'SOLD');

      const totalCost = allProducts.reduce((s, p) => s + (p.pricing?.total_cost_usd || 0), 0);
      const totalRevenue = allProducts.reduce((s, p) => s + (p.pricing?.total_selling_usd || 0), 0);
      const totalProfit = allProducts.reduce((s, p) => s + (p.pricing?.net_profit_usd || 0), 0);
      const soldValue = soldProducts.reduce((s, p) => s + (p.pricing?.total_selling_usd || 0), 0);

      // Category breakdown
      const catMap = new Map<string, { profit: number; revenue: number }>();
      for (const p of allProducts) {
        const cat = p.category?.en || 'Uncategorized';
        const c = catMap.get(cat) || { profit: 0, revenue: 0 };
        c.profit += p.pricing?.net_profit_usd || 0;
        c.revenue += p.pricing?.total_selling_usd || 0;
        catMap.set(cat, c);
      }
      const profitByCategory = Array.from(catMap.entries())
        .map(([category, v]) => ({ category, profit: v.profit, revenue: v.revenue }))
        .sort((a, b) => b.profit - a.profit);

      // Top/bottom products
      const productRanks = allProducts.map((p) => ({
        sku: p.product_sku,
        title: p.title?.en || '',
        profit: p.pricing?.net_profit_usd || 0,
        margin: p.pricing?.profit_margin_percentage || 0,
      })).sort((a, b) => b.profit - a.profit);

      // Gold impact: what if gold rates went up 10%?
      const goldImpact = allProducts.reduce((s, p) => {
        const goldItems = (p.pricing?.line_items || []).filter((li) => li.gold_purity && li.gold_weight_grams);
        for (const item of goldItems) {
          const currentGoldCost = recalculateLineItemCost(item, rates);
          const increasedGoldCost = currentGoldCost * 1.1;
          s += (increasedGoldCost - currentGoldCost) * item.quantity;
        }
        return s;
      }, 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      const { data: weekAppointments } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', sevenDaysAgoStr)
        .order('date', { ascending: true });

      if (weekAppointments) {
        setAppointmentsThisWeek(weekAppointments);
        const dayMap = new Map<string, number>();
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dayMap.set(d.toISOString().split('T')[0], 0);
        }
        for (const apt of weekAppointments) {
          const key = apt.date?.split('T')[0];
          if (key && dayMap.has(key)) {
            dayMap.set(key, (dayMap.get(key) || 0) + 1);
          }
        }
        setWeekChartData(Array.from(dayMap.entries()).map(([date, count]) => ({ date, count })));
      }

      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentOrdersData) {
        setRecentOrders(recentOrdersData);
      }

      setStats({
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
        pendingAppointments: pendingAptRes.count || 0,
        totalCost,
        totalRevenue,
        totalProfit,
        soldValue,
        profitByCategory,
        topProducts: productRanks.slice(0, 5),
        bottomProducts: productRanks.slice(-5).reverse(),
        goldImpact,
      });
    }
    loadStats();
  }, []);

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>;
  }

  const profitMargin = stats.totalRevenue > 0
    ? (stats.totalProfit / stats.totalRevenue) * 100
    : 0;

  const cards = [
    { icon: Package, label: 'Total Products', value: stats.products.toString(), sub: `${formatUSD(stats.totalRevenue)} inventory`, color: 'text-blue-600 bg-blue-50' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.orders.toString(), sub: `${formatUSD(stats.soldValue)} sold`, color: 'text-green-600 bg-green-50' },
    { icon: Calendar, label: 'Pending Appointments', value: stats.pendingAppointments.toString(), sub: 'Awaiting confirmation', color: 'text-amber-600 bg-amber-50' },
    { icon: TrendingUp, label: 'Net Profit', value: formatUSD(stats.totalProfit), sub: `${profitMargin.toFixed(1)}% margin`, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">{t('admin.dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
              <div className={`p-2 rounded-lg inline-flex ${card.color} mb-2`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
              {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Revenue & Profit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <BarChart3 size={16} /> Profit & Loss Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Total Revenue (Selling Price)</span>
              <span className="font-semibold text-gray-900">{formatUSD(stats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Total Cost</span>
              <span className="font-semibold text-gray-900">{formatUSD(stats.totalCost)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500">Cost Ratio</span>
              <span className="text-gray-600">
                {stats.totalRevenue > 0 ? ((stats.totalCost / stats.totalRevenue) * 100).toFixed(1) : '0'}%
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="font-semibold text-gray-700">Net Profit</span>
              <div className="text-right">
                <span className={cn('font-bold text-lg', stats.totalProfit >= 0 ? 'text-green-600' : 'text-red-500')}>
                  {formatUSD(stats.totalProfit)}
                </span>
                <span className={cn('text-xs ml-2', profitMargin >= 0 ? 'text-green-500' : 'text-red-500')}>
                  {profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Rate Impact */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <Gem size={16} className="text-amber-600" /> Gold Sensitivity
          </h3>
          {goldRates.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {goldRates.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedGoldRate(r.purity_type_en)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md border transition-colors',
                      selectedGoldRate === r.purity_type_en
                        ? 'border-amber-400 bg-amber-50 text-amber-700 font-medium'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    )}
                  >
                    {r.purity_type_en}: {formatUSD(r.base_rate_per_unit_usd)}/g
                  </button>
                ))}
              </div>
              <div className="bg-amber-50 rounded p-3 text-xs space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>+10% Gold Rate Impact</span>
                  <span className="font-semibold text-red-500">{formatUSD(stats.goldImpact)} ↓</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Profit after +10% gold</span>
                  <span className="font-semibold text-gray-900">
                    {formatUSD(stats.totalProfit - stats.goldImpact)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  How much profit drops if gold rates rise 10%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profit by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Profit by Category</h3>
          <div className="space-y-2">
            {stats.profitByCategory.map((cat) => {
              const margin = cat.revenue > 0 ? (cat.profit / cat.revenue) * 100 : 0;
              const maxProfit = Math.max(...stats.profitByCategory.map((c) => c.profit), 1);
              const barWidth = Math.max((cat.profit / maxProfit) * 100, 1);
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{cat.category}</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{formatUSD(cat.profit)}</span>
                      <span className={cn('text-xs ml-1', margin >= 0 ? 'text-green-500' : 'text-red-500')}>
                        ({margin.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={cn('h-2 rounded-full transition-all', cat.profit >= 0 ? 'bg-green-500' : 'bg-red-400')}
                      style={{ width: `${Math.abs(barWidth)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.profitByCategory.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <ArrowUpRight size={16} className="text-green-500" /> Top 5 Most Profitable
          </h3>
          <div className="space-y-2">
            {stats.topProducts.map((p, i) => (
              <div key={p.sku} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-gray-400 font-mono w-5">#{i + 1}</span>
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title || p.sku}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-green-600">{formatUSD(p.profit)}</p>
                  <p className="text-xs text-gray-400">{p.margin.toFixed(1)}% margin</p>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Products */}
      {stats.bottomProducts.some((p) => p.profit < 0) && (
        <div className="bg-white rounded-lg border border-red-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <ArrowDownRight size={16} className="text-red-500" /> Products Running at Loss
          </h3>
          <div className="space-y-2">
            {stats.bottomProducts.filter((p) => p.profit < 0).map((p) => (
              <div key={p.sku} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{p.title || p.sku}</p>
                  <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-500">{formatUSD(p.profit)}</p>
                  <p className="text-xs text-gray-400">{p.margin.toFixed(1)}% margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments This Week & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <Calendar size={16} /> Appointments This Week
          </h3>
          <p className="text-2xl font-bold text-gray-900 mb-3">{appointmentsThisWeek.length}</p>
          <div className="space-y-2">
            {appointmentsThisWeek.slice(0, 10).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{apt.customer_name}</p>
                  <p className="text-xs text-gray-400">{apt.date} {apt.time_slot}</p>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                  apt.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' :
                  apt.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                  'bg-gray-50 text-gray-500'
                )}>
                  {apt.status}
                </span>
              </div>
            ))}
            {appointmentsThisWeek.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No appointments this week</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <ShoppingBag size={16} /> Recent Orders
          </h3>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{order.customer_name || order.id}</p>
                  <p className="text-xs text-gray-400">{formatUSD(order.total_amount || 0)}</p>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                  order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                  order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' :
                  order.status === 'PROCESSING' ? 'bg-amber-50 text-amber-600' :
                  order.status === 'PENDING' ? 'bg-gray-50 text-gray-600' :
                  'bg-red-50 text-red-600'
                )}>
                  {order.status}
                </span>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Overview Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <BarChart3 size={16} /> 7-Day Overview
        </h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {weekChartData.map((day) => {
            const maxCount = Math.max(...weekChartData.map((d) => d.count), 1);
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{day.count}</span>
                <div className="w-full flex-1 flex justify-center items-end">
                  <div
                    className="w-3/4 bg-blue-500 rounded-t transition-all"
                    style={{ height: `${Math.max(height, day.count > 0 ? 4 : 0)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
