import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * audioStore
 *
 * @param {boolean} enabled - global sound on/off
 * @param {number} volume - 0 to 1
 * @param {'landing'|'home'} track - which ambient track should be playing
 */
export const useAudioStore = create(
  persist(
    (set) => ({
      enabled: false,
      volume: 0.35,
      track: 'landing',

      setEnabled: (enabled) => set({ enabled }),
      toggleEnabled: () => set((state) => ({ enabled: !state.enabled })),
      setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
      setTrack: (track) => set({ track }),
    }),
    { name: 'house007-audio' },
  ),
);
