/**
 * Card Component
 * ===============
 * Versatile card component with header, body, and footer sections
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/design-system/utils';

// =============================================================================
// CARD ROOT
// =============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Card shadow intensity */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** Border style */
  border?: 'none' | 'light' | 'default';
  /** Make card interactive (hover effects) */
  isInteractive?: boolean;
  /** Selected state */
  isSelected?: boolean;
}

const paddingSizes = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const shadowSizes = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const borderStyles = {
  none: '',
  light: 'border border-secondary-100',
  default: 'border border-secondary-200',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding = 'md',
      shadow = 'sm',
      border = 'default',
      isInteractive = false,
      isSelected = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-white rounded-xl',
          // Padding
          paddingSizes[padding],
          // Shadow
          shadowSizes[shadow],
          // Border
          borderStyles[border],
          // Interactive styles
          isInteractive && [
            'cursor-pointer',
            'transition-all duration-200',
            'hover:shadow-md hover:border-secondary-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          ],
          // Selected state
          isSelected && 'ring-2 ring-primary-500 border-primary-500',
          className
        )}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// =============================================================================
// CARD HEADER
// =============================================================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title */
  title?: string;
  /** Card subtitle or description */
  subtitle?: string;
  /** Action element (button, dropdown, etc.) */
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between gap-4 mb-4',
          className
        )}
        {...props}
      >
        {(title || subtitle || children) && (
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-secondary-900 leading-6">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-secondary-500">{subtitle}</p>
            )}
            {children}
          </div>
        )}
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// =============================================================================
// CARD BODY
// =============================================================================

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// =============================================================================
// CARD FOOTER
// =============================================================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer alignment */
  align?: 'left' | 'center' | 'right' | 'between';
}

const footerAlignments = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
};

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 mt-4 pt-4 border-t border-secondary-100',
          footerAlignments[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
