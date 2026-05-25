import { create } from 'zustand';

interface AuthState {
  phone: string | null;
  isVerified: boolean;
  name: string;
  setPhone: (phone: string) => void;
  setVerified: (v: boolean) => void;
  setName: (name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  phone: typeof window !== 'undefined' ? localStorage.getItem('ctd_auth_phone') : null,
  isVerified: typeof window !== 'undefined' ? localStorage.getItem('ctd_auth_verified') === 'true' : false,
  name: typeof window !== 'undefined' ? localStorage.getItem('ctd_auth_name') || '' : '',
  setPhone: (phone) => {
    localStorage.setItem('ctd_auth_phone', phone);
    set({ phone });
  },
  setVerified: (v) => {
    localStorage.setItem('ctd_auth_verified', String(v));
    set({ isVerified: v });
  },
  setName: (name) => {
    localStorage.setItem('ctd_auth_name', name);
    set({ name });
  },
  logout: () => {
    localStorage.removeItem('ctd_auth_phone');
    localStorage.removeItem('ctd_auth_verified');
    localStorage.removeItem('ctd_auth_name');
    set({ phone: null, isVerified: false, name: '' });
  },
}));
