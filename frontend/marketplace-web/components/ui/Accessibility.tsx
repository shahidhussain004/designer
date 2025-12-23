/**
 * Accessibility Components
 * ========================
 * Components and utilities for WCAG 2.1 AA compliance
 */

'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { cn } from '@/lib/design-system/utils';

// =============================================================================
// SKIP LINK
// =============================================================================

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target element ID to skip to */
  targetId: string;
  /** Link text */
  children?: React.ReactNode;
}

/**
 * Skip link for keyboard navigation - allows users to skip to main content
 * WCAG 2.1 Level A - Bypass Blocks (2.4.1)
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ className, targetId, children = 'Skip to main content', ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${targetId}`}
        className={cn(
          'sr-only focus:not-sr-only',
          'focus:fixed focus:top-4 focus:left-4 focus:z-[9999]',
          'focus:px-4 focus:py-2 focus:rounded-lg',
          'focus:bg-primary-500 focus:text-white focus:font-medium',
          'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2',
          'transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

SkipLink.displayName = 'SkipLink';

// =============================================================================
// VISUALLY HIDDEN (Screen Reader Only)
// =============================================================================

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Make visible on focus */
  focusable?: boolean;
}

/**
 * Hides content visually but keeps it accessible to screen readers
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, focusable = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
          '[clip:rect(0,0,0,0)]',
          focusable && 'focus:static focus:w-auto focus:h-auto focus:p-0 focus:m-0 focus:overflow-visible focus:whitespace-normal focus:[clip:auto]',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

// =============================================================================
// LIVE REGION
// =============================================================================

export interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Announcement priority */
  priority?: 'polite' | 'assertive';
  /** Message to announce */
  message?: string;
  /** Clear message after timeout (ms) */
  clearAfter?: number;
}

/**
 * Live region for dynamic content announcements to screen readers
 * WCAG 2.1 Level A - Status Messages (4.1.3)
 */
export const LiveRegion = forwardRef<HTMLDivElement, LiveRegionProps>(
  ({ className, priority = 'polite', message, clearAfter = 3000, children, ...props }, ref) => {
    const [announcement, setAnnouncement] = useState(message || '');

    useEffect(() => {
      if (message) {
        setAnnouncement(message);
        
        if (clearAfter > 0) {
          const timer = setTimeout(() => setAnnouncement(''), clearAfter);
          return () => clearTimeout(timer);
        }
      }
    }, [message, clearAfter]);

    return (
      <div
        ref={ref}
        aria-live={priority}
        aria-atomic="true"
        className={cn('sr-only', className)}
        {...props}
      >
        {announcement || children}
      </div>
    );
  }
);

LiveRegion.displayName = 'LiveRegion';

// =============================================================================
// FOCUS TRAP
// =============================================================================

export interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the trap is active */
  active?: boolean;
  /** Restore focus on unmount */
  restoreFocus?: boolean;
  children: React.ReactNode;
}

/**
 * Traps focus within a container (for modals, dialogs, etc.)
 * WCAG 2.1 Level A - Focus Order (2.4.3)
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({
  active = true,
  restoreFocus = true,
  children,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, restoreFocus]);

  return (
    <div ref={containerRef} {...props}>
      {children}
    </div>
  );
};

// =============================================================================
// HEADING LEVEL MANAGER
// =============================================================================

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (1-6) */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual style override (for styling vs semantic level) */
  styleAs?: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingStyles = {
  1: 'text-4xl font-bold tracking-tight',
  2: 'text-3xl font-semibold tracking-tight',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
};

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Accessible heading with proper level and optional visual style override
 * WCAG 2.1 Level A - Headings and Labels (2.4.6)
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, styleAs, children, ...props }, ref) => {
    const Tag: HeadingTag = `h${level}` as HeadingTag;
    const visualLevel = styleAs || level;

    return React.createElement(
      Tag,
      {
        ref,
        className: cn(headingStyles[visualLevel], 'text-secondary-900', className),
        ...props,
      },
      children
    );
  }
);

Heading.displayName = 'Heading';

// =============================================================================
// REDUCED MOTION HOOK
// =============================================================================

/**
 * Hook to detect if user prefers reduced motion
 * WCAG 2.1 Level AAA - Animation from Interactions (2.3.3)
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// =============================================================================
// FOCUS VISIBLE HOOK
// =============================================================================

/**
 * Hook to detect if :focus-visible should be used
 * Helps determine if user is navigating with keyboard
 */
export function useFocusVisible(): boolean {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsFocusVisible(true);
      }
    };

    const handleMouseDown = () => {
      setIsFocusVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isFocusVisible;
}

// =============================================================================
// CONTRAST CHECKER COMPONENT
// =============================================================================

export interface ContrastBadgeProps {
  /** Foreground color in hex */
  foreground: string;
  /** Background color in hex */
  background: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

/**
 * Display a badge showing contrast ratio compliance level
 */
export const ContrastBadge: React.FC<ContrastBadgeProps> = ({
  foreground,
  background,
  size = 'sm',
}) => {
  const ratio = calculateContrastRatio(foreground, background);
  const level = getContrastLevel(ratio);

  const colors = {
    AAA: 'bg-success-100 text-success-700 border-success-300',
    AA: 'bg-primary-100 text-primary-700 border-primary-300',
    'AA Large': 'bg-warning-100 text-warning-700 border-warning-300',
    Fail: 'bg-error-100 text-error-700 border-error-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        colors[level],
        sizes[size]
      )}
    >
      <span>{level}</span>
      <span className="opacity-75">({ratio.toFixed(2)}:1)</span>
    </span>
  );
};

// Helper functions
function calculateContrastRatio(foreground: string, background: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = rgb.map((val) => {
      const s = val / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function getContrastLevel(ratio: number): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export default SkipLink;
