import React, { useState } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { useDrawingStore } from '../stores/drawingStore';
import { useIndicatorStore, IndicatorType } from '../stores/indicatorStore';
import { Search } from 'lucide-react';
import { DrawingToolbar } from './DrawingToolbar';
import { IndicatorToolbar } from './IndicatorToolbar';
import { TimeframeToolbar } from './TimeframeToolbar';

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



  const isStale = lastUpdated ? (new Date().getTime() - lastUpdated.getTime() > 6 * 60 * 1000) : false;


  return (
    <div className="h-auto min-h-[64px] py-3 bg-tv-bg-panel border-b border-tv-border-subtle px-4 flex flex-wrap items-center justify-between shrink-0 gap-y-4">
      {/* LEFT - Ticker Block */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-text-tertiary group-focus-within:text-tv-blue transition-colors" size={14} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
            placeholder="Search symbol..."
            className="w-[180px] bg-tv-bg-elevated/50 border border-tv-border-default rounded-xl text-[13px] text-tv-text-primary pl-9 pr-3 h-10 outline-none focus:border-tv-blue/50 focus:bg-tv-bg-elevated focus:ring-4 focus:ring-tv-blue/10 transition-all placeholder:text-tv-text-tertiary"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-black text-tv-text-primary tracking-tight leading-none">
              {symbol}
            </span>
            <span className="text-[10px] font-bold text-tv-blue bg-tv-blue/10 border border-tv-blue/20 rounded-md px-1.5 py-0.5 uppercase tracking-tighter">
              NASDAQ
            </span>
          </div>
          <span className="text-[11px] font-medium text-tv-text-secondary mt-0.5 truncate max-w-[200px]">
            {companyName || 'Search a ticker...'}
          </span>
        </div>
      </div>

      {/* CENTER - Drawing & Indicator Toolbar */}
      <div className="flex flex-wrap items-end gap-6">
        {/* Drawing Tools Group */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-tv-text-secondary uppercase font-semibold tracking-wider px-1">Drawing Tools</span>
          <DrawingToolbar />
        </div>

        <div className="w-[1px] h-8 bg-tv-border-default self-end mb-0.5" />

        {/* Indicators Group */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-tv-text-secondary uppercase font-semibold tracking-wider px-1">Indicators</span>
          <IndicatorToolbar />
        </div>
      </div>

      {/* RIGHT - Timeframe & Status Block */}
      <div className="flex items-center gap-5">
        {/* Timeframe Group */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-tv-text-secondary uppercase font-semibold tracking-wider px-1">Timeframe</span>
          <TimeframeToolbar />
        </div>

        <div className="w-[1px] h-8 bg-tv-border-default self-end mb-0.5" />

        <div className="flex items-center gap-3 self-end mb-1">
          <div className={`text-[11px] rounded-[20px] px-2 py-0.5 flex items-center gap-1 ${
            isStale ? 'text-tv-amber bg-tv-amber-muted' : 'text-tv-green bg-tv-green-muted'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isStale ? 'bg-tv-amber' : 'bg-tv-green'
            } ${isLoading ? 'animate-pulse' : ''}`} />
            {isStale ? 'Stale' : 'Live'}
          </div>
          <span className="text-[11px] text-tv-text-secondary">
            Auto
          </span>
          <div className="text-[11px] text-tv-blue bg-tv-blue-muted rounded px-1.5 py-0.5">
            Next: 4:32
          </div>
          <div className="w-[1px] h-4 bg-tv-border-default" />
          <div className="flex flex-col">
            <span className="text-[10px] text-tv-text-tertiary leading-none">LAST UPDATED</span>
            <span className="text-[14px] font-medium text-tv-text-primary leading-[1.2]">
              {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
