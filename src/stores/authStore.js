import { create } from 'zustand';
import { supabase } from '../lib/supabase';

/**
 * authStore
 *
 * State:
 * @param {object|null} user - Supabase auth user [Required]
 * @param {object|null} profile - profiles table row for the current user [Required]
 * @param {boolean} initialized - whether the initial session check has completed [Required]
 * @param {string|null} lastEvent - 'signed_up' | 'signed_in' | 'signed_out' | null, used to trigger welcome/goodbye copy
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  initialized: false,
  lastEvent: null,
  lastKnownLastName: null,
  error: null,

  init: async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    set({ user, initialized: true });
    if (user) {
      await get().fetchProfile(user.id);
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      set({ user: nextUser });
      if (nextUser) {
        await get().fetchProfile(nextUser.id);
      } else {
        set({ profile: null });
      }
    });
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    set({ profile: data ?? null });
  },

  signUp: async ({
    email,
    password,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    gender,
    marketingEmail,
    marketingSms,
    address,
  }) => {
    set({ error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message });
      return { ok: false, error: error.message };
    }

    const userId = data.user?.id;
    if (userId) {
      await supabase.from('profiles').insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        phone,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        marketing_email: !!marketingEmail,
        marketing_sms: !!marketingSms,
      });

      if (address?.postalCode && address?.address) {
        await supabase.from('addresses').insert({
          user_id: userId,
          address_name: address.addressName || 'Home',
          postal_code: address.postalCode,
          address: address.address,
          detail_address: address.detailAddress || null,
          delivery_request: address.deliveryRequest || null,
          is_default: true,
        });
      }

      await get().fetchProfile(userId);
    }

    set({ user: data.user ?? null, lastEvent: 'signed_up' });
    return { ok: true };
  },

  signIn: async ({ email, password }) => {
    set({ error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message });
      return { ok: false, error: error.message };
    }
    set({ user: data.user, lastEvent: 'signed_in' });
    if (data.user) {
      await get().fetchProfile(data.user.id);
    }
    return { ok: true };
  },

  signOut: async () => {
    const lastKnownLastName = get().profile?.last_name ?? null;
    await supabase.auth.signOut();
    set({ user: null, profile: null, lastEvent: 'signed_out', lastKnownLastName });
  },

  clearLastEvent: () => set({ lastEvent: null }),
  clearError: () => set({ error: null }),
}));
