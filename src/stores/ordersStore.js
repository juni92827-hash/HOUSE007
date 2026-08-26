import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * ordersStore — places orders through the `place_order` RPC and loads
 * order history + line items for MY HOUSE / delivery tracking.
 */
export const useOrdersStore = create((set) => ({
  orders: [],
  status: 'idle',
  placeError: null,

  placeOrder: async (items, address) => {
    set({ placeError: null });
    const { data, error } = await supabase.rpc('place_order', {
      p_items: items.map((i) => ({ product_id: i.productId, size: i.size, qty: i.qty })),
      p_address: address,
    });
    if (error) {
      set({ placeError: error.message });
      return { ok: false, error: error.message };
    }
    return { ok: true, order: data };
  },

  loadOrders: async (userId) => {
    if (!userId) return;
    set({ status: 'loading' });
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const orderIds = (orders ?? []).map((o) => o.id);
    let itemsByOrder = {};
    if (orderIds.length > 0) {
      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      itemsByOrder = (items ?? []).reduce((acc, item) => {
        (acc[item.order_id] ??= []).push(item);
        return acc;
      }, {});
    }

    set({
      orders: (orders ?? []).map((o) => ({ ...o, items: itemsByOrder[o.id] ?? [] })),
      status: 'loaded',
    });
  },
}));
