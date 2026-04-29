'use client';

import { LeftPanel } from '../components/LeftPanel';
import { RightPanel } from '../components/RightPanel';
import { useCopilotSync } from '../hooks/useCopilotSync';

export default function Home() {
  // Sync state and tools with CopilotKit
  useCopilotSync();

  return (
    <main style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--tv-bg-page)' }}>
      <div style={{ width: '80vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <LeftPanel />
      </div>
      <div style={{ width: '20vw', minWidth: '280px', borderLeft: '1px solid var(--tv-border-subtle)' }}>
        <RightPanel />
      </div>
    </main>
  );
}
