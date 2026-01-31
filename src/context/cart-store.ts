import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem: MenuItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.menuItem.id === menuItem.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menuItem.id === menuItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { menuItem, quantity: 1 }],
          };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.menuItem.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "restaurant-cart",
    }
  )
);
