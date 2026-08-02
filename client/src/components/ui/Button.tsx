import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-[box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-primary text-text-on-brand hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-sm',
      secondary:
        'bg-bg-subtle text-text hover:bg-surface-hover active:bg-surface-sunken border border-border shadow-sm',
      outline:
        'bg-transparent text-text border border-border hover:bg-surface-hover active:bg-surface-sunken',
      ghost:
        'bg-transparent text-text hover:bg-surface-hover active:bg-surface-sunken border border-transparent',
      danger:
        'bg-danger text-text-inverse hover:bg-danger-hover border border-transparent shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size={size === 'lg' ? 'md' : 'sm'} className="mr-1.5" />
            <span className="opacity-90">{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
