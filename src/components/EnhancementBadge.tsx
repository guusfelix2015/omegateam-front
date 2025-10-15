import React from 'react';
import {
  getEnhancementGradient,
  formatEnhancementLevel,
} from '../utils/enhancement.utils';

interface EnhancementBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EnhancementBadge: React.FC<EnhancementBadgeProps> = ({
  level,
  size = 'md',
  className = '',
}) => {
  if (level === 0) return null;

  const sizeClasses = {
    sm: 'w-5 h-5 text-[8px]',
    md: 'w-6 h-6 text-[10px]',
    lg: 'w-8 h-8 text-xs',
  };

  const gradient = getEnhancementGradient(level);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        font-bold text-white
        shadow-md
        ring-2 ring-white/30
        ${className}
      `}
      title={`Encantamento ${formatEnhancementLevel(level)}`}
    >
      {formatEnhancementLevel(level)}
    </div>
  );
};

