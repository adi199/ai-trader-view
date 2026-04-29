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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: 'var(--tv-bg-page)' }}>
      <TopBar />
      <div style={{ height: 'calc(100vh - 48px - 200px)', width: '100%', overflow: 'hidden' }}>
        <ChartContainer />
      </div>
      <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
        <FundamentalsPanel />
      </div>
    </div>
  );
};
