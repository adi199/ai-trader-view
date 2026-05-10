import React, { useState, useRef, useEffect } from 'react';
import { useIndicatorStore, IndicatorType } from '../stores/indicatorStore';
import { Activity, BarChart2, Waves, ChevronDown, Layers } from 'lucide-react';

export const IndicatorToolbar: React.FC = () => {
  const { activeIndicators, toggleIndicator } = useIndicatorStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const indicators: { id: IndicatorType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'RSI', label: 'RSI (14)', icon: <Activity size={16} />, color: 'text-tv-purple' },
    { id: 'MACD', label: 'MACD', icon: <BarChart2 size={16} />, color: 'text-tv-amber' },
    { id: 'BB', label: 'Bollinger', icon: <Waves size={16} />, color: 'text-tv-blue' },
    { id: 'SMA5', label: 'SMA 5', icon: <Activity size={16} />, color: 'text-tv-yellow' },
    { id: 'SMA20', label: 'SMA 20', icon: <Activity size={16} />, color: 'text-tv-orange' },
    { id: 'SMA50', label: 'SMA 50', icon: <Activity size={16} />, color: 'text-tv-red' },
    { id: 'EMA5', label: 'EMA 5', icon: <Activity size={16} />, color: 'text-tv-green' },
    { id: 'EMA20', label: 'EMA 20', icon: <Activity size={16} />, color: 'text-tv-blue' },
    { id: 'EMA50', label: 'EMA 50', icon: <Activity size={16} />, color: 'text-tv-purple' },
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

  const activeCount = activeIndicators.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border ${
          isOpen || activeCount > 0 
            ? 'bg-tv-purple/10 border-tv-purple/30 text-tv-purple shadow-[0_0_15px_rgba(163,113,247,0.1)]' 
            : 'bg-tv-bg-elevated/50 border-tv-border-default text-tv-text-secondary hover:border-tv-border-strong hover:bg-tv-bg-elevated'
        } group`}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>
          <Layers size={16} />
        </div>
        <div className="flex flex-col items-start min-w-[70px]">
          <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Indicators</span>
          {activeCount > 0 && (
            <span className="text-[9px] font-medium opacity-70 tracking-tighter uppercase mt-0.5">
              {activeCount} active
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} opacity-50`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 mt-2 w-52 bg-tv-bg-overlay border border-tv-border-strong rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-left z-50 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-1.5 flex flex-col gap-1">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-tv-text-tertiary border-b border-tv-border-default mb-1">
            Technical Indicators
          </div>
          {indicators.map((ind) => {
            const isActive = activeIndicators.includes(ind.id);
            return (
              <button
                key={ind.id}
                onClick={() => toggleIndicator(ind.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-tv-purple/10 text-tv-purple' 
                    : 'text-tv-text-secondary hover:bg-tv-bg-elevated hover:text-tv-text-primary'
                }`}
              >
                <span className={isActive ? 'text-tv-purple' : ind.color}>{ind.icon}</span>
                <span className="text-[11px] font-semibold">{ind.label}</span>
                <div className={`ml-auto w-4 h-4 rounded-md border transition-all flex items-center justify-center ${
                  isActive ? 'bg-tv-purple border-tv-purple' : 'border-tv-border-default'
                }`}>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
