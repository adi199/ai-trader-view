import React from 'react';

export interface MetricCardProps {
  label: string;
  value: number | string | null | undefined;
  formatter?: 'currency' | 'percent' | 'number' | 'none';
  colorRule?: 'positive' | 'margin' | 'none';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const formatValue = (val: number | string | null | undefined, formatter: MetricCardProps['formatter']) => {
  if (val === null || val === undefined || val === 0 || val === '0') return "—";
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
  label, value, formatter = 'none', colorRule = 'none', size = 'sm', isLoading = false 
}) => {
  const isZero = value === null || value === undefined || value === 0 || value === '0';
  const displayValue = formatValue(value, formatter);

  let color = 'var(--tv-text-primary)';
  if (!isZero) {
    if (colorRule === 'positive') {
      color = Number(value) > 0 ? 'var(--tv-green)' : Number(value) < 0 ? 'var(--tv-red)' : 'var(--tv-text-primary)';
    } else if (colorRule === 'margin') {
      color = Number(value) > 0.2 ? 'var(--tv-green)' : 'var(--tv-text-primary)';
    }
  }

  const sizes = {
    sm: { label: '10px', value: '13px' },
    md: { label: '11px', value: '15px' },
    lg: { label: '12px', value: '20px' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: sizes[size].label, color: 'var(--tv-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {isLoading ? (
        <div style={{ width: '48px', height: sizes[size].value, background: 'var(--tv-bg-overlay)', borderRadius: '3px' }} className="animate-shimmer" />
      ) : (
        <span className="value-flash" style={{ fontSize: sizes[size].value, fontWeight: 500, color: isZero ? 'var(--tv-text-tertiary)' : color, whiteSpace: 'nowrap' }}>
          {displayValue}
        </span>
      )}
    </div>
  );
};
