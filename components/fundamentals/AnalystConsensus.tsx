import React from 'react';
import { SectionHeader } from './SectionHeader';

interface AnalystConsensusProps {
  rating?: string;
  targetLow?: number;
  targetHigh?: number;
  priceTarget?: number;
  currentPrice: number;
}

export const AnalystConsensus: React.FC<AnalystConsensusProps> = React.memo(({ 
  rating, 
  targetLow, 
  targetHigh, 
  priceTarget, 
  currentPrice 
}) => {
  const upsidePercent = priceTarget ? ((priceTarget - currentPrice) / currentPrice) * 100 : 0;
  
  // Calculate relative position for the price target slider
  const range = (targetHigh || 0) - (targetLow || 0);
  const currentPos = range > 0 ? ((currentPrice - (targetLow || 0)) / range) * 100 : 0;
  const targetPos = range > 0 ? (((priceTarget || 0) - (targetLow || 0)) / range) * 100 : 0;

  return (
    <>
      <SectionHeader text="Analyst Consensus" />
      <div className="bg-tv-bg-elevated/20 border border-tv-border-subtle rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-8 mb-4">
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-bold text-tv-text-primary tracking-tight">{rating || 'Strong Buy'}</span>
            <span className="px-3 py-1 bg-tv-green/15 text-tv-green rounded-full text-[13px] font-semibold">
              Consensus
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 text-tv-amber text-[18px]">
              ★★★★<span className="opacity-30">★</span>
            </div>
            <span className="text-[14px] text-tv-text-primary font-bold ml-1">4.2 / 5</span>
          </div>
          <div className="flex gap-2 mt-1">
            <span className="px-3.5 py-1 bg-tv-green/15 text-tv-green rounded-lg text-[13px] font-semibold">Buy 28</span>
            <span className="px-3.5 py-1 bg-tv-amber/15 text-tv-amber rounded-lg text-[13px] font-semibold">Hold 7</span>
            <span className="px-3.5 py-1 bg-tv-red/15 text-tv-red rounded-lg text-[13px] font-semibold">Sell 1</span>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[13px] text-tv-text-secondary font-semibold uppercase tracking-widest">Price target range</span>
            <span className="text-[15px] font-bold text-tv-text-primary">${targetLow || 280} - ${targetHigh || 430}</span>
          </div>
          <div className="text-right mb-3">
            <span className="text-[24px] font-bold text-tv-text-primary block tracking-tight">${priceTarget || 315.91}</span>
            <span className={`text-[13px] font-semibold ${upsidePercent >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
              {priceTarget ? `${upsidePercent.toFixed(1)}% from current` : '+16.5% from current'}
            </span>
          </div>
          <div className="w-full h-[6px] bg-tv-bg-overlay rounded-full relative mb-1">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-tv-blue rounded-l-full" 
              style={{ width: `${Math.min(currentPos, 100)}%` }} 
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-tv-text-primary shadow-[0_0_8px_rgba(0,0,0,0.8)] border-2 border-tv-bg-panel z-10" 
              style={{ left: `${Math.max(0, Math.min(currentPos, 100))}%` }} 
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-tv-green shadow-[0_0_8px_rgba(34,197,94,0.8)] border-2 border-tv-bg-panel z-10" 
              style={{ left: `${Math.max(0, Math.min(targetPos, 100))}%` }} 
            />
          </div>
          <div className="flex justify-between text-[12px] text-tv-text-tertiary font-medium mt-3">
            <span>${targetLow || 280}</span>
            <span className="text-tv-text-secondary font-bold">${priceTarget || 315.91}</span>
            <span>${targetHigh || 430}</span>
          </div>
        </div>
      </div>
    </>
  );
});

AnalystConsensus.displayName = 'AnalystConsensus';
