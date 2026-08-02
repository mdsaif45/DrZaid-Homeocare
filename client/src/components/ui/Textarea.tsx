import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className, required, disabled, rows = 3, ...props }, ref) => {
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

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={cn(
            'w-full rounded-lg bg-surface text-text text-sm border transition-[box-shadow] shadow-sm px-3.5 py-2',
            'placeholder:text-text-disabled',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:border-primary',
            'disabled:bg-bg-subtle disabled:text-text-disabled disabled:cursor-not-allowed',
            error ? 'border-danger focus-visible:ring-danger' : 'border-border',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
