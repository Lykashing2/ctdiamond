'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import {
  Calendar,
  Clock,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Appointment } from '@/lib/types';

type ViewMode = 'table' | 'calendar';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
const SERVICES = [
  { value: 'ALL', label: 'All' },
  { value: 'browse_collection', label: 'Browse Collection' },
  { value: 'custom_design', label: 'Custom Design' },
  { value: 'ring_sizing', label: 'Ring Sizing' },
  { value: 'general_consultation', label: 'General Consultation' },
] as const;

const statusBadgeVariant = (
  status: string
): 'success' | 'warning' | 'danger' | 'default' => {
  switch (status) {
    case 'CONFIRMED':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'danger';
    case 'COMPLETED':
      return 'default';
    default:
      return 'default';
  }
};

const statusRowClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 border-l-4 border-l-amber-400';
    case 'CONFIRMED':
      return 'bg-green-50 border-l-4 border-l-green-400';
    case 'COMPLETED':
      return 'bg-gray-50 border-l-4 border-l-gray-400';
    case 'CANCELLED':
      return 'bg-red-50 border-l-4 border-l-red-400';
    default:
      return '';
  }
};

const formatConsultationType = (type: string) => {
  const svc = SERVICES.find((s) => s.value === type);
  return svc ? svc.label : type;
};

function getWeekStartDate(base: Date): Date {
  const d = new Date(base);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminAppointmentsPage() {
  const { t } = useLanguage();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [weekOffset, setWeekOffset] = useState(0);

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });
    if (data) setAppointments(data as Appointment[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchAppointments());
  }, [fetchAppointments]);

  const clearFilters = () => {
    setStatusFilter('ALL');
    setServiceFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  const todayStr = formatDateKey(new Date());

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
      if (serviceFilter !== 'ALL' && apt.consultation_type !== serviceFilter) return false;
      if (dateFrom && apt.date < dateFrom) return false;
      if (dateTo && apt.date > dateTo) return false;
      return true;
    });
  }, [appointments, statusFilter, serviceFilter, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === 'PENDING').length;
    const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
    const today = appointments.filter((a) => a.date === todayStr).length;
    return { total, pending, confirmed, today };
  }, [appointments, todayStr]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
  };

  const weekStart = useMemo(() => {
    const base = new Date();
    const start = getWeekStartDate(base);
    if (weekOffset !== 0) start.setDate(start.getDate() + weekOffset * 7);
    return start;
  }, [weekOffset]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const calendarAppointments = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const day of weekDays) {
      map[formatDateKey(day)] = [];
    }
    for (const apt of appointments) {
      if (apt.status === 'CONFIRMED' || apt.status === 'PENDING') {
        if (map[apt.date]) {
          map[apt.date].push(apt);
        }
      }
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.time_slot.localeCompare(b.time_slot));
    }
    return map;
  }, [appointments, weekDays]);

  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">{t('admin.appointments')}</h1>
          {stats.pending > 0 && (
            <Badge variant="danger">{stats.pending} pending</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Weekly
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 mt-1">Total Appointments</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
          <p className="text-xs text-gray-500 mt-1">Confirmed</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
          <p className="text-xs text-gray-500 mt-1">Today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
          {(statusFilter !== 'ALL' || serviceFilter !== 'ALL' || dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Statuses' : s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Service</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {SERVICES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No appointments found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-3 w-10">#</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt, idx) => (
                  <tr
                    key={apt.id}
                    className={`border-b hover:bg-gray-50/80 ${statusRowClass(apt.status)}`}
                  >
                    <td className="p-3 text-gray-400 text-xs">{idx + 1}</td>
                    <td className="p-3 font-medium text-gray-900">{apt.customer_name}</td>
                    <td className="p-3 text-gray-600">{apt.customer_phone}</td>
                    <td className="p-3 text-gray-700">
                      {formatConsultationType(apt.consultation_type)}
                    </td>
                    <td className="p-3 text-gray-700">{formatDisplayDate(apt.date)}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {apt.time_slot}
                      </span>
                    </td>
                    <td className="p-3 max-w-40">
                      {apt.sizing_info ? (
                        <span
                          className="block truncate text-gray-500 cursor-help"
                          title={apt.sizing_info}
                        >
                          {apt.sizing_info}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant={statusBadgeVariant(apt.status)}>{apt.status}</Badge>
                    </td>
                    <td className="p-3">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                        className="border border-gray-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold text-gray-700">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' — '}
              {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWeekOffset((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const key = formatDateKey(day);
              const dayApts = calendarAppointments[key] || [];
              const isToday = key === todayStr;
              return (
                <div
                  key={key}
                  className={`border rounded-lg min-h-36 ${isToday ? 'border-amber-400 bg-amber-50/30' : 'border-gray-200'}`}
                >
                  <div
                    className={`text-center text-xs font-semibold py-2 border-b ${isToday ? 'bg-amber-100 text-amber-900' : 'bg-gray-50 text-gray-600'}`}
                  >
                    <div>{DAY_LABELS[day.getDay() === 0 ? 6 : day.getDay() - 1]}</div>
                    <div className="text-lg">{day.getDate()}</div>
                  </div>
                  <div className="p-1 space-y-1">
                    {dayApts.length === 0 && (
                      <p className="text-[10px] text-gray-300 text-center py-4">—</p>
                    )}
                    {dayApts.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedApt(apt)}
                        className="w-full text-left text-[10px] bg-amber-100 text-amber-900 rounded px-1.5 py-1 hover:bg-amber-200 transition-colors truncate"
                      >
                        <span className="font-semibold">{apt.time_slot}</span>{' '}
                        {apt.customer_name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Detail Popover */}
      {selectedApt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setSelectedApt(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{selectedApt.customer_name}</h3>
              <Badge variant={statusBadgeVariant(selectedApt.status)}>
                {selectedApt.status}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {selectedApt.date} at {selectedApt.time_slot}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Search className="w-4 h-4 text-gray-400" />
                {formatConsultationType(selectedApt.consultation_type)}
              </div>
              {selectedApt.sizing_info && (
                <p className="text-gray-600">
                  <span className="font-medium text-gray-700">Notes:</span>{' '}
                  {selectedApt.sizing_info}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                Phone: {selectedApt.customer_phone}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  updateStatus(selectedApt.id, 'CONFIRMED');
                  setSelectedApt(null);
                }}
                disabled={selectedApt.status === 'CONFIRMED'}
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  updateStatus(selectedApt.id, 'CANCELLED');
                  setSelectedApt(null);
                }}
                disabled={selectedApt.status === 'CANCELLED'}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
