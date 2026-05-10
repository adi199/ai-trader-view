'use client';

import React, { useEffect, useRef } from 'react';
import { ISeriesApi, LineSeries, HistogramSeries } from 'lightweight-charts';
import { useChartContext } from '../../context/ChartContext';
import { useIndicatorStore } from '../../stores/indicatorStore';
import { useMarketStore } from '../../stores/marketStore';
import { calculateRSI, calculateMACD, calculateBB, calculateSMA, calculateEMA } from '../../lib/indicators';

export const IndicatorLayer: React.FC = () => {
  const { chart } = useChartContext();
  const { activeIndicators } = useIndicatorStore();
  const { candles } = useMarketStore();
  const indicatorSeriesRef = useRef<Map<string, ISeriesApi<any>>>(new Map());

  useEffect(() => {
    if (!chart || candles.length === 0) return;

    // Clear old indicator series
    indicatorSeriesRef.current.forEach(series => chart.removeSeries(series));
    indicatorSeriesRef.current.clear();

    // Helper to add MA series
    const addMASeries = (id: string, period: number, type: 'SMA' | 'EMA', color: string) => {
      if (activeIndicators.includes(`${type}${period}` as any)) {
        const data = type === 'SMA' ? calculateSMA(candles, period) : calculateEMA(candles, period);
        const series = chart.addSeries(LineSeries, { 
          color, 
          lineWidth: 2,
          title: `${type} ${period}`,
        });
        
        const offset = candles.length - data.length;
        series.setData(data.map((v, i) => ({ time: candles[i + offset].time as any, value: v })));
        indicatorSeriesRef.current.set(`${type}${period}`, series);
      }
    };

    // SMA
    addMASeries('SMA5', 5, 'SMA', '#ffeb3b');  // Yellow
    addMASeries('SMA20', 20, 'SMA', '#ff9800'); // Orange
    addMASeries('SMA50', 50, 'SMA', '#f44336'); // Red

    // EMA
    addMASeries('EMA5', 5, 'EMA', '#4caf50');  // Green
    addMASeries('EMA20', 20, 'EMA', '#2196f3'); // Blue
    addMASeries('EMA50', 50, 'EMA', '#9c27b0'); // Purple

    if (activeIndicators.includes('BB')) {
      const bbData = calculateBB(candles);
      const upperSeries = chart.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, lineStyle: 2 });
      const lowerSeries = chart.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, lineStyle: 2 });
      const middleSeries = chart.addSeries(LineSeries, { color: '#ff9800', lineWidth: 1 });

      const offset = candles.length - bbData.length;

      upperSeries.setData(bbData.map((d, i) => ({ time: candles[i + offset].time as any, value: d.upper })));
      lowerSeries.setData(bbData.map((d, i) => ({ time: candles[i + offset].time as any, value: d.lower })));
      middleSeries.setData(bbData.map((d, i) => ({ time: candles[i + offset].time as any, value: d.middle })));

      indicatorSeriesRef.current.set('BB_upper', upperSeries);
      indicatorSeriesRef.current.set('BB_lower', lowerSeries);
      indicatorSeriesRef.current.set('BB_middle', middleSeries);
    }

    if (activeIndicators.includes('RSI')) {
        const rsiData = calculateRSI(candles);
        const rsiSeries = chart.addSeries(LineSeries, { 
            color: '#9c27b0', 
            lineWidth: 2,
            priceScaleId: 'rsi',
        });
        
        chart.priceScale('rsi').applyOptions({
            scaleMargins: { top: 0.1, bottom: 0.8 },
            visible: true,
            borderColor: '#2a2e39',
        });

        const offset = candles.length - rsiData.length;
        rsiSeries.setData(rsiData.map((v, i) => ({ time: candles[i + offset].time as any, value: v })));
        indicatorSeriesRef.current.set('RSI', rsiSeries);
    }

    if (activeIndicators.includes('MACD')) {
        const macdData = calculateMACD(candles);
        const macdSeries = chart.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, priceScaleId: 'macd' });
        const signalSeries = chart.addSeries(LineSeries, { color: '#ff5252', lineWidth: 1, priceScaleId: 'macd' });
        const histogramSeries = chart.addSeries(HistogramSeries, { priceScaleId: 'macd' });

        chart.priceScale('macd').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0.05 },
            visible: true,
            borderColor: '#2a2e39',
        });

        const offset = candles.length - macdData.length;
        macdSeries.setData(macdData.map((d, i) => ({ time: candles[i + offset].time as any, value: d.MACD || 0 })));
        signalSeries.setData(macdData.map((d, i) => ({ time: candles[i + offset].time as any, value: d.signal || 0 })));
        histogramSeries.setData(macdData.map((d, i) => ({ 
            time: candles[i + offset].time as any, 
            value: d.histogram || 0,
            color: (d.histogram || 0) >= 0 ? '#26a69a80' : '#ef535080'
        })));

        indicatorSeriesRef.current.set('MACD_line', macdSeries);
        indicatorSeriesRef.current.set('MACD_signal', signalSeries);
        indicatorSeriesRef.current.set('MACD_hist', histogramSeries);
    }
  }, [activeIndicators, candles, chart]);

  return null;
};
