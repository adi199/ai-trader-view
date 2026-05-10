'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IChartApi, ISeriesApi } from 'lightweight-charts';

interface ChartContextType {
  chart: IChartApi | null;
  setChart: (chart: IChartApi | null) => void;
  candlestickSeries: ISeriesApi<'Candlestick'> | null;
  setCandlestickSeries: (series: ISeriesApi<'Candlestick'> | null) => void;
  volumeSeries: ISeriesApi<'Histogram'> | null;
  setVolumeSeries: (series: ISeriesApi<'Histogram'> | null) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<'Candlestick'> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | null>(null);

  return (
    <ChartContext.Provider value={{ 
      chart, setChart, 
      candlestickSeries, setCandlestickSeries,
      volumeSeries, setVolumeSeries
    }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChartContext must be used within a ChartProvider');
  }
  return context;
};
