import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, leftIcon, id, className, required, disabled, children, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    const describedBy = [error ? errorId : null, hint ? hintId : null]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text flex items-center gap-1">
            {label}
            {required && <span className="text-danger font-semibold">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={!!error}
            className={cn(
              'w-full rounded-lg bg-surface text-text text-sm border transition-[box-shadow] shadow-sm cursor-pointer pr-8',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:border-primary',
              'disabled:bg-bg-subtle disabled:text-text-disabled disabled:cursor-not-allowed',
              error ? 'border-danger focus-visible:ring-danger' : 'border-border',
              leftIcon ? 'pl-9' : 'pl-3.5',
              'py-2',
              className
            )}
            {...props}
          >
            {children}
          </select>
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-danger font-medium">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
