'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Gem,
  Sparkles,
  Ruler,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
];

const SERVICE_CARDS = [
  { id: 'browse', labelKey: 'appointment.type.browse', icon: Gem, descKey: 'appointment.type.browse_desc' },
  { id: 'custom', labelKey: 'appointment.type.custom', icon: Sparkles, descKey: 'appointment.type.custom_desc' },
  { id: 'sizing', labelKey: 'appointment.type.sizing', icon: Ruler, descKey: 'appointment.type.sizing_desc' },
  { id: 'consultation', labelKey: 'appointment.type.consultation', icon: MessageCircle, descKey: 'appointment.type.consultation_desc' },
];

function useBookedSlots(date: string): string[] {
  const [booked, setBooked] = useState<string[]>([]);
  useEffect(() => {
    if (!date) { setBooked([]); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('appointments')
        .select('time_slot')
        .eq('date', date)
        .neq('status', 'CANCELLED');
      if (!cancelled) setBooked(data?.map(r => r.time_slot) ?? []);
    })();
    return () => { cancelled = true; };
  }, [date]);
  return booked;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function AppointmentPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [animDir, setAnimDir] = useState<'fwd' | 'bwd'>('fwd');

  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => { document.title = 'Book an Appointment | CT Diamond Jewelry'; }, []);

  const bookedSlots = useBookedSlots(selectedDate);

  const goToStep = useCallback((s: number) => {
    setAnimDir(s > step ? 'fwd' : 'bwd');
    setStep(s);
  }, [step]);

  const canStep1 = selectedDate && selectedTime;
  const canStep2 = serviceId;
  const canStep3 = name.trim() && phone.trim();

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const calendarDays = useMemo(() => {
    const first = new Date(calYear, calMonth, 1);
    const dayOfWeek = first.getDay(); // 0=Sun
    const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells: Array<{ day: number; dateStr: string; isCurrentMonth: boolean }> = [];
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(calYear, calMonth, -startOffset + i + 1);
      cells.push({ day: d.getDate(), dateStr: '', isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(calYear, calMonth, d);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      cells.push({ day: d, dateStr: `${y}-${m}-${day}`, isCurrentMonth: true });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: 0, dateStr: '', isCurrentMonth: false });
    }
    return cells;
  }, [calYear, calMonth]);

  const isPast = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr + 'T00:00:00');
    return d < today;
  };

  const isSunday = (dateStr: string) => {
    if (!dateStr) return false;
    return new Date(dateStr + 'T00:00:00').getDay() === 0;
  };

  const isSelectable = (dateStr: string) => {
    if (!dateStr) return false;
    return !isPast(dateStr) && !isSunday(dateStr);
  };

  const handleDateClick = (dateStr: string) => {
    if (!isSelectable(dateStr)) return;
    setSelectedDate(dateStr);
    setSelectedTime('');
  };

  const handleSubmit = async () => {
    if (!canStep3 || !canStep2 || !canStep1) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const { error } = await supabase.from('appointments').insert({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        date: selectedDate,
        time_slot: selectedTime,
        consultation_type: serviceId,
        sizing_info: notes,
        status: 'PENDING',
      });
      if (error) throw error;
      setSubmitted(true);
      setTimeout(() => setShowCheck(true), 100);

      const waMsg = `New+appointment+from+${encodeURIComponent(name.trim())}+(${encodeURIComponent(phone.trim())})+for+${encodeURIComponent(
        t(SERVICE_CARDS.find(s => s.id === serviceId)?.labelKey ?? serviceId)
      )}+on+${selectedDate}+at+${selectedTime}.+Notes:+${encodeURIComponent(notes)}`;
      window.open(`https://wa.me/85561626789?text=${waMsg}`, '_blank');
    } catch (e) {
      setSubmitError((e as Error).message);
    }
    setSubmitting(false);
  };

  const serviceLabel = t(SERVICE_CARDS.find(s => s.id === serviceId)?.labelKey ?? '');

  const stepClass = (s: number) => {
    const base = 'transition-all duration-500 ease-in-out ';
    if (step === s) return base + 'opacity-100 translate-x-0';
    return base + 'opacity-0 pointer-events-none absolute';
  };

  const progressDot = (s: number, label: string) => (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
            step > s ? 'bg-amber-700 text-white' : step === s ? 'bg-amber-700 text-white ring-4 ring-amber-200' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {step > s ? <CheckCircle size={16} /> : s}
        </div>
        <span className={`text-[10px] sm:text-xs mt-1 whitespace-nowrap ${step >= s ? 'text-amber-700 font-medium' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 ${showCheck ? 'bg-green-100 scale-100' : 'bg-green-50 scale-0'}`}>
            {showCheck && (
              <svg className="w-10 h-10 text-green-600 animate-[scaleIn_0.3s_ease-out]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">{t('appointment.success.title')}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t('appointment.success.thanks').replace('{name}', name).replace('{service}', serviceLabel).replace('{date}', formatDate(selectedDate)).replace('{time}', selectedTime).replace('{phone}', phone)}
          </p>

          <div className="bg-gray-50 rounded-xl p-5 text-left mb-8 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">{t('appointment.success.store_details')}</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <span>84 J Street 430, Sangkat Tumnup Teuk, Khan Chamkar Mon, Phnom Penh 120102</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-amber-600 shrink-0" />
                <a
                  href="https://www.google.com/maps?ll=11.547908,104.902909&z=13&t=m&hl=en-US&gl=US&mapclient=embed&cid=5058729923754564393"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:underline font-medium"
                >
                  {t('appointment.success.get_directions')}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-amber-600 shrink-0" />
                <span>061 626 789 / 089 435 521</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-10 px-4 text-sm border border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('appointment.success.back_home')}
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 h-10 px-4 text-sm bg-amber-700 hover:bg-amber-800 text-white w-full sm:w-auto"
            >
              {t('appointment.success.browse')}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-10 gap-0 sm:gap-4">
          {progressDot(1, t('calendar.select_date'))}
          <div className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors ${step >= 2 ? 'bg-amber-700' : 'bg-gray-200'}`} />
          {progressDot(2, t('calendar.select_service'))}
          <div className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors ${step >= 3 ? 'bg-amber-700' : 'bg-gray-200'}`} />
          {progressDot(3, t('calendar.your_info'))}
        </div>

        {/* Error */}
        {submitError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">{submitError}</div>
        )}

        {/* Steps Container */}
        <div className="relative overflow-hidden">
          {/* Step 1: Calendar & Time */}
          <div className={stepClass(1)} style={step !== 1 ? { position: 'absolute', inset: 0 } : {}}>
            {/* Summary bar (when navigating back from later steps) */}
            {step === 1 && selectedDate && selectedTime && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between mb-6 text-sm">
                <span className="text-gray-700 font-medium">
                  <Calendar size={14} className="inline mr-1 text-amber-600" />
                  {formatDate(selectedDate)} at {selectedTime}
                </span>
              </div>
            )}

            <h2 className="text-xl font-serif font-bold text-gray-900 mb-5">{t('calendar.select_date')}</h2>

            {/* Calendar */}
            <div className="border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <span className="font-semibold text-gray-900 text-base">
                  {t('calendar.months').split(',')[calMonth]} {calYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {t('calendar.days').split(',').map(h => (
                  <div key={h} className="text-center text-xs font-semibold text-gray-500 py-2">
                    {h}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((cell, idx) => {
                  if (!cell.dateStr) {
                    return <div key={idx} className="aspect-square" />;
                  }
                  const past = isPast(cell.dateStr);
                  const sun = isSunday(cell.dateStr);
                  const selected = selectedDate === cell.dateStr;
                  const selectable = !past && !sun;

                  return (
                    <button
                      key={cell.dateStr ?? idx}
                      onClick={() => handleDateClick(cell.dateStr)}
                      disabled={!selectable}
                      className={`relative flex items-center justify-center aspect-square text-sm transition-all outline-none
                        min-w-[44px] min-h-[44px]
                        ${sun ? 'bg-gray-50 text-gray-300 cursor-default rounded-none' : ''}
                        ${past ? 'text-gray-300 cursor-default' : ''}
                        ${selectable && !selected ? 'hover:bg-amber-50 cursor-pointer text-gray-800' : ''}
                        ${selected ? 'bg-amber-700 text-white rounded-full font-semibold' : ''}
                        ${!past && !sun && !selected ? 'rounded-full' : ''}
                      `}
                    >
                      {cell.day}
                      {sun && (
                        <span className="absolute -bottom-0.5 text-[8px] text-gray-400 font-medium">{t('calendar.closed')}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-amber-600" />
              {t('calendar.available_slots')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {TIME_SLOTS.map(slot => {
                const booked = selectedDate && bookedSlots.includes(slot);
                const selected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => !booked && selectedDate && setSelectedTime(slot)}
                    disabled={booked || !selectedDate}
                    className={`py-3 px-3 text-sm rounded-lg border transition-all min-h-[44px]
                      ${booked || !selectedDate ? 'border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed' : ''}
                      ${selected ? 'border-amber-700 bg-amber-700 text-white font-medium shadow-sm' : ''}
                      ${!booked && selectedDate && !selected ? 'border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50 cursor-pointer' : ''}
                    `}
                  >
                    {slot}
                    {booked && <span className="block text-[10px] text-gray-400">{t('calendar.booked')}</span>}
                  </button>
                );
              })}
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!canStep1}
              onClick={() => goToStep(2)}
            >
              {t('calendar.continue')}
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>

          {/* Step 2: Service Selection */}
          <div className={stepClass(2)} style={step !== 2 ? { position: 'absolute', inset: 0 } : {}}>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between mb-6 text-sm">
              <span className="text-gray-700 font-medium">
                <Calendar size={14} className="inline mr-1 text-amber-600" />
                {t('calendar.your_appointment').replace('{date}', formatDate(selectedDate)).replace('{time}', selectedTime)}
              </span>
              <button onClick={() => goToStep(1)} className="text-amber-700 hover:underline font-medium text-xs whitespace-nowrap ml-2">
                {t('calendar.change')}
              </button>
            </div>

            <h2 className="text-xl font-serif font-bold text-gray-900 mb-5">{t('calendar.select_service')}</h2>

            <div className="space-y-3 mb-6">
              {SERVICE_CARDS.map(svc => {
                const Icon = svc.icon;
                const selected = serviceId === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setServiceId(svc.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-amber-700 ring-1 ring-amber-700 bg-amber-50/50'
                        : 'border-gray-200 hover:border-amber-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selected ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`font-semibold text-sm ${selected ? 'text-amber-700' : 'text-gray-900'}`}>
                          {t(svc.labelKey)}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">{t(svc.descKey)}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 ml-auto mt-1 flex items-center justify-center transition-all ${
                        selected ? 'border-amber-700 bg-amber-700' : 'border-gray-300'
                      }`}>
                        {selected && <CheckCircle size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goToStep(1)} className="flex-shrink-0">
                <ArrowLeft size={16} className="mr-2" />
                {t('calendar.back')}
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={!canStep2}
                onClick={() => goToStep(3)}
              >
                {t('calendar.continue')}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>

          {/* Step 3: Customer Info */}
          <div className={stepClass(3)} style={step !== 3 ? { position: 'absolute', inset: 0 } : {}}>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between mb-6 text-sm">
              <span className="text-gray-700 font-medium">
                {serviceLabel} on {formatDate(selectedDate)} at {selectedTime}
              </span>
              <button onClick={() => goToStep(2)} className="text-amber-700 hover:underline font-medium text-xs whitespace-nowrap ml-2">
                {t('calendar.change')}
              </button>
            </div>

            <h2 className="text-xl font-serif font-bold text-gray-900 mb-5">{t('calendar.your_info')}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('appointment.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('appointment.name')}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('appointment.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="061 xxx xxx"
                  type="tel"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointment.email')}</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('appointment.notes')}</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t('appointment.notes_placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              <Clock size={12} className="inline mr-1" />
              {t('calendar.call_confirm')}
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goToStep(2)} className="flex-shrink-0">
                <ArrowLeft size={16} className="mr-2" />
                {t('calendar.back')}
              </Button>
              <Button
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
                size="lg"
                disabled={!canStep3 || submitting}
                onClick={handleSubmit}
              >
                {submitting ? t('calendar.submitting') : t('calendar.confirm_appointment')}
                {!submitting && <CheckCircle size={18} className="ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
