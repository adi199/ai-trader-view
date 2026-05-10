import React from 'react';

export interface MetricCardProps {
  label: string;
  value: number | string | null | undefined;
  formatter?: 'currency' | 'percent' | 'number' | 'none';
  colorRule?: 'positive' | 'margin' | 'none';
  isLoading?: boolean;
  progressValue?: number;
  progressColor?: string;
  trend?: number;
}

const formatValue = (val: number | string | null | undefined, formatter: MetricCardProps['formatter']) => {
  if (val === null || val === undefined || val === 0 || val === '0') return null;
  if (typeof val === 'string') return val;
  if (formatter === 'currency') return `$${val.toFixed(2)}`;
  if (formatter === 'percent') return `${(val * 100).toFixed(2)}%`;
  if (formatter === 'number') {
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    return val.toLocaleString();
  }
  return val.toString();
};

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, value, formatter = 'none', colorRule = 'none', isLoading = false, progressValue, progressColor = 'bg-tv-blue', trend
}) => {
  const displayValue = formatValue(value, formatter);
  const isMissing = displayValue === null;

  let colorClass = 'text-tv-text-primary';
  if (!isMissing) {
    if (colorRule === 'positive') {
      colorClass = Number(value) > 0 ? 'text-tv-green' : Number(value) < 0 ? 'text-tv-red' : 'text-tv-text-primary';
    } else if (colorRule === 'margin') {
      colorClass = Number(value) > 0.2 ? 'text-tv-green' : 'text-tv-text-primary';
    }
  }

  return (
    <div className="flex flex-col bg-tv-bg-elevated border border-tv-border-subtle rounded-2xl p-5 transition-all duration-300 hover:bg-tv-bg-overlay hover:border-tv-border-strong hover:scale-[1.02] hover:shadow-xl relative overflow-hidden group shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[12px] text-tv-text-secondary font-semibold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
        {trend !== undefined && !isMissing && !isLoading && (
          <span className={`text-[11px] font-bold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-tv-green/10 text-tv-green' : 'bg-tv-red/10 text-tv-red'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {(isLoading || isMissing) ? (
        <div className="flex flex-col gap-3 mt-2">
          <div className="w-20 h-8 bg-tv-bg-overlay/50 rounded-lg animate-shimmer" />
          <div className="w-28 h-2 bg-tv-bg-overlay/30 rounded-full mt-1 animate-shimmer" />
        </div>
      ) : (
        <div className="flex flex-col gap-1 mt-1">
          <span className={`animate-value-flash text-[26px] font-extrabold ${colorClass} tracking-tight leading-none`}>
            {displayValue}
          </span>
        </div>
      )}

      {/* Optional Progress Bar overlay at the bottom */}
      {progressValue !== undefined && !isMissing && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-tv-bg-overlay/50">
          <div 
            className={`h-full ${progressColor} opacity-60 group-hover:opacity-100 transition-all duration-500`}
            style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }}
          />
        </div>
      )}
    </div>
  );
};
