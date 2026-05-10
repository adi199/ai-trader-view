'use client';

import { LeftPanel } from '../components/LeftPanel';
import { RightPanel } from '../components/RightPanel';
import { useCopilotSync } from '../hooks/useCopilotSync';

export default function Home() {
  // Sync state and tools with CopilotKit
  useCopilotSync();

  return (
    <main className="flex w-screen h-screen overflow-hidden bg-tv-bg-page">
      <div className="w-[80vw] flex flex-col overflow-hidden">
        <LeftPanel />
      </div>
      <div className="w-[20vw] min-w-[280px] border-l border-tv-border-subtle">
        <RightPanel />
      </div>
    </main>
  );
}
