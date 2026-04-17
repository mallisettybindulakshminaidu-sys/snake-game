import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'cyan' | 'magenta';
  className?: string;
}

export const NeonCard: React.FC<NeonCardProps> = ({ 
  children, 
  title, 
  variant = 'cyan', 
  className = '' 
}) => {
  const borderColor = variant === 'cyan' ? 'neon-text-cyan' : 'neon-text-magenta';
  const borderClass = variant === 'cyan' ? 'border-neon-cyan' : 'border-neon-magenta';

  return (
    <div className={`relative overflow-hidden bg-surface-dim border border-border-dim rounded-none p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4 border-b border-border-dim pb-2">
          <h2 className={`font-sans text-[11px] font-bold tracking-[2px] uppercase text-text-dim`}>
            {title}
          </h2>
          <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full ${variant === 'cyan' ? 'bg-neon-cyan' : 'bg-neon-magenta'} opacity-50`} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
