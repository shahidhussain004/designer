/**
 * Layout Components
 * =================
 * Responsive layout primitives for building consistent page layouts
 */

'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/design-system/utils';

// =============================================================================
// CONTAINER
// =============================================================================

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width preset */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Add horizontal padding */
  padding?: boolean;
  /** Center the container */
  center?: boolean;
}

const containerSizes = {
  sm: 'max-w-screen-sm',   // 640px
  md: 'max-w-screen-md',   // 768px
  lg: 'max-w-screen-lg',   // 1024px
  xl: 'max-w-screen-xl',   // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
  full: 'max-w-full',
};

/**
 * Responsive container with configurable max-width
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', padding = true, center = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          containerSizes[size],
          padding && 'px-4 sm:px-6 lg:px-8',
          center && 'mx-auto',
          'w-full',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

// =============================================================================
// GRID
// =============================================================================

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns at different breakpoints */
  cols?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  /** Gap between items */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

const colsClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const smColsClasses: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  7: 'sm:grid-cols-7',
  8: 'sm:grid-cols-8',
  9: 'sm:grid-cols-9',
  10: 'sm:grid-cols-10',
  11: 'sm:grid-cols-11',
  12: 'sm:grid-cols-12',
};

const mdColsClasses: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
};

const lgColsClasses: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
};

const xlColsClasses: Record<number, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
};

const gapClasses = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
};

/**
 * Responsive grid layout with configurable columns per breakpoint
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = { default: 1 }, gap = 4, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          cols.default && colsClasses[cols.default],
          cols.sm && smColsClasses[cols.sm],
          cols.md && mdColsClasses[cols.md],
          cols.lg && lgColsClasses[cols.lg],
          cols.xl && xlColsClasses[cols.xl],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// =============================================================================
// STACK
// =============================================================================

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stack direction */
  direction?: 'horizontal' | 'vertical';
  /** Gap between items */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Justification */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Wrap items */
  wrap?: boolean;
  /** Reverse order */
  reverse?: boolean;
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Flexible stack layout (horizontal or vertical)
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({
    className,
    direction = 'vertical',
    gap = 4,
    align = 'stretch',
    justify = 'start',
    wrap = false,
    reverse = false,
    children,
    ...props
  }, ref) => {
    const directionClass = direction === 'horizontal' 
      ? (reverse ? 'flex-row-reverse' : 'flex-row')
      : (reverse ? 'flex-col-reverse' : 'flex-col');

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directionClass,
          gapClasses[gap],
          alignClasses[align],
          justifyClasses[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// =============================================================================
// SECTION
// =============================================================================

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Section padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Background color variant */
  background?: 'default' | 'muted' | 'accent' | 'dark';
  /** ARIA label for the section */
  'aria-label'?: string;
}

const sectionPadding = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

const sectionBackground = {
  default: 'bg-white',
  muted: 'bg-secondary-50',
  accent: 'bg-primary-50',
  dark: 'bg-secondary-900 text-white',
};

/**
 * Page section with consistent spacing and backgrounds
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, padding = 'md', background = 'default', children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          sectionPadding[padding],
          sectionBackground[background],
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

// =============================================================================
// ASPECT RATIO
// =============================================================================

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio */
  ratio?: '1:1' | '4:3' | '3:2' | '16:9' | '21:9' | '2:3' | '3:4';
}

const ratioClasses = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '16:9': 'aspect-video',
  '21:9': 'aspect-[21/9]',
  '2:3': 'aspect-[2/3]',
  '3:4': 'aspect-[3/4]',
};

/**
 * Maintain aspect ratio for children
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = '16:9', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', ratioClasses[ratio], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

// =============================================================================
// DIVIDER
// =============================================================================

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Visual style */
  variant?: 'solid' | 'dashed' | 'dotted';
  /** Spacing around divider */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const dividerVariant = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const dividerSpacing = {
  none: '',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-8',
};

const verticalDividerSpacing = {
  none: '',
  sm: 'mx-2',
  md: 'mx-4',
  lg: 'mx-8',
};

/**
 * Visual separator between content
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = 'horizontal', variant = 'solid', spacing = 'md', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <hr
          ref={ref}
          aria-orientation="vertical"
          className={cn(
            'inline-block h-full w-0 border-l border-secondary-200',
            dividerVariant[variant],
            verticalDividerSpacing[spacing],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <hr
        ref={ref}
        className={cn(
          'border-t border-secondary-200',
          dividerVariant[variant],
          dividerSpacing[spacing],
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

// =============================================================================
// RESPONSIVE HIDE/SHOW
// =============================================================================

export interface ResponsiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hide at these breakpoints */
  hideAt?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  /** Show only at these breakpoints */
  showAt?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
}

/**
 * Show or hide content at specific breakpoints
 */
export const Responsive = forwardRef<HTMLDivElement, ResponsiveProps>(
  ({ className, hideAt, showAt, children, ...props }, ref) => {
    const classes: string[] = [];

    if (hideAt) {
      if (hideAt.includes('xs')) classes.push('max-sm:hidden');
      if (hideAt.includes('sm')) classes.push('sm:max-md:hidden');
      if (hideAt.includes('md')) classes.push('md:max-lg:hidden');
      if (hideAt.includes('lg')) classes.push('lg:max-xl:hidden');
      if (hideAt.includes('xl')) classes.push('xl:max-2xl:hidden');
      if (hideAt.includes('2xl')) classes.push('2xl:hidden');
    }

    if (showAt) {
      // Start hidden, then show at specific breakpoints
      classes.push('hidden');
      if (showAt.includes('xs')) classes.push('max-sm:block');
      if (showAt.includes('sm')) classes.push('sm:block');
      if (showAt.includes('md')) classes.push('md:block');
      if (showAt.includes('lg')) classes.push('lg:block');
      if (showAt.includes('xl')) classes.push('xl:block');
      if (showAt.includes('2xl')) classes.push('2xl:block');
    }

    return (
      <div
        ref={ref}
        className={cn(classes.join(' '), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Responsive.displayName = 'Responsive';

// =============================================================================
// MAIN LAYOUT
// =============================================================================

export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header component */
  header?: React.ReactNode;
  /** Footer component */
  footer?: React.ReactNode;
  /** Sidebar component */
  sidebar?: React.ReactNode;
  /** Sidebar position */
  sidebarPosition?: 'left' | 'right';
}

/**
 * Main page layout with header, footer, and optional sidebar
 */
export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  ({ className, header, footer, sidebar, sidebarPosition = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex min-h-screen flex-col', className)}
        {...props}
      >
        {header && (
          <header role="banner" className="sticky top-0 z-40">
            {header}
          </header>
        )}
        
        <div className="flex flex-1">
          {sidebar && sidebarPosition === 'left' && (
            <aside role="complementary" className="hidden lg:block">
              {sidebar}
            </aside>
          )}
          
          <main role="main" className="flex-1">
            {children}
          </main>
          
          {sidebar && sidebarPosition === 'right' && (
            <aside role="complementary" className="hidden lg:block">
              {sidebar}
            </aside>
          )}
        </div>
        
        {footer && (
          <footer role="contentinfo">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);

MainLayout.displayName = 'MainLayout';

export default Container;
