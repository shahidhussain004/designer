'use client'

/**
 * Tailwind CSS UI Components
 */

import React, { forwardRef, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  justify?: 'start' | 'center' | 'end' | 'between'
  align?: 'start' | 'center' | 'end'
  gap?: 'xs' | 's' | 'm' | 'l' | 'xl'
  wrap?: boolean
  padding?: 'xs' | 's' | 'm' | 'l' | 'xl'
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({
  className,
  children,
  direction,
  justify,
  align,
  gap,
  wrap,
  padding,
  ...props
}, ref) => {
  const gapMap: Record<string, string> = {
    xs: 'gap-1', s: 'gap-2', m: 'gap-4', l: 'gap-6', xl: 'gap-8',
  }

  const paddingMap: Record<string, string> = {
    xs: 'p-1', s: 'p-2', m: 'p-4', l: 'p-6', xl: 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex',
        direction === 'column' && 'flex-col',
        justify === 'between' && 'justify-between',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        align === 'center' && 'items-center',
        align === 'start' && 'items-start',
        align === 'end' && 'items-end',
        wrap && 'flex-wrap',
        gap && gapMap[gap],
        padding && paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Flex.displayName = 'Flex'

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'xs' | 's' | 'm' | 'l' | 'xl'
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(({
  className,
  children,
  padding,
  ...props
}, ref) => {
  const paddingMap: Record<string, string> = {
    xs: 'p-1', s: 'p-2', m: 'p-4', l: 'p-6', xl: 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn(padding && paddingMap[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
})
Box.displayName = 'Box'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'xs' | 's' | 'm' | 'l' | 'xl'
  padding?: 'xs' | 's' | 'm' | 'l' | 'xl'
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(({
  className,
  children,
  columns = 1,
  gap = 'm',
  padding,
  ...props
}, ref) => {
  const gapMap: Record<string, string> = {
    xs: 'gap-1', s: 'gap-2', m: 'gap-4', l: 'gap-6', xl: 'gap-8',
  }

  const paddingMap: Record<string, string> = {
    xs: 'p-1', s: 'p-2', m: 'p-4', l: 'p-6', xl: 'p-8',
  }

  const colsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        colsMap[columns],
        gapMap[gap],
        padding && paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Grid.displayName = 'Grid'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'xs' | 's' | 'm' | 'l' | 'xl'
  variant?: 'default' | 'bordered'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  padding = 'l',
  variant = 'default',
  ...props
}, ref) => {
  const paddingMap: Record<string, string> = {
    none: 'p-0', xs: 'p-1', s: 'p-2', m: 'p-4', l: 'p-6', xl: 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg shadow-sm bg-white border border-gray-200',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'

export const Divider = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement>>(({
  className,
  ...props
}, ref) => (
  <hr ref={ref} className={cn('border-t border-gray-200 my-4', className)} {...props} />
))
Divider.displayName = 'Divider'

// ============================================================================
// TEXT COMPONENT
// ============================================================================

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'primary' | 'secondary' | 'muted'
}

export const Text = forwardRef<HTMLElement, TextProps>(({
  as: Component = 'span',
  className,
  children,
  size,
  weight,
  color,
  ...props
}, ref) => {
  const sizeClasses: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  const weightClasses: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colorClasses: Record<string, string> = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
  }

  return (
    <Component
      ref={ref as any}
      className={cn(
        size && sizeClasses[size],
        weight && weightClasses[weight],
        color && colorClasses[color],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})
Text.displayName = 'Text'

// ============================================================================
// FORM COMPONENTS
// ============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  ...props
}, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        className
      )}
      {...props}
    />
  </div>
))
Input.displayName = 'Input'

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}, ref) => {
  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = 'Button'

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  className,
  children,
  variant = 'default',
  ...props
}, ref) => {
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})
Badge.displayName = 'Badge'

export const Spinner = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600', className)} {...props} />
))
Spinner.displayName = 'Spinner'

// ============================================================================
// THEME COMPONENT
// ============================================================================

interface ThemeProps {
  children: React.ReactNode
  mode?: 'light' | 'dark'
}

export const Theme: React.FC<ThemeProps> = ({ children, mode }) => {
  return <div className={mode === 'dark' ? 'dark' : ''}>{children}</div>
}
