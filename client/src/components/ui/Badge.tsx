import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';

  const variants = {
    neutral: 'bg-bg-subtle text-text-muted border-border',
    primary: 'bg-primary-subtle text-primary-subtle-text border-primary-border',
    success: 'bg-success-subtle text-success-subtle-text border-success-border',
    warning: 'bg-warning-subtle text-warning-subtle-text border-warning-border',
    danger: 'bg-danger-subtle text-danger-subtle-text border-danger-border',
    info: 'bg-info-subtle text-info-subtle-text border-info-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
