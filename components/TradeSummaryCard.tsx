import React from 'react';
import { ChevronDown } from 'lucide-react';

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
  const priceColor = isPositive ? 'var(--tv-green)' : 'var(--tv-red)';
  
  const upsideValue = metrics?.upside || '+16.5%';
  const upsideColor = upsideValue.startsWith('+') ? 'var(--tv-green)' : upsideValue.startsWith('-') ? 'var(--tv-red)' : 'var(--tv-text-primary)';

  const recColors = {
    buy: { bg: 'var(--tv-green-muted)', color: 'var(--tv-green)' },
    sell: { bg: 'var(--tv-red-muted)', color: 'var(--tv-red)' },
    hold: { bg: 'var(--tv-amber-muted)', color: 'var(--tv-amber)' }
  };

  const currentRecColor = recColors[recommendation] || recColors.hold;

  return (
    <div style={{
      background: 'var(--tv-bg-elevated)',
      borderRadius: '8px',
      padding: '24px',
      margin: '16px 0',
      border: '1px solid var(--tv-border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      maxWidth: '600px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--tv-text-primary)', margin: 0 }}>{symbol}</h2>
          <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--tv-text-secondary)' }}>{companyName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', fontWeight: 500, color: 'var(--tv-text-primary)' }}>${price.toFixed(2)}</span>
          <span style={{ fontSize: '15px', fontWeight: 500, color: priceColor }}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercentage.toFixed(2)}%)
          </span>
          <span style={{ fontSize: '12px', color: 'var(--tv-text-secondary)' }}>5 min · {exchange}</span>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ padding: '4px 12px', background: 'var(--tv-bg-panel)', color: 'var(--tv-text-secondary)', borderRadius: '16px', fontSize: '11px', fontWeight: 500, border: '1px solid var(--tv-border-subtle)' }}>
          {sector}
        </span>
        <span style={{ padding: '4px 12px', background: 'var(--tv-bg-panel)', color: 'var(--tv-text-secondary)', borderRadius: '16px', fontSize: '11px', fontWeight: 500, border: '1px solid var(--tv-border-subtle)' }}>
          {industry}
        </span>
        <span style={{ padding: '4px 12px', background: currentRecColor.bg, color: currentRecColor.color, borderRadius: '16px', fontSize: '11px', fontWeight: 500 }}>
          {recommendation.toUpperCase()} · ${targetPrice} target
        </span>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 48px', paddingTop: '16px' }}>
        {[
          { label: 'P/E (TTM)', value: metrics?.pe || '33.9×' },
          { label: 'Net margin', value: metrics?.netMargin || '27.0%' },
          { label: 'EV/EBITDA', value: metrics?.evEbitda || '26.3×' },
          { label: 'FCF/share', value: metrics?.fcfPerShare || '$8.36' },
          { label: 'Volume', value: metrics?.volume || '38.2M' },
          { label: 'Upside', value: upsideValue, color: upsideColor },
        ].map((m, i) => (
          <div key={i}>
            <div style={{ fontSize: '10px', color: 'var(--tv-text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: m.color || 'var(--tv-text-primary)' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
