import React from 'react';

export interface TradeSummaryProps {
  symbol: string;
  companyName?: string;
  price?: number;
  change?: number;
  changePercentage?: number;
  exchange?: string;
  sector?: string;
  industry?: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  recommendation: 'buy' | 'sell' | 'hold';
  targetPrice: number;
  metrics?: {
    pe?: string;
    netMargin?: string;
    evEbitda?: string;
    fcfPerShare?: string;
    volume?: string;
    upside?: string;
  };
  reasoning: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export const TradeSummaryCard: React.FC<TradeSummaryProps> = ({
  symbol,
  companyName = "Company Inc.",
  price = 0,
  change = 0,
  changePercentage = 0,
  exchange = "NASDAQ",
  sector = "Technology",
  industry = "Consumer Electronics",
  sentiment,
  recommendation,
  targetPrice,
  metrics,
  reasoning,
  riskLevel,
}) => {
  const isPositive = change >= 0;
  const priceColorClass = isPositive ? 'text-tv-green' : 'text-tv-red';
  
  const upsideValue = metrics?.upside || '+16.5%';
  const upsideColorClass = upsideValue.startsWith('+') ? 'text-tv-green' : upsideValue.startsWith('-') ? 'text-tv-red' : 'text-tv-text-primary';

  const recClasses = {
    buy: 'bg-tv-green-muted text-tv-green',
    sell: 'bg-tv-red-muted text-tv-red',
    hold: 'bg-tv-amber-muted text-tv-amber'
  };

  const currentRecClass = recClasses[recommendation] || recClasses.hold;

  return (
    <div className="bg-tv-bg-elevated rounded-lg p-6 my-4 border border-tv-border-subtle flex flex-col gap-6 max-w-[600px]">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[24px] font-medium text-tv-text-primary m-0">{symbol}</h2>
          <span className="text-[15px] font-medium text-tv-text-secondary">{companyName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[28px] font-medium text-tv-text-primary">${price.toFixed(2)}</span>
          <span className={`text-[15px] font-medium ${priceColorClass}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercentage.toFixed(2)}%)
          </span>
          <span className="text-[12px] text-tv-text-secondary">5 min · {exchange}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-tv-bg-panel text-tv-text-secondary rounded-2xl text-[11px] font-medium border border-tv-border-subtle">
          {sector}
        </span>
        <span className="px-3 py-1 bg-tv-bg-panel text-tv-text-secondary rounded-2xl text-[11px] font-medium border border-tv-border-subtle">
          {industry}
        </span>
        <span className={`px-3 py-1 rounded-2xl text-[11px] font-medium ${currentRecClass}`}>
          {recommendation.toUpperCase()} · ${targetPrice} target
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-6 pt-4">
        {[
          { label: 'P/E (TTM)', value: metrics?.pe || '33.9×' },
          { label: 'Net margin', value: metrics?.netMargin || '27.0%' },
          { label: 'EV/EBITDA', value: metrics?.evEbitda || '26.3×' },
          { label: 'FCF/share', value: metrics?.fcfPerShare || '$8.36' },
          { label: 'Volume', value: metrics?.volume || '38.2M' },
          { label: 'Upside', value: upsideValue, colorClass: upsideColorClass },
        ].map((m, i) => (
          <div key={i}>
            <div className="text-[10px] text-tv-text-secondary font-medium uppercase tracking-wider mb-1">
              {m.label}
            </div>
            <div className={`text-[15px] font-medium ${m.colorClass || 'text-tv-text-primary'}`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
