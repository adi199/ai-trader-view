'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { useChartContext } from '../../context/ChartContext';

export const ChartCanvas: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { setChart, setCandlestickSeries, setVolumeSeries } = useChartContext();

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

    setChart(chart);
    setCandlestickSeries(candlestickSeries);
    setVolumeSeries(volumeSeries);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth, 
          height: chartContainerRef.current.clientHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      setChart(null);
      setCandlestickSeries(null);
      setVolumeSeries(null);
    };
  }, [setChart, setCandlestickSeries, setVolumeSeries]);

  return (
    <div className="w-full h-full bg-tv-chart-bg">
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
