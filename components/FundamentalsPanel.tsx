import React, { useState, useMemo } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { OverviewTab } from './fundamentals/OverviewTab';
import { FundamentalsTab } from './fundamentals/FundamentalsTab';
import { AnalystConsensus } from './fundamentals/AnalystConsensus';
import { ComingSoon } from './fundamentals/ComingSoon';
import { Range52W } from './fundamentals/Range52W';

export const FundamentalsPanel: React.FC = () => {
  const market = useMarketStore();
  const isLoading = market.isLoading;
  const [activeTab, setActiveTab] = useState('Fundamentals');

  const tabs = ['Overview', 'News', 'Fundamentals', 'Technicals', 'Analyst'];

  // Memoize range calculations to avoid re-calculating on every render
  const { low, high } = useMemo(() => {
    const range = market.weekRange || '';
    const parts = range.split('-').map(p => parseFloat(p.trim().replace('$', '')));
    if (parts.length === 2) return { low: parts[0] || 0, high: parts[1] || 0 };
    return { low: 0, high: 0 };
  }, [market.weekRange]);

  // Format price change data
  const { priceChangeStr, pctChangeStr, priceColorClass } = useMemo(() => {
    const priceChange = market.price * (market.changePercentage / 100);
    return {
      priceChangeStr: priceChange >= 0 ? `+$${priceChange.toFixed(2)}` : `-$${Math.abs(priceChange).toFixed(2)}`,
      pctChangeStr: market.changePercentage >= 0 ? `(+${market.changePercentage.toFixed(2)}%)` : `(${market.changePercentage.toFixed(2)}%)`,
      priceColorClass: market.changePercentage >= 0 ? 'text-tv-green' : 'text-tv-red'
    };
  }, [market.price, market.changePercentage]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab market={market} isLoading={isLoading} low={low} high={high} />;
      case 'Fundamentals':
        return <FundamentalsTab market={market} isLoading={isLoading} low={low} high={high} />;
      case 'Analyst':
        return (
          <AnalystConsensus 
            rating={market.analystRating}
            targetLow={market.targetLow}
            targetHigh={market.targetHigh}
            priceTarget={market.priceTarget}
            currentPrice={market.price}
          />
        );
      case 'News':
        return (
          <ComingSoon 
            icon="📰" 
            title="News feed coming soon" 
            description={`We're integrating real-time sentiment analysis for ${market.symbol}`} 
          />
        );
      case 'Technicals':
        return (
          <ComingSoon 
            icon="📊" 
            title="Technical analysis coming soon" 
            description={`Advanced oscillators and moving averages for ${market.symbol}`} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-tv-bg-page">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-center px-8 border-b border-tv-border-subtle bg-tv-bg-panel sticky top-0 z-20 shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3.5 text-[14px] font-medium border-b-[3px] transition-all ${
              activeTab === tab
                ? 'text-tv-text-primary border-tv-blue bg-tv-bg-elevated/30'
                : 'text-tv-text-secondary border-transparent hover:text-tv-text-primary hover:bg-tv-bg-elevated/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-12 py-8 max-w-[1200px] w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Main Header Area */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-8 mb-10 px-1">
          {/* Price Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[38px] font-bold text-tv-text-primary tracking-tight">
                ${market.price.toFixed(2)}
              </span>
              <div className={`px-2 py-0.5 rounded flex items-center gap-1 ${market.changePercentage >= 0 ? 'bg-tv-green/10 text-tv-green' : 'bg-tv-red/10 text-tv-red'}`}>
                <span className="text-[14px] font-semibold">{priceChangeStr}</span>
              </div>
            </div>
            <div className="text-[14px] text-tv-text-secondary font-medium flex items-center gap-2">
              <span>{market.symbol}</span>
              <span>·</span>
              <span>{market.exchange || 'NASDAQ'}</span>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-tv-green animate-pulse" />
                <span>Market Open</span>
              </div>
            </div>
          </div>

          {/* Range Section (Center) */}
          <div className="hidden lg:flex justify-center w-full">
            <Range52W low={low} high={high} current={market.price} />
          </div>
          
          {/* Target Section (Right) */}
          <div className="text-left md:text-right hidden sm:block">
            <div className="text-[12px] text-tv-text-secondary font-semibold uppercase tracking-widest mb-1 opacity-70">
              Analyst price target
            </div>
            <div className="text-[30px] font-bold text-tv-text-primary mb-2">
              ${market.priceTarget || '—'}
            </div>
            <div className="inline-block px-3 py-1 bg-tv-blue/10 text-tv-blue border border-tv-blue/20 rounded-lg text-[13px] font-semibold">
              ↗ {market.priceTarget ? `${(((market.priceTarget - market.price) / market.price) * 100).toFixed(1)}% upside` : '—'}
            </div>
          </div>
        </div>

        {/* Tab Content Rendering */}
        <div className="transition-all duration-300">
          {renderTabContent()}
        </div>
        
        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[12px] text-tv-text-secondary mt-12 pt-6 border-t border-tv-border-subtle/50 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tv-green" />
            <span>Data synced with FMP Real-time</span>
          </div>
          <div className="flex gap-6">
            <span>{market.exchange || 'NASDAQ'} · USD</span>
            <span>Refreshed {market.lastUpdated?.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
