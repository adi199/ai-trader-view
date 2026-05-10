import React, { useState, useRef, useEffect } from 'react';
import { useDrawingStore } from '../stores/drawingStore';
import { Minus, Square, TrendingUp, Trash2, ChevronDown, Pencil } from 'lucide-react';

export const DrawingToolbar: React.FC = () => {
  const { activeTool, setActiveTool, clearAll } = useDrawingStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: 'support', icon: <Minus size={16} />, label: 'Support', color: 'text-tv-green' },
    { id: 'resistance', icon: <Minus size={16} />, label: 'Resistance', color: 'text-tv-red' },
    { id: 'box', icon: <Square size={14} />, label: 'Box', color: 'text-tv-blue' },
    { id: 'trendline', icon: <TrendingUp size={16} />, label: 'Trendline', color: 'text-tv-amber' },
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

  const currentTool = tools.find(t => t.id === activeTool);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all border ${
          isOpen || activeTool !== 'none' 
            ? 'bg-tv-blue/10 border-tv-blue/30 text-tv-blue shadow-[0_0_15px_rgba(56,139,253,0.1)]' 
            : 'bg-tv-bg-elevated/50 border-tv-border-default text-tv-text-secondary hover:border-tv-border-strong hover:bg-tv-bg-elevated'
        } group`}
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>
          {currentTool ? currentTool.icon : <Pencil size={16} />}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest min-w-[70px] text-left">
          {currentTool ? currentTool.label : 'Draw tools'}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} opacity-50`} />
      </button>

      {/* Dropdown Menu */}
      <div className={`absolute top-full left-0 mt-2 w-48 bg-tv-bg-overlay border border-tv-border-strong rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-left z-50 ${
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-1.5 flex flex-col gap-1">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-tv-text-tertiary border-b border-tv-border-default mb-1">
            Drawing Tools
          </div>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(activeTool === tool.id ? 'none' : tool.id as any);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeTool === tool.id 
                  ? 'bg-tv-blue/10 text-tv-blue' 
                  : 'text-tv-text-secondary hover:bg-tv-bg-elevated hover:text-tv-text-primary'
              }`}
            >
              <span className={tool.color}>{tool.icon}</span>
              <span className="text-[11px] font-semibold">{tool.label}</span>
              {activeTool === tool.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-tv-blue shadow-[0_0_8px_rgba(56,139,253,0.6)]" />
              )}
            </button>
          ))}
          
          <div className="h-[1px] bg-tv-border-default my-1 mx-2" />
          
          <button
            onClick={() => {
              clearAll();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-tv-red/70 hover:bg-tv-red-muted hover:text-tv-red transition-all w-full text-left"
          >
            <Trash2 size={16} />
            <span className="text-[11px] font-semibold">Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
