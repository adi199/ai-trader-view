import React from 'react';
import { MetricCard } from '../MetricCard';
import { SectionHeader } from './SectionHeader';
import { Range52W } from './Range52W';
import { AnalystConsensus } from './AnalystConsensus';

interface OverviewTabProps {
  market: any;
  isLoading: boolean;
  low: number;
  high: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = React.memo(({ market, isLoading, low, high }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div>
          <SectionHeader text="Key Metrics" />
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Market Cap" value={market.marketCap} formatter="number" isLoading={isLoading} />
            <MetricCard label="P/E Ratio" value={market.pe} formatter="number" isLoading={isLoading} />
            <MetricCard label="ROE" value={market.roe} formatter="percent" isLoading={isLoading} />
            <MetricCard label="Beta" value={market.beta} formatter="number" isLoading={isLoading} />
          </div>
        </div>
        <div>
          <AnalystConsensus 
            rating={market.analystRating}
            targetLow={market.targetLow}
            targetHigh={market.targetHigh}
            priceTarget={market.priceTarget}
            currentPrice={market.price}
          />
        </div>
      </div>
    </>
  );
});

OverviewTab.displayName = 'OverviewTab';
