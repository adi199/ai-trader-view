import React, { useState } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { useDrawingStore } from '../stores/drawingStore';
import { useIndicatorStore, IndicatorType } from '../stores/indicatorStore';

export const TopBar: React.FC = () => {
  const { symbol, setSymbol, companyName, lastUpdated, isLoading, timeframe, setTimeframe } = useMarketStore();
  const [input, setInput] = useState(symbol);

  const { activeTool, setActiveTool, clearAll } = useDrawingStore();
  const { activeIndicators, toggleIndicator } = useIndicatorStore();

  const handleLoad = () => {
    if (input.trim()) {
      setSymbol(input.trim().toUpperCase());
    }
  };

  const getToolStyle = (id: string) => {
    if (activeTool !== id) return { background: 'transparent', color: 'var(--tv-text-secondary)' };
    if (id === 'support') return { background: 'var(--tv-green-muted)', color: 'var(--tv-green)', fontWeight: 500 };
    if (id === 'resistance') return { background: 'var(--tv-red-muted)', color: 'var(--tv-red)', fontWeight: 500 };
    return { background: 'var(--tv-blue-muted)', color: 'var(--tv-blue)', fontWeight: 500 };
  };

  const indicators: { id: IndicatorType; label: string }[] = [
    { id: 'RSI', label: 'RSI' },
    { id: 'MACD', label: 'MACD' },
    { id: 'BB', label: 'Bollinger' },
  ];

  const isStale = lastUpdated ? (new Date().getTime() - lastUpdated.getTime() > 6 * 60 * 1000) : false;

  return (
    <div style={{
      height: '48px',
      background: 'var(--tv-bg-panel)',
      borderBottom: '1px solid var(--tv-border-subtle)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      {/* LEFT - Ticker Block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
          placeholder="Search..."
          style={{
            width: '140px',
            background: 'var(--tv-bg-elevated)',
            border: '1px solid var(--tv-border-default)',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'var(--tv-text-primary)',
            padding: '0 10px',
            height: '28px',
            outline: 'none'
          }}
        />
        <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--tv-text-primary)' }}>
          {companyName || symbol}
        </span>
        <span style={{
          fontSize: '11px',
          color: 'var(--tv-text-secondary)',
          background: 'var(--tv-bg-elevated)',
          borderRadius: '4px',
          padding: '1px 6px'
        }}>
          NASDAQ
        </span>
      </div>

      {/* CENTER - Drawing & Indicator Toolbar */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Drawing Tools */}
        <div style={{
          background: 'var(--tv-bg-elevated)',
          borderRadius: '8px',
          border: '1px solid var(--tv-border-default)',
          padding: '3px',
          display: 'flex',
          gap: '2px',
          alignItems: 'center'
        }}>
          {['support', 'resistance', 'box', 'trendline'].map(id => (
            <button
              key={id}
              onClick={() => setActiveTool(activeTool === id ? 'none' : id as any)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
                ...getToolStyle(id)
              }}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
          <div style={{ borderLeft: '1px solid var(--tv-border-default)', height: '18px', margin: '0 4px' }} />
          <button
            onClick={clearAll}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--tv-red)',
              background: 'transparent',
              transition: 'background 120ms ease, color 120ms ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--tv-red-muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Clear
          </button>
        </div>

        {/* Indicators */}
        <div style={{
          background: 'var(--tv-bg-elevated)',
          borderRadius: '8px',
          border: '1px solid var(--tv-border-default)',
          padding: '3px',
          display: 'flex',
          gap: '2px'
        }}>
          {indicators.map(ind => (
            <button
              key={ind.id}
              onClick={() => toggleIndicator(ind.id)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
                ...(activeIndicators.includes(ind.id) 
                  ? { background: 'var(--tv-blue-muted)', color: 'var(--tv-blue)', fontWeight: 500 }
                  : { background: 'transparent', color: 'var(--tv-text-secondary)' })
              }}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Timeframe */}
        <div style={{
          background: 'var(--tv-bg-elevated)',
          borderRadius: '8px',
          border: '1px solid var(--tv-border-default)',
          padding: '3px',
          display: 'flex',
          gap: '2px'
        }}>
          {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
                ...(timeframe === tf 
                  ? { background: 'var(--tv-blue-muted)', color: 'var(--tv-blue)', fontWeight: 500 }
                  : { background: 'transparent', color: 'var(--tv-text-secondary)' })
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT - Status Block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          fontSize: '11px',
          color: isStale ? 'var(--tv-amber)' : 'var(--tv-green)',
          background: isStale ? 'var(--tv-amber-muted)' : 'var(--tv-green-muted)',
          borderRadius: '20px',
          padding: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isStale ? 'var(--tv-amber)' : 'var(--tv-green)',
            animation: isLoading ? 'pulse 2s ease-in-out infinite' : 'none'
          }} />
          {isStale ? 'Stale' : 'Live'}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--tv-text-secondary)' }}>
          Auto · {timeframe}
        </span>
        <div style={{
          fontSize: '11px',
          color: 'var(--tv-blue)',
          background: 'var(--tv-blue-muted)',
          borderRadius: '4px',
          padding: '1px 7px'
        }}>
          Next: 4:32
        </div>
        <div style={{ width: '1px', height: '16px', background: 'var(--tv-border-default)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--tv-text-tertiary)', lineHeight: 1 }}>LAST UPDATED</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--tv-text-primary)', lineHeight: 1.2 }}>
            {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};
