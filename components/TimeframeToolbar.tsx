import React, { useState, useRef, useEffect } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { Clock, ChevronDown } from 'lucide-react';

export const TimeframeToolbar: React.FC = () => {
  const { timeframe, setTimeframe } = useMarketStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeframes = [
    { id: '1D', label: '1 Day', short: '1D' },
    { id: '1W', label: '1 Week', short: '1W' },
    { id: '1M', label: '1 Month', short: '1M' },
    { id: '3M', label: '3 Months', short: '3M' },
    { id: '1Y', label: '1 Year', short: '1Y' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTimeframe = timeframes.find(t => t.id === timeframe);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border ${
          isOpen 
            ? 'bg-tv-amber/10 border-tv-amber/30 text-tv-amber shadow-[0_0_15px_rgba(210,153,34,0.1)]' 
            : 'bg-tv-bg-elevated/50 border-tv-border-default text-tv-text-secondary hover:border-tv-border-strong hover:bg-tv-bg-elevated'
        } group`}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>
          <Clock size={16} />
        </div>
        <div className="flex flex-col items-start min-w-[50px]">
          <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
            {currentTimeframe?.short || timeframe}
          </span>
          <span className="text-[9px] font-medium opacity-70 tracking-tighter uppercase mt-0.5">
            Timeframe
          </span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} opacity-50`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full right-0 mt-2 w-40 bg-tv-bg-overlay border border-tv-border-strong rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right z-50 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-1.5 flex flex-col gap-1">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-tv-text-tertiary border-b border-tv-border-default mb-1">
            Intervals
          </div>
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => {
                setTimeframe(tf.id as any);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                timeframe === tf.id 
                  ? 'bg-tv-amber/10 text-tv-amber' 
                  : 'text-tv-text-secondary hover:bg-tv-bg-elevated hover:text-tv-text-primary'
              }`}
            >
              <span className="text-[11px] font-semibold">{tf.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
