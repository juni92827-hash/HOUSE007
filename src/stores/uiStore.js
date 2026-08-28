import { create } from 'zustand';

/**
 * uiStore — visibility state for global overlays/modals that are not
 * tightly coupled to their own data (logout confirm, search). Login and
 * signup are full pages (/login, /signup) rather than modals.
 */
export const useUiStore = create((set) => ({
  isLogoutConfirmOpen: false,
  isSearchOpen: false,

  openLogoutConfirm: () => set({ isLogoutConfirmOpen: true }),
  closeLogoutConfirm: () => set({ isLogoutConfirmOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
