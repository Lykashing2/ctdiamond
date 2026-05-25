'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { formatUSD } from '@/lib/utils/pricing';
import type { Order } from '@/lib/types';

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    queueMicrotask(() => fetchOrders());
  }, []);

  const handleFulfill = async (orderId: string) => {
    await supabase.from('orders').update({ payment_status: 'PAID' }).eq('id', orderId);
    fetchOrders();
  };

  const handleEscalate = async (orderId: string) => {
    await supabase.from('orders').update({ is_international: true, notes: 'International - manual fulfillment' }).eq('id', orderId);
    fetchOrders();
  };

  if (loading) return <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.orders')}</h1>
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-3">Order</th>
              <th className="p-3">{t('checkout.name')}</th>
              <th className="p-3">{t('checkout.phone')}</th>
              <th className="p-3">{t('product.total')}</th>
              <th className="p-3">{t('checkout.payment')}</th>
              <th className="p-3">Zone</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">#{order.id.slice(0, 8)}</td>
                <td className="p-3 font-medium">{order.customer_name}</td>
                <td className="p-3">{order.customer_phone}</td>
                <td className="p-3 font-semibold">{formatUSD(order.total_usd)}</td>
                <td className="p-3">
                  <Badge
                    variant={
                      order.payment_status === 'PAID'
                        ? 'success'
                        : order.payment_status === 'PENDING'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {order.payment_status}
                  </Badge>
                </td>
                <td className="p-3 text-xs text-gray-500">
                  {order.is_international ? 'International' : order.delivery_zone}
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {order.payment_status === 'PENDING' && (
                      <Button size="sm" onClick={() => handleFulfill(order.id)}>
                        {t('admin.fulfill')}
                      </Button>
                    )}
                    {!order.is_international && (
                      <Button size="sm" variant="outline" onClick={() => handleEscalate(order.id)}>
                        {t('admin.escalate')}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
