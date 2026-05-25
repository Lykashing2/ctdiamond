'use client';

import { useEffect, useState } from 'react';
import { User, Package, Calendar, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useAuthStore } from '@/lib/stores/authStore';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Order, Appointment } from '@/lib/types';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { phone, isVerified, name, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!phone) return;
    supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });
    supabase
      .from('appointments')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setAppointments(data as Appointment[]);
      });
  }, [phone]);

  if (!isVerified) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User className="mx-auto text-gray-300 mb-4" size={48} />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{t('profile.title')}</h1>
        <p className="text-gray-500">{t('nav.login')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
            <User className="text-amber-700" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{name || 'Customer'}</h1>
            <p className="text-sm text-gray-500">{phone}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={16} className="mr-1" /> {t('nav.logout')}
        </Button>
      </div>

      {/* Orders */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
          <Package size={16} /> {t('profile.orders')}
        </h2>
        <div className="space-y-2">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400">{t('cart.empty')}</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
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
              </div>
            ))
          )}
        </div>
      </section>

      {/* Appointments */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">
          <Calendar size={16} /> {t('profile.appointments')}
        </h2>
        <div className="space-y-2">
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-400">{t('appointment.title')}</p>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{apt.date}</p>
                  <p className="text-xs text-gray-500">{apt.time_slot}</p>
                </div>
                <Badge
                  variant={
                    apt.status === 'CONFIRMED'
                      ? 'success'
                      : apt.status === 'PENDING'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {apt.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
