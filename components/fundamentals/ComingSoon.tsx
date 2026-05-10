import React from 'react';

interface ComingSoonProps {
  icon: string;
  title: string;
  description: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = React.memo(({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-24 text-tv-text-secondary bg-tv-bg-elevated/5 border border-tv-border-subtle border-dashed rounded-3xl">
    <div className="w-16 h-16 rounded-full bg-tv-bg-elevated flex items-center justify-center mb-6">
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-lg font-bold text-tv-text-primary mb-1">{title}</p>
    <p className="text-sm opacity-60">{description}</p>
  </div>
));

ComingSoon.displayName = 'ComingSoon';
