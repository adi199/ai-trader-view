import React from 'react';

interface SectionHeaderProps {
  text: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(({ text }) => (
  <div className="flex items-center text-[13px] text-tv-text-primary font-bold uppercase tracking-wider mb-6 mt-14 border-l-[3px] border-tv-blue pl-3">
    {text}
  </div>
));

SectionHeader.displayName = 'SectionHeader';
