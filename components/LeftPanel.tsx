'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { TopBar } from './TopBar';
import { FundamentalsPanel } from './FundamentalsPanel';
import { useFMPData } from '../hooks/useFMPData';

// ChartContainer uses browser APIs like window and ref.current which are not available on the server
const ChartContainer = dynamic(() => import('./ChartContainer').then(mod => mod.ChartContainer), { 
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-[#131722] flex items-center justify-center">
      <div className="w-full h-full animate-pulse bg-[#1e222d]" />
    </div>
  )
});

export const LeftPanel: React.FC = () => {
  useFMPData();

  return (
    <div className="flex flex-col h-full w-full bg-tv-bg-page">
      <TopBar />
      <div className="h-[calc(100vh-48px-400px)] w-full overflow-hidden">
        <ChartContainer />
      </div>
      <div className="h-[400px] w-full overflow-y-auto custom-scrollbar border-t border-tv-border-subtle bg-tv-bg-page">
        <FundamentalsPanel />
      </div>
    </div>
  );
};
