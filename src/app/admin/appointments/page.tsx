'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import type { Appointment } from '@/lib/types';

export default function AdminAppointmentsPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: false });
    if (data) setAppointments(data as Appointment[]);
    setLoading(false);
  };

  useEffect(() => {
    queueMicrotask(() => fetchAppointments());
  }, []);

  const updateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
  };

  if (loading) return <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('admin.appointments')}</h1>
      <div className="space-y-3">
        {appointments.length === 0 && (
          <p className="text-center text-gray-400 py-8">{t('common.loading')}</p>
        )}
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-gray-900">{apt.customer_name}</p>
              <p className="text-sm text-gray-500">{apt.customer_phone}</p>
              <p className="text-xs text-gray-400 mt-1">
                {apt.date} at {apt.time_slot}
              </p>
              <p className="text-xs text-gray-400">
                {apt.consultation_type}
                {apt.sizing_info && ` - ${apt.sizing_info}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
              {apt.status === 'PENDING' && (
                <>
                  <Button size="sm" onClick={() => updateStatus(apt.id, 'CONFIRMED')}>
                    Confirm
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => updateStatus(apt.id, 'CANCELLED')}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
