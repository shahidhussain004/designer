/**
 * Input Component
 * ================
 * Accessible form input with label, helper text, and error states
 */

import { cn } from '@/lib/design-system/utils';
import React, { forwardRef, useId } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Left addon (icon or text) */
  leftAddon?: React.ReactNode;
  /** Right addon (icon or text) */
  rightAddon?: React.ReactNode;
  /** Full width input */
  fullWidth?: boolean;
  /** Required field indicator */
  isRequired?: boolean;
  /** Optional label */
  isOptional?: boolean;
}

const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-4 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      size = 'md',
      leftAddon,
      rightAddon,
      fullWidth = false,
      isRequired = false,
      isOptional = false,
      disabled,
      id: providedId,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const hasError = !!error;
    const describedBy = [
      ariaDescribedBy,
      helperText && !hasError ? helperId : null,
      hasError ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-sm font-medium text-secondary-700',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {isRequired && (
              <span className="text-error-600 ml-0.5" aria-hidden="true">
                *
              </span>
            )}
            {isOptional && (
              <span className="text-secondary-500 ml-1 font-normal">
                (optional)
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left addon */}
          {leftAddon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-secondary-400">
              {leftAddon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={isRequired}
            className={cn(
              // Base styles
              'w-full rounded-md border bg-white text-secondary-900',
              'placeholder:text-secondary-400',
              'transition-all duration-200',
              // Focus styles handled by global CSS (uses --input-focus)
              'focus:outline-none',
              // Size
              inputSizes[size],
              // Left padding for addon
              leftAddon && 'pl-10',
              // Right padding for addon
              rightAddon && 'pr-10',
              // States
              hasError
                ? 'border-error-500 focus:border-error-500 focus:ring-error-200'
                : 'border-secondary-300 hover:border-secondary-400',
              // Disabled
              disabled && 'bg-secondary-50 cursor-not-allowed opacity-50',
              className
            )}
            {...props}
          />

          {/* Right addon */}
          {rightAddon && (
            <div className="absolute right-3 flex items-center text-secondary-400">
              {rightAddon}
            </div>
          )}
        </div>

        {/* Helper text */}
        {helperText && !hasError && (
          <p id={helperId} className="text-sm text-secondary-500">
            {helperText}
          </p>
        )}

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-error-600 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
