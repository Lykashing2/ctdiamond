import { create } from 'zustand';
import type { Product } from '@/lib/types';

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('ctd_wishlist') || '[]')
    : [],
  toggle: (product) => {
    const items = get().items;
    const exists = items.find((i) => i.product_id === product.product_id);
    const newItems = exists
      ? items.filter((i) => i.product_id !== product.product_id)
      : [...items, product];
    localStorage.setItem('ctd_wishlist', JSON.stringify(newItems));
    set({ items: newItems });
  },
  has: (productId) => get().items.some((i) => i.product_id === productId),
  remove: (productId) => {
    const items = get().items.filter((i) => i.product_id !== productId);
    localStorage.setItem('ctd_wishlist', JSON.stringify(items));
    set({ items });
  },
  clear: () => {
    localStorage.removeItem('ctd_wishlist');
    set({ items: [] });
  },
}));
