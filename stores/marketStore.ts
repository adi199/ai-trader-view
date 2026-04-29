import { create } from 'zustand';

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y';

interface MarketState {
  symbol: string;
  timeframe: Timeframe;
  companyName: string;
  exchange: string;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercentage: number;
  volume: number;
  averageVolume: number;
  weekRange: string;
  marketCap: number;
  beta: number;
  pe: number;
  ps: number;
  pfcf: number;
  evEbitda: number;
  dividendYield: number;
  grossMargin: number;
  netMargin: number;
  roe: number;
  roic: number;
  fcfPerShare: number;
  eps: number;
  priceTarget: number;
  targetHigh: number;
  targetLow: number;
  analystRating: string;
  candles: OHLCV[];
  lastUpdated: Date | null;
  isLoading: boolean;

  setMarketData: (data: Partial<MarketState>) => void;
  setSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setLoading: (loading: boolean) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  symbol: 'AAPL',
  timeframe: '1D',
  companyName: '',
  exchange: '',
  sector: '',
  industry: '',
  price: 0,
  change: 0,
  changePercentage: 0,
  volume: 0,
  averageVolume: 0,
  weekRange: '',
  marketCap: 0,
  beta: 0,
  pe: 0,
  ps: 0,
  pfcf: 0,
  evEbitda: 0,
  dividendYield: 0,
  grossMargin: 0,
  netMargin: 0,
  roe: 0,
  roic: 0,
  fcfPerShare: 0,
  eps: 0,
  priceTarget: 0,
  targetHigh: 0,
  targetLow: 0,
  analystRating: '',
  candles: [],
  lastUpdated: null,
  isLoading: false,

  setMarketData: (data) => set((state) => ({ ...state, ...data, lastUpdated: new Date() })),
  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setLoading: (isLoading) => set({ isLoading }),
}));
