import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * productsStore — loads the full product catalog (with per-size stock) once
 * and keeps it in memory so every page/component reads the same data.
 */
export const useProductsStore = create((set, get) => ({
  products: [],
  status: 'idle',

  load: async () => {
    if (get().status === 'loaded' || get().status === 'loading') return;
    set({ status: 'loading' });

    const [{ data: products }, { data: sizes }] = await Promise.all([
      supabase.from('products').select('*').order('display_order', { ascending: true }),
      supabase.from('product_sizes').select('*'),
    ]);

    const bySizeProductId = {};
    (sizes ?? []).forEach((row) => {
      if (!bySizeProductId[row.product_id]) bySizeProductId[row.product_id] = [];
      bySizeProductId[row.product_id].push({ size: row.size, stock: row.stock });
    });

    const merged = (products ?? []).map((p) => ({
      ...p,
      sizes: (bySizeProductId[p.id] ?? []).sort((a, b) => Number(a.size) - Number(b.size)),
      totalStock: (bySizeProductId[p.id] ?? []).reduce((sum, s) => sum + s.stock, 0),
    }));

    set({ products: merged, status: 'loaded' });
  },

  refreshStock: async () => {
    const { data: sizes } = await supabase.from('product_sizes').select('*');
    const bySizeProductId = {};
    (sizes ?? []).forEach((row) => {
      if (!bySizeProductId[row.product_id]) bySizeProductId[row.product_id] = [];
      bySizeProductId[row.product_id].push({ size: row.size, stock: row.stock });
    });
    set((state) => ({
      products: state.products.map((p) => ({
        ...p,
        sizes: (bySizeProductId[p.id] ?? []).sort((a, b) => Number(a.size) - Number(b.size)),
        totalStock: (bySizeProductId[p.id] ?? []).reduce((sum, s) => sum + s.stock, 0),
      })),
    }));
  },

  getById: (id) => get().products.find((p) => p.id === id),
}));
