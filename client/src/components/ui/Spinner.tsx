import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div role="status" className={cn('inline-flex items-center justify-center', className)} {...props}>
      <Loader2 className={cn('animate-spin text-primary', sizes[size])} />
      <span className="sr-only">{label}</span>
    </div>
  );
};
