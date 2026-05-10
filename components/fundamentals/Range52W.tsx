import React from 'react';

interface Range52WProps {
  low: number;
  high: number;
  current: number;
}

export const Range52W: React.FC<Range52WProps> = React.memo(({ low, high, current }) => {
  const rangePercent = high > low ? ((current - low) / (high - low)) * 100 : 0;

  return (
    <div className="flex flex-col min-w-[280px] w-full max-w-[450px]">
      <div className="flex justify-between text-[11px] text-tv-text-secondary font-semibold uppercase tracking-wider mb-2">
        <span>52W L: ${low.toFixed(0)}</span>
        <span>52W H: ${high.toFixed(0)}</span>
      </div>
      <div className="w-full h-[5px] bg-tv-bg-overlay rounded-full relative">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-tv-blue/40 rounded-l-full" 
          style={{ width: `${Math.max(0, Math.min(100, rangePercent))}%` }} 
        />
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-tv-text-primary shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-tv-bg-panel z-10 transition-all duration-500" 
          style={{ left: `calc(${Math.max(0, Math.min(100, rangePercent))}% - 7px)` }} 
        />
      </div>
    </div>
  );
});

Range52W.displayName = 'Range52W';
