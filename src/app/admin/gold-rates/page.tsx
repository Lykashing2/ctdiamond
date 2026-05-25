'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase/client';
import { formatUSD } from '@/lib/utils/pricing';
import { RefreshCw, Search, Globe, Check } from 'lucide-react';
import type { GoldRate } from '@/lib/types';

interface LiveRateData {
  spot_price_usd_per_oz: number;
  spot_price_usd_per_gram: number;
  rates: {
    purity: string;
    purity_km: string;
    rate_per_gram_usd: number;
    karat: number;
  }[];
  source: string;
  timestamp: string;
}

export default function GoldRatesPage() {
  const { t } = useLanguage();
  const [rates, setRates] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [liveData, setLiveData] = useState<LiveRateData | null>(null);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchRates = async () => {
    const { data } = await supabase
      .from('gold_rates')
      .select('*')
      .order('purity_type_en');
    if (data) setRates(data as GoldRate[]);
    setLoading(false);
  };

  useEffect(() => {
    queueMicrotask(() => fetchRates());
  }, []);

  const updateRate = async (id: string, newRate: number) => {
    setUpdating(id);
    const { error } = await supabase
      .from('gold_rates')
      .update({ base_rate_per_unit_usd: newRate, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      const rate = rates.find((r) => r.id === id);
      if (rate) {
        await supabase.rpc('recalculate_prices_for_purity', {
          p_purity_en: rate.purity_type_en,
          p_new_rate: newRate,
        });
      }
    }
    fetchRates();
    setUpdating(null);
  };

  const applyAllRates = async () => {
    if (!liveData) return;
    setFetchingLive(true);
    for (const liveRate of liveData.rates) {
      const existing = rates.find((r) => r.purity_type_en === liveRate.purity);
      if (existing) {
        await supabase
          .from('gold_rates')
          .update({ base_rate_per_unit_usd: liveRate.rate_per_gram_usd, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        await supabase.rpc('recalculate_prices_for_purity', {
          p_purity_en: existing.purity_type_en,
          p_new_rate: liveRate.rate_per_gram_usd,
        });
      }
    }
    await fetchRates();
    setShowLiveModal(false);
    setFetchingLive(false);
  };

  const fetchLiveRates = async () => {
    setFetchingLive(true);
    setFetchError('');
    try {
      const res = await fetch('/api/gold-rates/live');
      if (!res.ok) throw new Error('Failed to fetch live rates');
      const data: LiveRateData = await res.json();
      setLiveData(data);
      setShowLiveModal(true);
    } catch (e) {
      setFetchError((e as Error).message);
    }
    setFetchingLive(false);
  };

  if (loading) return <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{t('admin.gold_rates')}</h1>
        <Button onClick={fetchLiveRates} disabled={fetchingLive}>
          <Globe size={16} className="mr-1" />
          {fetchingLive ? t('common.loading') : 'Fetch Live Prices'}
        </Button>
      </div>

      {fetchError && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">{fetchError}</div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-3">{t('admin.gold_purity_en')}</th>
              <th className="p-3">{t('admin.gold_purity_km')}</th>
              <th className="p-3">{t('admin.gold_rate')} (USD/g)</th>
              <th className="p-3">Market Rate</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => {
              const market = liveData?.rates.find((r) => r.purity === rate.purity_type_en);
              return (
                <RateRow
                  key={rate.id}
                  rate={rate}
                  marketRate={market?.rate_per_gram_usd}
                  onUpdate={updateRate}
                  updating={updating === rate.id}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
        <Search size={12} />
        <span>
          {liveData
            ? `Last fetched: ${new Date(liveData.timestamp).toLocaleString()} from ${liveData.source}`
            : 'Click "Fetch Live Prices" to get current market rates'}
        </span>
      </div>

      {/* Live Rates Modal */}
      <Modal
        open={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        title="Live Gold Prices"
      >
        {liveData && (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-lg p-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Spot Price (USD/oz)</span>
                <span className="font-semibold text-gray-900">
                  {formatUSD(liveData.spot_price_usd_per_oz)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 mt-1">
                <span>Spot Price (USD/g)</span>
                <span className="font-semibold text-gray-900">
                  {formatUSD(liveData.spot_price_usd_per_gram)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs mt-2">
                <span>Source: {liveData.source}</span>
                <span>{new Date(liveData.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500 text-xs uppercase">
                  <th className="text-left py-2 font-medium">Purity</th>
                  <th className="text-right py-2 font-medium">Current</th>
                  <th className="text-right py-2 font-medium">Market</th>
                  <th className="text-right py-2 font-medium">Diff</th>
                </tr>
              </thead>
              <tbody>
                {liveData.rates.map((r) => {
                  const existing = rates.find((er) => er.purity_type_en === r.purity);
                  const current = existing?.base_rate_per_unit_usd || 0;
                  const diff = r.rate_per_gram_usd - current;
                  return (
                    <tr key={r.purity} className="border-b">
                      <td className="py-2 text-gray-900 font-medium">{r.purity}</td>
                      <td className="py-2 text-right text-gray-600">{formatUSD(current)}</td>
                      <td className="py-2 text-right font-semibold text-gray-900">
                        {formatUSD(r.rate_per_gram_usd)}
                      </td>
                      <td
                        className={`py-2 text-right font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}
                      >
                        {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={applyAllRates} disabled={fetchingLive}>
                <Check size={16} className="mr-1" />
                Apply All Market Rates
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowLiveModal(false)}>
                {t('admin.cancel')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RateRow({
  rate,
  marketRate,
  onUpdate,
  updating,
}: {
  rate: GoldRate;
  marketRate?: number;
  onUpdate: (id: string, rate: number) => Promise<void>;
  updating: boolean;
}) {
  const { t } = useLanguage();
  const [editValue, setEditValue] = useState(rate.base_rate_per_unit_usd.toString());

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium text-gray-900">{rate.purity_type_en}</td>
      <td className="p-3 text-gray-600">{rate.purity_type_km}</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatUSD(rate.base_rate_per_unit_usd)}</span>
          <Input
            type="number"
            step="0.01"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-24 text-sm"
          />
        </div>
      </td>
      <td className="p-3">
        {marketRate ? (
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-amber-700">{formatUSD(marketRate)}</span>
            <span className="text-xs text-gray-400">/g</span>
            <Badge variant="default" className="text-[10px]">
              Live
            </Badge>
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>
      <td className="p-3">
        <Button
          size="sm"
          onClick={() => onUpdate(rate.id, parseFloat(editValue) || 0)}
          disabled={updating || editValue === rate.base_rate_per_unit_usd.toString()}
        >
          <RefreshCw size={14} className={updating ? 'animate-spin mr-1' : 'mr-1'} />
          {t('admin.update_gold_rate')}
        </Button>
      </td>
    </tr>
  );
}
