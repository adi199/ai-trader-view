'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { useMarketStore } from '../stores/marketStore';
import { useDrawingStore } from '../stores/drawingStore';
import { useIndicatorStore } from '../stores/indicatorStore';
import { calculateRSI, calculateMACD, calculateBB } from '../lib/indicators';

export const ChartContainer: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  
  const { candles, symbol } = useMarketStore();
  const { drawings, activeTool, addDrawing, clearAll } = useDrawingStore();
  const { activeIndicators } = useIndicatorStore();

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0d1117' },
        textColor: '#8b949e',
      },
      grid: {
        vertLines: { color: '#1c2128' },
        horzLines: { color: '#1c2128' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#484f58' },
        horzLine: { color: '#484f58' },
      },
      rightPriceScale: {
        borderColor: '#21262d',
      },
      timeScale: {
        borderColor: '#21262d',
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // set as overlay
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update Data
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || candles.length === 0) return;

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

    candlestickSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);

    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  const [drawingStartPoint, setDrawingStartPoint] = useState<{ time: number; price: number } | null>(null);

  // Handle User Drawing Interaction
  useEffect(() => {
    if (!chartRef.current || activeTool === 'none') {
      setDrawingStartPoint(null);
      return;
    }

    const chart = chartRef.current;
    
    const clickHandler = (param: any) => {
      if (!param.point || !param.time) return;

      const price = candlestickSeriesRef.current?.coordinateToPrice(param.point.y);
      if (price === null || price === undefined) return;
      const time = param.time as number;

      if (activeTool === 'support' || activeTool === 'resistance') {
        addDrawing({
          id: Math.random().toString(36).substr(2, 9),
          type: activeTool,
          price: price,
          color: activeTool === 'support' ? '#26a69a' : '#ef5350',
          label: activeTool.charAt(0).toUpperCase() + activeTool.slice(1),
        });
      } else if (activeTool === 'box' || activeTool === 'trendline') {
        if (!drawingStartPoint) {
          setDrawingStartPoint({ time, price });
        } else {
          if (activeTool === 'box') {
            addDrawing({
              id: Math.random().toString(36).substr(2, 9),
              type: 'box',
              color: 'var(--tv-box)',
              priceHigh: Math.max(drawingStartPoint.price, price),
              priceLow: Math.min(drawingStartPoint.price, price),
              timeStart: Math.min(drawingStartPoint.time, time),
              timeEnd: Math.max(drawingStartPoint.time, time),
              label: 'Box',
            });
          } else if (activeTool === 'trendline') {
            addDrawing({
              id: Math.random().toString(36).substr(2, 9),
              type: 'trendline',
              color: 'var(--tv-trendline)',
              point1: drawingStartPoint,
              point2: { time, price },
              label: 'Trendline',
            });
          }
          setDrawingStartPoint(null);
        }
      }
    };

    chart.subscribeClick(clickHandler);
    return () => chart.unsubscribeClick(clickHandler);
  }, [activeTool, addDrawing, drawingStartPoint]);

  // Render Drawings
  const drawingSeriesRef = useRef<Map<string, ISeriesApi<any>>>(new Map());

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear old drawing series
    drawingSeriesRef.current.forEach(series => chartRef.current?.removeSeries(series));
    drawingSeriesRef.current.clear();

    drawings.forEach(d => {
      if (d.type === 'support' || d.type === 'resistance') {
        const series = chartRef.current?.addSeries(LineSeries, {
          color: d.color,
          lineWidth: 2,
          lineStyle: 2, // Dashed
          title: d.label,
          priceLineVisible: false,
          baseLineVisible: false,
          crosshairMarkerVisible: false,
          autoscaleInfoProvider: () => null,
        });

        if (series && d.price !== undefined && candles.length > 0) {
          const data = candles.map(c => ({ time: c.time as any, value: d.price! }));
          series.setData(data);
          drawingSeriesRef.current.set(d.id, series);
        }
      } else if (d.type === 'box') {
        const series = chartRef.current?.addSeries(CandlestickSeries, {
          upColor: d.color,
          downColor: d.color,
          borderUpColor: 'var(--tv-box-border)',
          borderDownColor: 'var(--tv-box-border)',
          wickUpColor: 'transparent',
          wickDownColor: 'transparent',
          priceLineVisible: false,
          baseLineVisible: false,
          lastValueVisible: false,
        });

        if (series && d.timeStart !== undefined && d.timeEnd !== undefined && d.priceHigh !== undefined && d.priceLow !== undefined) {
          const boxData = candles
            .filter(c => (c.time as number) >= d.timeStart! && (c.time as number) <= d.timeEnd!)
            .map(c => ({
              time: c.time as any,
              open: d.priceLow!,
              high: d.priceHigh!,
              low: d.priceLow!,
              close: d.priceHigh!
            }));
          if (boxData.length > 0) {
            series.setData(boxData);
            drawingSeriesRef.current.set(d.id, series);
          }
        }
      } else if (d.type === 'trendline') {
        const series = chartRef.current?.addSeries(LineSeries, {
          color: d.color,
          lineWidth: 2,
          priceLineVisible: false,
          baseLineVisible: false,
          crosshairMarkerVisible: false,
          lastValueVisible: false,
        });

        if (series && d.point1 && d.point2) {
          const t1 = Math.min(d.point1.time, d.point2.time);
          const t2 = Math.max(d.point1.time, d.point2.time);
          const p1 = d.point1.time === t1 ? d.point1.price : d.point2.price;
          const p2 = d.point2.time === t2 ? d.point2.price : d.point1.price;
          
          series.setData([
            { time: t1 as any, value: p1 },
            { time: t2 as any, value: p2 }
          ]);
          drawingSeriesRef.current.set(d.id, series);
        }
      }
    });
  }, [drawings, candles]);

  // Render Indicators
  const indicatorSeriesRef = useRef<Map<string, ISeriesApi<any>>>(new Map());

  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current || candles.length === 0) return;

    // Clear old indicator series
    indicatorSeriesRef.current.forEach(series => chartRef.current?.removeSeries(series));
    indicatorSeriesRef.current.clear();

    if (activeIndicators.includes('BB')) {
      const bbData = calculateBB(candles);
      const upperSeries = chartRef.current.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, lineStyle: 2 });
      const lowerSeries = chartRef.current.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, lineStyle: 2 });
      const middleSeries = chartRef.current.addSeries(LineSeries, { color: '#ff9800', lineWidth: 1 });

      const period = 20; // Default BB period
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
        const rsiSeries = chartRef.current.addSeries(LineSeries, { 
            color: '#9c27b0', 
            lineWidth: 2,
            priceScaleId: 'rsi',
        });
        
        chartRef.current.priceScale('rsi').applyOptions({
            scaleMargins: { top: 0.1, bottom: 0.8 },
            visible: true,
            borderColor: '#2a2e39',
        });

        const period = 14;
        const offset = candles.length - rsiData.length;
        rsiSeries.setData(rsiData.map((v, i) => ({ time: candles[i + offset].time as any, value: v })));
        indicatorSeriesRef.current.set('RSI', rsiSeries);
    }

    if (activeIndicators.includes('MACD')) {
        const macdData = calculateMACD(candles);
        const macdSeries = chartRef.current.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, priceScaleId: 'macd' });
        const signalSeries = chartRef.current.addSeries(LineSeries, { color: '#ff5252', lineWidth: 1, priceScaleId: 'macd' });
        const histogramSeries = chartRef.current.addSeries(HistogramSeries, { priceScaleId: 'macd' });

        chartRef.current.priceScale('macd').applyOptions({
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
  }, [activeIndicators, candles]);

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--tv-chart-bg)' }}>
      <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
