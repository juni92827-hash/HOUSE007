import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * addressesStore — the ADDRESS BOOK under MY HOUSE.
 */
export const useAddressesStore = create((set, get) => ({
  addresses: [],
  status: 'idle',

  loadAddresses: async (userId) => {
    if (!userId) return;
    set({ status: 'loading' });
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    set({ addresses: data ?? [], status: 'loaded' });
  },

  addAddress: async (userId, address) => {
    const { data } = await supabase
      .from('addresses')
      .insert({ user_id: userId, ...address })
      .select()
      .single();
    if (data) set({ addresses: [...get().addresses, data] });
    return data;
  },

  removeAddress: async (id) => {
    await supabase.from('addresses').delete().eq('id', id);
    set({ addresses: get().addresses.filter((a) => a.id !== id) });
  },
}));
