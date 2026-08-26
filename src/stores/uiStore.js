import { create } from 'zustand';

/**
 * uiStore — visibility state for global overlays/modals that are not
 * tightly coupled to their own data (login, signup, logout confirm, search).
 */
export const useUiStore = create((set) => ({
  isLoginOpen: false,
  isSignupOpen: false,
  isLogoutConfirmOpen: false,
  isSearchOpen: false,

  openLogin: () => set({ isLoginOpen: true, isSignupOpen: false }),
  closeLogin: () => set({ isLoginOpen: false }),
  openSignup: () => set({ isSignupOpen: true, isLoginOpen: false }),
  closeSignup: () => set({ isSignupOpen: false }),
  openLogoutConfirm: () => set({ isLogoutConfirmOpen: true }),
  closeLogoutConfirm: () => set({ isLogoutConfirmOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
