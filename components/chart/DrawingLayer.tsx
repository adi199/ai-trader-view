'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ISeriesApi, LineSeries, CandlestickSeries } from 'lightweight-charts';
import { useChartContext } from '../../context/ChartContext';
import { useDrawingStore } from '../../stores/drawingStore';
import { useMarketStore } from '../../stores/marketStore';

export const DrawingLayer: React.FC = () => {
  const { chart, candlestickSeries } = useChartContext();
  const { drawings, activeTool, addDrawing } = useDrawingStore();
  const { candles } = useMarketStore();
  const [drawingStartPoint, setDrawingStartPoint] = useState<{ time: number; price: number } | null>(null);
  const drawingSeriesRef = useRef<Map<string, ISeriesApi<any>>>(new Map());

  // Handle User Drawing Interaction
  useEffect(() => {
    if (!chart || activeTool === 'none') {
      setDrawingStartPoint(null);
      return;
    }

    const clickHandler = (param: any) => {
      if (!param.point || !param.time || !candlestickSeries) return;

      const price = candlestickSeries.coordinateToPrice(param.point.y);
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
  }, [activeTool, addDrawing, drawingStartPoint, chart, candlestickSeries]);

  // Render Drawings
  useEffect(() => {
    if (!chart) return;

    // Clear old drawing series
    drawingSeriesRef.current.forEach(series => chart.removeSeries(series));
    drawingSeriesRef.current.clear();

    drawings.forEach(d => {
      if (d.type === 'support' || d.type === 'resistance') {
        const series = chart.addSeries(LineSeries, {
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
        const series = chart.addSeries(CandlestickSeries, {
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
        const series = chart.addSeries(LineSeries, {
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
  }, [drawings, candles, chart]);

  return null;
};
