/**
 * Badge Component
 * ================
 * Status badges, tags, and labels
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/design-system/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge visual style */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon before text */
  icon?: React.ReactNode;
  /** Make badge removable */
  onRemove?: () => void;
  /** Dot indicator */
  dot?: boolean;
}

const badgeVariants = {
  default: 'bg-secondary-100 text-secondary-700 ring-secondary-200',
  primary: 'bg-primary-100 text-primary-700 ring-primary-200',
  secondary: 'bg-secondary-100 text-secondary-600 ring-secondary-200',
  success: 'bg-success-100 text-success-700 ring-success-200',
  warning: 'bg-warning-100 text-warning-700 ring-warning-200',
  error: 'bg-error-100 text-error-700 ring-error-200',
  info: 'bg-info-100 text-info-700 ring-info-200',
  outline: 'bg-transparent text-secondary-700 ring-1 ring-secondary-300',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
};

const dotColors = {
  default: 'bg-secondary-400',
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  outline: 'bg-secondary-500',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      icon,
      onRemove,
      dot = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1.5 font-medium rounded-full',
          'ring-1 ring-inset',
          // Variant styles
          badgeVariants[variant],
          // Size styles
          badgeSizes[size],
          className
        )}
        {...props}
      >
        {/* Dot indicator */}
        {dot && (
          <span
            className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])}
            aria-hidden="true"
          />
        )}

        {/* Icon */}
        {icon && !dot && (
          <span className="shrink-0 -ml-0.5" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Content */}
        {children}

        {/* Remove button */}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              'shrink-0 -mr-1 p-0.5 rounded-full',
              'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1',
              'transition-colors duration-150'
            )}
            aria-label="Remove"
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.78 4.28a.75.75 0 00-1.06-1.06L8 6.94 4.28 3.22a.75.75 0 00-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 101.06 1.06L8 9.06l3.72 3.72a.75.75 0 101.06-1.06L9.06 8l3.72-3.72z" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
