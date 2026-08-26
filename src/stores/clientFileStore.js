import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CLIENT_FILE_STEPS } from '../data/clientFileSteps';

const TOTAL_STEPS = CLIENT_FILE_STEPS.length;

/**
 * clientFileStore — the AI Style / Client File questionnaire.
 */
export const useClientFileStore = create((set, get) => ({
  isOpen: false,
  isCloseConfirmOpen: false,
  step: 1,
  answers: { mission: '', presence: '', style: '', fit: '', color: '' },
  isAnalyzing: false,
  isComplete: false,

  openClientFile: () => set({ isOpen: true, isComplete: false, step: 1 }),

  requestClose: () => {
    const { answers } = get();
    const hasData = Object.values(answers).some(Boolean);
    if (hasData) {
      set({ isCloseConfirmOpen: true });
    } else {
      set({ isOpen: false });
    }
  },
  confirmClose: () => set({ isOpen: false, isCloseConfirmOpen: false }),
  cancelClose: () => set({ isCloseConfirmOpen: false }),

  selectAnswer: (value) => {
    const key = CLIENT_FILE_STEPS[get().step - 1].key;
    set((state) => ({ answers: { ...state.answers, [key]: value } }));
  },

  nextStep: () => {
    const { step } = get();
    if (step >= TOTAL_STEPS) {
      get().generateMissionProfile();
      return;
    }
    set({ step: step + 1 });
  },

  previousStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),

  generateMissionProfile: () => {
    set({ isAnalyzing: true });
    setTimeout(() => {
      set({ isAnalyzing: false, isComplete: true });
    }, 1600);
  },

  restartProfile: () =>
    set({
      step: 1,
      answers: { mission: '', presence: '', style: '', fit: '', color: '' },
      isComplete: false,
      isAnalyzing: false,
    }),

  saveClientProfile: async (userId, recommendedProductId) => {
    const { answers } = get();
    if (!userId) return { ok: false, reason: 'AUTH_REQUIRED' };
    await supabase.from('client_profiles').upsert({
      user_id: userId,
      mission: answers.mission,
      presence: answers.presence,
      style: answers.style,
      fit: answers.fit,
      color: answers.color,
      recommended_product_id: recommendedProductId,
      updated_at: new Date().toISOString(),
    });
    return { ok: true };
  },

  totalSteps: TOTAL_STEPS,
}));
