import React from 'react';
import { useDrawingStore } from '../stores/drawingStore';
import { Minus, Square, TrendingUp, Trash2 } from 'lucide-react';

export const DrawingToolbar: React.FC = () => {
  const { activeTool, setActiveTool, clearAll } = useDrawingStore();

  const tools = [
    { id: 'support', icon: <Minus size={18} className="rotate-0" />, label: 'Support' },
    { id: 'resistance', icon: <Minus size={18} className="rotate-0" />, label: 'Resistance' },
    { id: 'box', icon: <Square size={16} />, label: 'Box' },
    { id: 'trendline', icon: <TrendingUp size={18} />, label: 'Trend' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-[#1e222d]/80 backdrop-blur-md border border-[#363a45] rounded-xl shadow-2xl shrink-0 transition-all hover:bg-[#1e222d]">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setActiveTool(activeTool === tool.id ? 'none' : tool.id as any)}
          className={`px-3 py-2 rounded-lg transition-all flex flex-col items-center gap-1 min-w-[56px] ${
            activeTool === tool.id 
              ? 'bg-[#2962ff] text-white shadow-lg shadow-blue-500/20' 
              : 'text-slate-400 hover:bg-[#2a2e39] hover:text-slate-200'
          }`}
          title={tool.label}
        >
          {tool.icon}
          <span className="text-[9px] uppercase font-black tracking-tight">{tool.label}</span>
        </button>
      ))}
      <div className="w-[1px] h-10 bg-[#363a45] mx-1.5"></div>
      <button
        onClick={clearAll}
        className="px-3 py-2 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-all flex flex-col items-center gap-1 min-w-[56px]"
        title="Clear All"
      >
        <Trash2 size={18} />
        <span className="text-[9px] uppercase font-black tracking-tight">Clear</span>
      </button>
    </div>
  );
};
