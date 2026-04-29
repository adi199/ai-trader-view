import React from 'react';
import { useMarketStore } from '../stores/marketStore';
import { MetricCard } from './MetricCard';

export const FundamentalsPanel: React.FC = () => {
  const market = useMarketStore();
  const isLoading = market.isLoading;

  const parseWeekRange = (range: string) => {
    const parts = range.split('-').map(p => parseFloat(p.trim().replace('$', '')));
    if (parts.length === 2) return { low: parts[0] || 0, high: parts[1] || 0 };
    return { low: 0, high: 0 };
  };

  const { low, high } = parseWeekRange(market.weekRange);
  const rangePercent = high > low ? ((market.price - low) / (high - low)) * 100 : 0;
  
  // Format price change
  const priceChange = market.price * (market.changePercentage / 100);
  const priceChangeStr = priceChange >= 0 ? `+$${priceChange.toFixed(2)}` : `-$${Math.abs(priceChange).toFixed(2)}`;
  const pctChangeStr = market.changePercentage >= 0 ? `(+${market.changePercentage.toFixed(2)}%)` : `(${market.changePercentage.toFixed(2)}%)`;
  const priceColor = market.changePercentage >= 0 ? 'var(--tv-green)' : 'var(--tv-red)';

  const SectionLabel = ({ text, color }: { text: string, color: string }) => (
    <div style={{ fontSize: '11px', fontWeight: 500, color, marginBottom: '12px' }}>
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </div>
  );

  const Divider = () => (
    <div style={{ width: '1px', height: '100%', background: 'var(--tv-border-subtle)', margin: '0 8px' }} />
  );

  return (
    <div style={{
      height: '200px',
      background: 'var(--tv-bg-panel)',
      borderTop: '1px solid var(--tv-border-subtle)',
      padding: '12px 16px',
      overflow: 'hidden',
      display: 'flex',
      gap: '16px'
    }}>
      {/* Section 1: Price & volume */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <SectionLabel text="price & volume" color="var(--tv-green)" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
          {isLoading ? (
            <div style={{ width: '80px', height: '28px', background: 'var(--tv-bg-overlay)', borderRadius: '4px' }} className="animate-shimmer" />
          ) : (
            <span className="value-flash" style={{ fontSize: '28px', fontWeight: 500, color: 'var(--tv-text-primary)' }}>
              ${market.price.toFixed(2)}
            </span>
          )}
          {isLoading ? (
            <div style={{ width: '60px', height: '13px', background: 'var(--tv-bg-overlay)', borderRadius: '3px' }} className="animate-shimmer" />
          ) : (
            <span className="value-flash" style={{ fontSize: '13px', color: priceColor }}>
              {priceChangeStr} {pctChangeStr}
            </span>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <MetricCard label="Volume" value={market.volume} formatter="number" isLoading={isLoading} />
          <MetricCard label="Avg Volume" value={market.volume} formatter="number" isLoading={isLoading} />
          <MetricCard label="Market Cap" value={market.marketCap} formatter="number" isLoading={isLoading} />
          <MetricCard label="Beta" value={market.beta} formatter="number" isLoading={isLoading} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--tv-text-secondary)', whiteSpace: 'nowrap' }}>52w</span>
          <span style={{ fontSize: '11px', color: 'var(--tv-text-secondary)', whiteSpace: 'nowrap' }}>${low.toFixed(0)}</span>
          <div style={{ flex: 1, height: '3px', background: 'var(--tv-border-subtle)', borderRadius: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(100, rangePercent))}%`, background: 'var(--tv-blue)', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', left: `calc(${Math.max(0, Math.min(100, rangePercent))}% - 4px)`, top: '-2.5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--tv-text-primary)', border: '2px solid var(--tv-bg-panel)' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--tv-text-secondary)', whiteSpace: 'nowrap' }}>${high.toFixed(0)}</span>
        </div>
      </div>

      <Divider />

      {/* Section 2: Valuation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <SectionLabel text="valuation" color="var(--tv-blue)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: '12px 8px', flex: 1 }}>
          <MetricCard label="P/E (TTM)" value={market.pe} formatter="number" isLoading={isLoading} />
          <MetricCard label="P/S (TTM)" value={market.ps} formatter="number" isLoading={isLoading} />
          <MetricCard label="P/FCF" value={market.pfcf} formatter="number" isLoading={isLoading} />
          <MetricCard label="EV/EBITDA" value={market.evEbitda} formatter="number" isLoading={isLoading} />
          <MetricCard label="Div yield" value={market.dividendYield} formatter="percent" isLoading={isLoading} />
          <MetricCard label="EPS TTM" value={0} formatter="currency" isLoading={isLoading} />
        </div>
      </div>

      <Divider />

      {/* Section 3: Profitability */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <SectionLabel text="profitability" color="var(--tv-amber)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: '12px 8px', flex: 1 }}>
          <MetricCard label="Gross margin" value={market.grossMargin} formatter="percent" colorRule="margin" isLoading={isLoading} />
          <MetricCard label="Net margin" value={market.netMargin} formatter="percent" colorRule="margin" isLoading={isLoading} />
          <MetricCard label="Op margin" value={0} formatter="percent" colorRule="margin" isLoading={isLoading} />
          <MetricCard label="ROE" value={market.roe} formatter="percent" colorRule="margin" isLoading={isLoading} />
          <MetricCard label="ROIC" value={0} formatter="percent" colorRule="margin" isLoading={isLoading} />
          <MetricCard label="FCF/share" value={0} formatter="currency" colorRule="none" isLoading={isLoading} />
        </div>
      </div>

      <Divider />

      {/* Section 4: Analyst consensus */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <SectionLabel text="analyst consensus" color="var(--tv-purple)" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--tv-green)' }}>
            Strong Buy
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--tv-text-primary)' }}>$315.91</span>
              <span style={{ fontSize: '13px', color: 'var(--tv-green)' }}>+16.5%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--tv-text-secondary)' }}>$239</span>
              <div style={{ flex: 1, height: '3px', background: 'var(--tv-border-subtle)', borderRadius: '2px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '60%', top: '-2.5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--tv-purple)' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--tv-text-secondary)' }}>$350</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
