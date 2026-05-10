import React from 'react';
import { MetricCard } from '../MetricCard';
import { SectionHeader } from './SectionHeader';
import { Range52W } from './Range52W';

interface FundamentalsTabProps {
  market: any;
  isLoading: boolean;
  low: number;
  high: number;
}

export const FundamentalsTab: React.FC<FundamentalsTabProps> = React.memo(({ market, isLoading, low, high }) => {
  const rangePercent = high > low ? ((market.price - low) / (high - low)) * 100 : 0;
  const volRatio = market.averageVolume > 0 ? market.volume / market.averageVolume : 0;

  return (
    <>
      <SectionHeader text="Breakouts & Gaps" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12 w-full">
        <MetricCard 
          label="Dist from High" 
          value={high > 0 ? (market.price - high) / high : 0} 
          formatter="percent" 
          isLoading={isLoading} 
          trend={-1.2}
        />                                               
        <MetricCard 
          label="Dist from Low" 
          value={low > 0 ? (market.price - low) / low : 0} 
          formatter="percent" 
          isLoading={isLoading} 
          trend={4.5}
        />
        <MetricCard 
          label="Vol Ratio" 
          value={volRatio} 
          formatter="number" 
          isLoading={isLoading} 
          progressValue={Math.min(volRatio * 50, 100)} 
          progressColor="bg-tv-amber"
        />
        <MetricCard 
          label="Gap Up/Down" 
          value={market.changePercentage} 
          formatter="percent" 
          colorRule="positive" 
          isLoading={isLoading} 
        />
      </div>

      <SectionHeader text="Valuation" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12 w-full">
        <MetricCard label="P/E (TTM)" value={market.pe} formatter="number" isLoading={isLoading} />
        <MetricCard label="P/S (TTM)" value={market.ps} formatter="number" isLoading={isLoading} />
        <MetricCard label="P/FCF" value={market.pfcf} formatter="number" isLoading={isLoading} />
        <MetricCard label="EV/EBITDA" value={market.evEbitda} formatter="number" isLoading={isLoading} />
      </div>

      <SectionHeader text="Profitability" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12 w-full">
        <MetricCard label="Gross Margin" value={market.grossMargin} formatter="percent" colorRule="positive" isLoading={isLoading} progressValue={market.grossMargin ? market.grossMargin * 100 : undefined} progressColor="bg-tv-green" trend={1.2} />
        <MetricCard label="Net Margin" value={market.netMargin} formatter="percent" colorRule="positive" isLoading={isLoading} progressValue={market.netMargin ? market.netMargin * 100 : undefined} progressColor="bg-tv-green" trend={-0.5} />
      </div>

      <SectionHeader text="Returns & Efficiency" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12 w-full">
        <MetricCard label="ROE" value={market.roe} formatter="percent" colorRule="positive" isLoading={isLoading} progressValue={market.roe ? Math.min(market.roe * 100, 100) : undefined} progressColor="bg-tv-blue" trend={4.5} />
        <MetricCard label="FCF/Share" value={market.fcfPerShare || 0} formatter="currency" isLoading={isLoading} />
      </div>

      <SectionHeader text="Dividends & Yield" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 w-full lg:w-1/2">
        <MetricCard label="Dividend Yield" value={market.dividendYield} formatter="percent" isLoading={isLoading} />
        <MetricCard label="EPS (TTM)" value={market.eps || 0} formatter="currency" isLoading={isLoading} />
      </div>
    </>
  );
});

FundamentalsTab.displayName = 'FundamentalsTab';

