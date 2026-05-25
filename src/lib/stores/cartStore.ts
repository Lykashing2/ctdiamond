import { create } from 'zustand';
import type { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('ctd_cart') || '[]')
    : [],
  addItem: (product) => {
    const items = get().items;
    const exists = items.find((i) => i.product.product_id === product.product_id);
    let newItems: CartItem[];
    if (exists) {
      newItems = items.map((i) =>
        i.product.product_id === product.product_id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      newItems = [...items, { product, quantity: 1 }];
    }
    localStorage.setItem('ctd_cart', JSON.stringify(newItems));
    set({ items: newItems });
  },
  removeItem: (productId) => {
    const items = get().items.filter((i) => i.product.product_id !== productId);
    localStorage.setItem('ctd_cart', JSON.stringify(items));
    set({ items });
  },
  clearCart: () => {
    localStorage.removeItem('ctd_cart');
    set({ items: [] });
  },
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + i.product.pricing.total_selling_usd * i.quantity, 0),
}));
