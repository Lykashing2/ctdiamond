'use client';

import { useState } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import type { ConsultationType } from '@/lib/types';

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

export default function AppointmentPage() {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [consultationType, setConsultationType] = useState<ConsultationType>('in_store_consultation');
  const [sizingInfo, setSizingInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !phone || !date || !timeSlot) return;
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('appointments').insert({
        customer_name: name,
        customer_phone: phone,
        date,
        time_slot: timeSlot,
        consultation_type: consultationType,
        sizing_info: sizingInfo,
        status: 'PENDING',
      });
      if (err) throw err;
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('appointment.title')}</h2>
        <p className="text-gray-500">{t('appointment.success')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-amber-600" size={24} />
        <h1 className="text-2xl font-serif font-bold text-gray-900">{t('appointment.title')}</h1>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</div>
      )}

      <div className="space-y-4">
        <Input
          label={t('appointment.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
        <Input
          label={t('appointment.phone')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="012 345 678"
        />
        <Input
          label={t('appointment.date')}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
        <Select
          label={t('appointment.time')}
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          options={[
            { value: '', label: t('appointment.time') },
            ...timeSlots.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          label={t('appointment.type')}
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value as ConsultationType)}
          options={[
            { value: 'in_store_consultation', label: t('appointment.type.consultation') },
            { value: 'bridal_fitting', label: t('appointment.type.bridal') },
            { value: 'valuation', label: t('appointment.type.valuation') },
            { value: 'custom_design', label: t('appointment.type.custom') },
          ]}
        />
        <Input
          label={t('appointment.sizing')}
          value={sizingInfo}
          onChange={(e) => setSizingInfo(e.target.value)}
          placeholder="Ring size or special notes"
        />

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={loading || !name || !phone || !date || !timeSlot}
        >
          <Clock size={18} className="mr-2" />
          {t('appointment.submit')}
        </Button>
      </div>
    </div>
  );
}
