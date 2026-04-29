import { create } from 'zustand';

export type DrawingType = 'support' | 'resistance' | 'box' | 'trendline' | 'indicator';

export interface Drawing {
  id: string;
  type: DrawingType;
  color: string;
  label?: string;
  // for horizontal lines:
  price?: number;
  // for boxes:
  priceHigh?: number;
  priceLow?: number;
  timeStart?: number;
  timeEnd?: number;
  // for trendlines:
  point1?: { time: number; price: number };
  point2?: { time: number; price: number };
}

interface DrawingState {
  drawings: Drawing[];
  activeTool: 'none' | 'support' | 'resistance' | 'box' | 'trendline';
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  clearAll: () => void;
  setActiveTool: (tool: 'none' | 'support' | 'resistance' | 'box' | 'trendline') => void;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  drawings: [],
  activeTool: 'none',
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  removeDrawing: (id) => set((state) => ({ drawings: state.drawings.filter((d) => d.id !== id) })),
  clearAll: () => set({ drawings: [] }),
  setActiveTool: (activeTool) => set({ activeTool }),
}));
