import { create } from 'zustand';

type Currency = 'USD' | 'KHR';

interface CurrencyState {
  currency: Currency;
  rate: number;
  toggle: () => void;
  format: (amountUsd: number) => string;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: typeof window !== 'undefined'
    ? (localStorage.getItem('ctd_currency') as Currency) || 'USD'
    : 'USD',
  rate: 4100,
  toggle: () => {
    const next = get().currency === 'USD' ? 'KHR' : 'USD';
    localStorage.setItem('ctd_currency', next);
    set({ currency: next });
  },
  format: (amountUsd) => {
    const { currency, rate } = get();
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amountUsd);
    }
    const khr = Math.round(amountUsd * rate);
    return `៛ ${khr.toLocaleString('en-US')}`;
  },
}));
