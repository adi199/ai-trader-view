'use client';

import React from 'react';
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export const RightPanel: React.FC = () => {
  return (
    <div className="w-full h-full bg-tv-bg-panel flex flex-col">
      <div className="p-3 px-4 border-b border-tv-border-subtle flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-tv-purple" />
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-tv-text-primary leading-none">
            AI Traderview
          </span>
          <span className="text-[11px] text-tv-text-secondary mt-0.5">
            Ask me to draw levels or analyze
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <CopilotChat
          className="h-full"
          instructions="You are an expert financial analyst. You can help users analyze charts, draw support/resistance lines, and provide fundamental insights. Use the tools provided to interact with the chart. When providing a final analysis or recommendation, use the 'generate_trade_summary' tool to present a professional report card to the user."
          labels={{
            title: "AI Trade Assistant",
            initial: "Hello! I can help you analyze the current stock. Ask me for a trade summary or to draw support/resistance lines.",
            placeholder: "Ask about this stock..."
          }}
        />
      </div>

      <style jsx global>{`
        .copilotKitChat {
          --copilot-kit-background-color: var(--tv-bg-panel) !important;
          --copilot-kit-secondary-color: var(--tv-bg-elevated) !important;
          --copilot-kit-separator-color: var(--tv-border-subtle) !important;
          --copilot-kit-primary-color: var(--tv-blue) !important;
          --copilot-kit-contrast-color: var(--tv-text-primary) !important;
          --copilot-kit-muted-color: var(--tv-text-secondary) !important;
          --copilot-kit-font-family: 'Inter', system-ui !important;
          --copilot-kit-font-size: 13px !important;
          --copilot-kit-response-button-color: var(--tv-blue) !important;
          --copilot-kit-response-button-background-color: var(--tv-blue-muted) !important;
          height: 100% !important;
          border: none !important;
        }
        
        .copilotKitChat .copilotKitChatHeader {
          display: none !important; /* We use custom header above */
        }
        
        .copilotKitChat .copilotKitChatMessages {
          background-color: transparent !important;
        }
        
        .copilotKitChat .copilotKitChatInput {
          background-color: var(--tv-bg-elevated) !important;
          border-top: 1px solid var(--tv-border-subtle) !important;
          border-radius: 8px !important;
          margin: 12px !important;
          width: calc(100% - 24px) !important;
        }
        
        .copilotKitChat .copilotKitChatMessage {
           border-radius: 8px !important;
           border: 1px solid transparent;
           line-height: 1.6;
        }
        
        .copilotKitChat .copilotKitChatMessage--user {
           background-color: var(--tv-blue-muted) !important;
           border: 1px solid rgba(56,139,253,0.2) !important;
           color: var(--tv-text-primary) !important;
        }
        
        .copilotKitChat .copilotKitChatMessage--assistant {
           background-color: var(--tv-bg-elevated) !important;
           border: 1px solid var(--tv-border-subtle) !important;
           color: var(--tv-text-primary) !important;
        }

        .copilotKitChat .copilotKitButton--primary {
           background-color: var(--tv-blue) !important;
           border-radius: 6px !important;
           color: white !important;
        }
      `}</style>
    </div>
  );
};
