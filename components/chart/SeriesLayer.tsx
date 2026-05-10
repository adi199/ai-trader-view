'use client';

import React, { useEffect } from 'react';
import { useMarketStore } from '../../stores/marketStore';
import { useChartContext } from '../../context/ChartContext';

export const SeriesLayer: React.FC = () => {
  const { chart, candlestickSeries, volumeSeries } = useChartContext();
  const { candles } = useMarketStore();

  useEffect(() => {
    if (!candlestickSeries || !volumeSeries || candles.length === 0) return;

    const candleData = candles.map(c => ({
      time: c.time as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumeData = candles.map(c => ({
      time: c.time as any,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)',
    }));

    candlestickSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    chart?.timeScale().fitContent();
  }, [candles, chart, candlestickSeries, volumeSeries]);

  return null;
};
