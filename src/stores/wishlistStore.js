import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

/**
 * wishlistStore
 *
 * Guest users: productIds are kept in localStorage only.
 * Logged-in users: productIds are read from / written to the `wishlist` table.
 */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      productIds: [],
      userId: null,

      syncWithAuth: async (user) => {
        if (!user) {
          set({ userId: null });
          return;
        }
        const localIds = get().productIds;
        const { data: existing } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id);

        const existingIds = new Set((existing ?? []).map((r) => r.product_id));
        const toUpload = localIds.filter((id) => !existingIds.has(id));
        if (toUpload.length > 0) {
          await supabase
            .from('wishlist')
            .insert(toUpload.map((product_id) => ({ user_id: user.id, product_id })));
        }

        const { data: merged } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id);

        set({ userId: user.id, productIds: (merged ?? []).map((r) => r.product_id) });
      },

      isWishlisted: (productId) => get().productIds.includes(productId),

      toggle: async (productId) => {
        const { userId, productIds } = get();
        const has = productIds.includes(productId);

        set({
          productIds: has
            ? productIds.filter((id) => id !== productId)
            : [...productIds, productId],
        });

        if (!userId) return;

        if (has) {
          await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', productId);
        } else {
          await supabase.from('wishlist').insert({ user_id: userId, product_id: productId });
        }
      },
    }),
    { name: 'house007-wishlist', partialize: (state) => ({ productIds: state.productIds }) },
  ),
);
