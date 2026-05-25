import { create } from 'zustand';
import type { Product, GoldRate } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

interface ProductState {
  products: Product[];
  goldRates: GoldRate[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchGoldRates: () => Promise<void>;
  subscribeToProducts: () => () => void;
  subscribeToGoldRates: () => () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  goldRates: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ products: (data as Product[]) || [], loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchGoldRates: async () => {
    try {
      const { data, error } = await supabase
        .from('gold_rates')
        .select('*')
        .order('purity_type_en');
      if (error) throw error;
      set({ goldRates: (data as GoldRate[]) || [] });
    } catch (e) {
      console.error('Failed to fetch gold rates:', e);
    }
  },

  subscribeToProducts: () => {
    const channel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          get().fetchProducts();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },

  subscribeToGoldRates: () => {
    const channel = supabase
      .channel('gold_rates_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gold_rates' },
        () => {
          get().fetchGoldRates();
          get().fetchProducts();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  },
}));
