'use client'

/**
 * Tailwind CSS Components
 * =======================
 * Pure Tailwind CSS components to replace SEB Group Green Core components.
 */

import React, { forwardRef, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  'flex-direction'?: string
  'justify-content'?: string
  'align-items'?: string
  gap?: string
  'flex-wrap'?: string
  flex?: string
  padding?: string
  margin?: string
  'min-height'?: string
  'max-width'?: string
  width?: string
  height?: string
  background?: string
}

export const GdsFlex = forwardRef<HTMLDivElement, FlexProps>(({
  className,
  children,
  style,
  ...props
}, ref) => {
  const flexDirection = props['flex-direction']
  const justifyContent = props['justify-content']
  const alignItems = props['align-items']
  const gap = props.gap
  const padding = props.padding
  const flex = props.flex
  const width = props.width

  const gapMap: Record<string, string> = {
    'xs': 'gap-1', 's': 'gap-2', 'm': 'gap-4', 'l': 'gap-6', 'xl': 'gap-8',
  }

  const paddingMap: Record<string, string> = {
    'xs': 'p-1', 's': 'p-2', 'm': 'p-4', 'l': 'p-6', 'xl': 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex',
        flexDirection?.includes('column') && 'flex-col',
        justifyContent === 'space-between' && 'justify-between',
        justifyContent === 'center' && 'justify-center',
        alignItems === 'center' && 'items-center',
        gap && gapMap[gap],
        padding && paddingMap[padding],
        flex === '1' && 'flex-1',
        width === '100%' && 'w-full',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
})
GdsFlex.displayName = 'GdsFlex'

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string
  margin?: string
  background?: string
  flex?: string
  width?: string
  display?: string
}

export const GdsDiv = forwardRef<HTMLDivElement, DivProps>(({
  className,
  children,
  style,
  padding,
  flex,
  width,
  display,
}, ref) => {
  const paddingMap: Record<string, string> = {
    'xs': 'p-1', 's': 'p-2', 'm': 'p-4', 'l': 'p-6', 'xl': 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn(
        padding && paddingMap[padding],
        flex === '1' && 'flex-1',
        width === '100%' && 'w-full',
        display === 'flex' && 'flex',
        className
      )}
      style={style}
    >
      {children}
    </div>
  )
})
GdsDiv.displayName = 'GdsDiv'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: string
  gap?: string
  padding?: string
}

export const GdsGrid = forwardRef<HTMLDivElement, GridProps>(({
  className,
  children,
  columns = '1',
  gap = 'm',
  padding,
  ...props
}, ref) => {
  const gapMap: Record<string, string> = {
    'xs': 'gap-1', 's': 'gap-2', 'm': 'gap-4', 'l': 'gap-6', 'xl': 'gap-8',
  }

  const paddingMap: Record<string, string> = {
    'xs': 'p-1', 's': 'p-2', 'm': 'p-4', 'l': 'p-6', 'xl': 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn('grid', `grid-cols-${columns}`, gapMap[gap], padding && paddingMap[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
})
GdsGrid.displayName = 'GdsGrid'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string
  variant?: 'primary' | 'secondary' | 'tertiary'
}

export const GdsCard = forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  padding = 'l',
}, ref) => {
  const paddingMap: Record<string, string> = {
    '0': 'p-0', 'xs': 'p-1', 's': 'p-2', 'm': 'p-4', 'l': 'p-6', 'xl': 'p-8',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg shadow-sm bg-white border border-gray-200',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  )
})
GdsCard.displayName = 'GdsCard'

export const GdsDivider = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement>>(({
  className,
  ...props
}, ref) => (
  <hr ref={ref} className={cn('border-t border-gray-200 my-4', className)} {...props} />
))
GdsDivider.displayName = 'GdsDivider'

// ============================================================================
// TEXT COMPONENT
// ============================================================================

interface TextProps extends HTMLAttributes<HTMLElement> {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'
  font?: string
  color?: string
}

export const GdsText = forwardRef<HTMLElement, TextProps>(({
  tag = 'span',
  className,
  children,
  font,
  color,
}, ref) => {
  const fontClasses: Record<string, string> = {
    'heading-xl': 'text-3xl font-bold',
    'heading-l': 'text-2xl font-bold',
    'heading-m': 'text-xl font-semibold',
    'heading-s': 'text-lg font-semibold',
    'body-regular-l': 'text-lg',
    'body-regular-m': 'text-base',
    'body-regular-s': 'text-sm',
  }

  const colorClasses: Record<string, string> = {
    'neutral-01': 'text-gray-900',
    'neutral-02': 'text-gray-600',
    'secondary': 'text-gray-500',
  }

  const Component = tag as any

  return (
    <Component ref={ref} className={cn(font && fontClasses[font], color && colorClasses[color], className)}>
      {children}
    </Component>
  )
})
GdsText.displayName = 'GdsText'

// ============================================================================
// FORM COMPONENT
// ============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  onInput?: (_e: React.FormEvent<HTMLInputElement>) => void
}

export const GdsInput = forwardRef<HTMLInputElement, InputProps>(({
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
GdsInput.displayName = 'GdsInput'

// ============================================================================
// ACTION COMPONENT
// ============================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rank?: 'primary' | 'secondary' | 'tertiary'
  size?: 'small' | 'medium' | 'large'
}

export const GdsButton = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  rank = 'primary',
  size = 'medium',
  disabled,
  ...props
}, ref) => {
  const sizeClasses: Record<string, string> = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const rankClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    tertiary: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors',
        sizeClasses[size],
        rankClasses[rank],
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
GdsButton.displayName = 'GdsButton'

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

const badgeVariants: Record<string, string> = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
}

export const GdsBadge = forwardRef<HTMLSpanElement, BadgeProps>(({
  className,
  children,
  variant = 'primary',
  ...props
}, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      badgeVariants[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
))
GdsBadge.displayName = 'GdsBadge'

export const GdsSpinner = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => (
  <div ref={ref} className={cn('animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600', className)} {...props} />
))
GdsSpinner.displayName = 'GdsSpinner'

// ============================================================================
// THEME COMPONENT
// ============================================================================

interface ThemeProps {
  children: React.ReactNode
  'color-scheme'?: 'light' | 'dark'
}

export const GdsTheme: React.FC<ThemeProps> = ({ children, 'color-scheme': colorScheme }) => {
  return <div className={colorScheme === 'dark' ? 'dark' : ''}>{children}</div>
}
