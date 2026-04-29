import { create } from 'zustand';

export type IndicatorType = 'RSI' | 'MACD' | 'BB';

interface IndicatorState {
  activeIndicators: IndicatorType[];
  toggleIndicator: (type: IndicatorType) => void;
}

export const useIndicatorStore = create<IndicatorState>((set) => ({
  activeIndicators: [],
  toggleIndicator: (type) =>
    set((state) => ({
      activeIndicators: state.activeIndicators.includes(type)
        ? state.activeIndicators.filter((i) => i !== type)
        : [...state.activeIndicators, type],
    })),
}));
