'use client';

import { create } from 'zustand';

interface AdminState {
  isAuthenticated: boolean;
  checking: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  checking: true,

  checkAuth: () => {
    const authed = typeof window !== 'undefined'
      ? localStorage.getItem('ctd_admin_auth') === 'true'
      : false;
    set({ isAuthenticated: authed, checking: false });
  },

  login: async (username: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ctd_admin_auth', 'true');
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('ctd_admin_auth');
    set({ isAuthenticated: false });
  },
}));
