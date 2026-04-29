import React from 'react';
import { useIndicatorStore, IndicatorType } from '../stores/indicatorStore';

export const IndicatorToolbar: React.FC = () => {
  const { activeIndicators, toggleIndicator } = useIndicatorStore();

  const indicators: { id: IndicatorType; label: string }[] = [
    { id: 'RSI', label: 'RSI (14)' },
    { id: 'MACD', label: 'MACD' },
    { id: 'BB', label: 'Bollinger' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#1e222d]/80 backdrop-blur-md border border-[#363a45] rounded-xl shadow-2xl shrink-0 transition-all hover:bg-[#1e222d]">
      {indicators.map((ind) => (
        <button
          key={ind.id}
          onClick={() => toggleIndicator(ind.id)}
          className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
            activeIndicators.includes(ind.id)
              ? 'bg-[#2962ff] text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:bg-[#2a2e39] hover:text-slate-200'
          }`}
        >
          {ind.label}
        </button>
      ))}
    </div>
  );
};
