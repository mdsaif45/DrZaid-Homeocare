import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { cn } from '../../lib/cn';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth' | 'children'> {
  'aria-label': string;
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, size = 'md', 'aria-label': ariaLabel, ...props }, ref) => {
    const sizeClasses = {
      sm: 'p-1.5 min-w-8 min-h-8 text-xs',
      md: 'p-2 min-w-10 min-h-10 text-sm',
      lg: 'p-2.5 min-w-12 min-h-12 text-base',
    };

    return (
      <Button
        ref={ref}
        size={size}
        aria-label={ariaLabel}
        className={cn(sizeClasses[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
