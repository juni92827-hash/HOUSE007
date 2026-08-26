import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * cartStore
 *
 * Items:
 * @param {string} productId
 * @param {string} name
 * @param {number} price
 * @param {string} size
 * @param {number} qty
 * @param {string} image
 * @param {number} maxStock - stock available for this productId+size at time of add, used to cap quantity updates
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isMiniBagOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size,
          );
          if (existing) {
            const nextQty = Math.min(existing.qty + item.qty, item.maxStock);
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.size === item.size
                  ? { ...i, qty: nextQty, maxStock: item.maxStock }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        });
        set({ isMiniBagOpen: true });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
        }));
      },

      updateQty: (productId, size, qty) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, qty: Math.max(1, Math.min(qty, i.maxStock)) }
              : i,
          ),
        }));
      },

      clear: () => set({ items: [] }),
      openMiniBag: () => set({ isMiniBagOpen: true }),
      closeMiniBag: () => set({ isMiniBagOpen: false }),

      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    { name: 'house007-cart' },
  ),
);
