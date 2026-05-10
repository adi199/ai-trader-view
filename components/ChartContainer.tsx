'use client';

import React from 'react';
import { ChartProvider } from '../context/ChartContext';
import { ChartCanvas } from './chart/ChartCanvas';
import { SeriesLayer } from './chart/SeriesLayer';
import { DrawingLayer } from './chart/DrawingLayer';
import { IndicatorLayer } from './chart/IndicatorLayer';

export const ChartContainer: React.FC = () => {
  return (
    <ChartProvider>
      <div className="relative w-full h-full">
        <ChartCanvas />
        <SeriesLayer />
        <DrawingLayer />
        <IndicatorLayer />
      </div>
    </ChartProvider>
  );
};
