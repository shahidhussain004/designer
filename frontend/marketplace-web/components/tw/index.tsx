'use client'

/**
 * Tailwind CSS UI Components
 */

import React, { forwardRef, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/design-system/utils'

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
  'margin-bottom'?: string
  'margin-top'?: string
  'min-height'?: string
  'max-width'?: string
  width?: string
  height?: string
  background?: string
  'text-align'?: string
  'border-radius'?: string
  display?: string
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({
  className,
  children,
  style,
  ...props
}, ref) => {
  const flexDirection = props['flex-direction']
  const justifyContent = props['justify-content']
  const alignItems = props['align-items']
  const gap = props.gap
  const flexWrap = props['flex-wrap']
  const flex = props.flex
  const padding = props.padding
  const margin = props.margin
  const marginBottom = props['margin-bottom']
  const marginTop = props['margin-top']
  const minHeight = props['min-height']
  const maxWidth = props['max-width']
  const width = props.width
  const height = props.height
  const background = props.background
  const textAlign = props['text-align']
  const borderRadius = props['border-radius']
  const display = props.display

  const gapMap: Record<string, string> = {
    'xs': 'gap-1',
    's': 'gap-2',
    'm': 'gap-4',
    'l': 'gap-6',
    'xl': 'gap-8',
    '2xl': 'gap-10',
  }

  const paddingMap: Record<string, string> = {
    'xs': 'p-1',
    's': 'p-2',
    'm': 'p-4',
    'l': 'p-6',
    'xl': 'p-8',
    '2xl': 'p-10',
  }

  // Parse responsive display like "s{none} m{flex}"
  const parseDisplay = (disp: string | undefined) => {
    if (!disp) return ''
    const parts = disp.split(' ')
    let classes = ''
    parts.forEach(part => {
      if (part.startsWith('s{')) {
        const val = part.match(/s\{(\w+)\}/)?.[1]
        if (val === 'none') classes += ' hidden sm:hidden'
        if (val === 'flex') classes += ' flex sm:flex'
      } else if (part.startsWith('m{')) {
        const val = part.match(/m\{(\w+)\}/)?.[1]
        if (val === 'none') classes += ' md:hidden'
        if (val === 'flex') classes += ' md:flex'
      } else if (part.startsWith('l{')) {
        const val = part.match(/l\{(\w+)\}/)?.[1]
        if (val === 'none') classes += ' lg:hidden'
        if (val === 'flex') classes += ' lg:flex'
      }
    })
    return classes.trim()
  }

  return (
    <div
      ref={ref}
      className={cn(
        display ? parseDisplay(display) : 'flex',
        flexDirection?.includes('column') && 'flex-col',
        justifyContent === 'space-between' && 'justify-between',
        justifyContent === 'center' && 'justify-center',
        justifyContent === 'flex-start' && 'justify-start',
        justifyContent === 'flex-end' && 'justify-end',
        alignItems === 'center' && 'items-center',
        alignItems === 'flex-start' && 'items-start',
        alignItems === 'flex-end' && 'items-end',
        flexWrap === 'wrap' && 'flex-wrap',
        gap && gapMap[gap],
        padding && paddingMap[padding],
        flex === '1' && 'flex-1',
        width === '100%' && 'w-full',
        minHeight === '100vh' && 'min-h-screen',
        className
      )}
      style={{
        ...style,
        ...(maxWidth && { maxWidth: maxWidth === '1280px' ? '1280px' : maxWidth }),
        ...(margin === '0 auto' && { margin: '0 auto' }),
        ...(marginBottom && { marginBottom: marginBottom === 'l' ? '1.5rem' : marginBottom === 'm' ? '1rem' : marginBottom }),
        ...(marginTop && { marginTop: marginTop === 'auto' ? 'auto' : marginTop === 'l' ? '1.5rem' : marginTop }),
        ...(height && { height }),
        ...(background && { background }),
        ...(textAlign && { textAlign: textAlign as any }),
        ...(borderRadius && { borderRadius: borderRadius === 'max' ? '9999px' : borderRadius }),
      }}
    >
      {children}
    </div>
  )
})
Flex.displayName = 'Flex'

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string
  margin?: string
  'margin-top'?: string
  'margin-bottom'?: string
  background?: string
  flex?: string
  width?: string
  height?: string
  'max-width'?: string
  'min-height'?: string
  display?: string
  'flex-direction'?: string
  'justify-content'?: string
  'align-items'?: string
  'border-width'?: string
  'border-color'?: string
  'flex-shrink'?: string
  overflow?: string
}

export const Div = forwardRef<HTMLDivElement, DivProps>(({
  className,
  children,
  style,
  ...props
}, ref) => {
  const padding = props.padding
  const margin = props.margin
  const marginTop = props['margin-top']
  const marginBottom = props['margin-bottom']
  const background = props.background
  const flex = props.flex
  const width = props.width
  const height = props.height
  const maxWidth = props['max-width']
  const minHeight = props['min-height']
  const display = props.display
  const flexDirection = props['flex-direction']
  const justifyContent = props['justify-content']
  const alignItems = props['align-items']
  const borderWidth = props['border-width']
  const borderColor = props['border-color']
  const flexShrink = props['flex-shrink']
  const overflow = props.overflow

  const paddingMap: Record<string, string> = {
    'xs': 'p-1',
    's': 'p-2',
    'm': 'p-4',
    'l': 'p-6',
    'xl': 'p-8',
    '2xl': 'p-10',
  }

  return (
    <div
      ref={ref}
      className={cn(
        padding && paddingMap[padding],
        flex === '1' && 'flex-1',
        width === '100%' && 'w-full',
        display === 'flex' && 'flex',
        flexDirection === 'column' && 'flex-col',
        justifyContent === 'center' && 'justify-center',
        alignItems === 'center' && 'items-center',
        overflow === 'hidden' && 'overflow-hidden',
        className
      )}
      style={{
        ...style,
        ...(margin === '0 auto' && { margin: '0 auto' }),
        ...(marginTop === 'auto' && { marginTop: 'auto' }),
        ...(marginBottom && { marginBottom: marginBottom === 'l' ? '1.5rem' : marginBottom === 'xl' ? '2rem' : marginBottom }),
        ...(background && { background }),
        ...(height && { height }),
        ...(maxWidth && { maxWidth }),
        ...(minHeight && { minHeight }),
        ...(borderWidth && { borderWidth }),
        ...(borderColor && { borderColor }),
        ...(flexShrink && { flexShrink: parseInt(flexShrink) }),
      }}
    >
      {children}
    </div>
  )
})
Div.displayName = 'Div'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: string
  gap?: string
  padding?: string
  'margin-bottom'?: string
  width?: string
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(({
  className,
  children,
  columns = '1',
  gap = 'm',
  padding,
  style,
  ...props
}, ref) => {
  const marginBottom = props['margin-bottom']
  const width = props.width

  const gapMap: Record<string, string> = {
    'xs': 'gap-1',
    's': 'gap-2',
    'm': 'gap-4',
    'l': 'gap-6',
    'xl': 'gap-8',
  }

  const paddingMap: Record<string, string> = {
    'xs': 'p-1',
    's': 'p-2',
    'm': 'p-4',
    'l': 'p-6',
    'xl': 'p-8',
  }

  // Parse responsive columns like "1; m{2}; l{4}"
  const parseColumns = (cols: string) => {
    if (cols.includes('{')) {
      // Has responsive breakpoints
      const parts = cols.split(';').map(p => p.trim())
      let classes = 'grid-cols-1'
      parts.forEach(part => {
        if (part.startsWith('m{')) {
          const num = part.match(/m\{(\d+)\}/)?.[1]
          if (num) classes += ` md:grid-cols-${num}`
        } else if (part.startsWith('l{')) {
          const num = part.match(/l\{(\d+)\}/)?.[1]
          if (num) classes += ` lg:grid-cols-${num}`
        } else if (!isNaN(parseInt(part))) {
          classes = `grid-cols-${part}`
        }
      })
      return classes
    }
    return `grid-cols-${cols}`
  }

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        parseColumns(columns),
        gapMap[gap] || 'gap-4',
        padding && paddingMap[padding],
        width === '100%' && 'w-full',
        className
      )}
      style={{
        ...style,
        ...(marginBottom && { marginBottom: marginBottom === 'xl' ? '2rem' : marginBottom === 'l' ? '1.5rem' : marginBottom }),
      }}
    >
      {children}
    </div>
  )
})
Grid.displayName = 'Grid'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'information' | 'notice' | 'positive' | 'negative'
  height?: string
  'max-width'?: string
  width?: string
  'margin-bottom'?: string
  overflow?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  className,
  children,
  padding = 'l',
  variant = 'primary',
  style,
  ...props
}, ref) => {
  const height = props.height
  const maxWidth = props['max-width']
  const width = props.width
  const marginBottom = props['margin-bottom']
  const overflow = props.overflow

  const paddingMap: Record<string, string> = {
    '0': 'p-0',
    'xs': 'p-1',
    's': 'p-2',
    'm': 'p-4',
    'l': 'p-6',
    'xl': 'p-8',
  }

  const variantClasses: Record<string, string> = {
    primary: 'bg-white border border-gray-200',
    secondary: 'bg-gray-50 border border-gray-200',
    tertiary: 'bg-gray-100 border border-gray-200',
    information: 'bg-blue-50 border border-blue-200',
    notice: 'bg-yellow-50 border border-yellow-200',
    positive: 'bg-green-50 border border-green-200',
    negative: 'bg-red-50 border border-red-200',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg shadow-sm',
        paddingMap[padding] || 'p-6',
        variantClasses[variant] || variantClasses.primary,
        height === '100%' && 'h-full',
        width === '100%' && 'w-full',
        overflow === 'hidden' && 'overflow-hidden',
        className
      )}
      style={{
        ...style,
        ...(maxWidth && { maxWidth }),
        ...(marginBottom && { marginBottom: marginBottom === 'xl' ? '2rem' : marginBottom === 'l' ? '1.5rem' : marginBottom === 'm' ? '1rem' : marginBottom }),
      }}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'

export const Divider = forwardRef<HTMLHRElement, HTMLAttributes<HTMLHRElement> & { opacity?: string }>(({
  className,
  opacity,
  ...props
}, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-gray-200 my-4', className)}
    style={{ opacity: opacity ? parseFloat(opacity) : 1 }}
    {...props}
  />
))
Divider.displayName = 'Divider'

// ============================================================================
// TEXT COMPONENTS
// ============================================================================

interface TextProps extends HTMLAttributes<HTMLElement> {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'
  font?: string
  'font-size'?: string
  'font-weight'?: string
  color?: string
  'text-align'?: string
  'margin-bottom'?: string
  'margin-top'?: string
  slot?: string
}

export const Text = forwardRef<HTMLElement, TextProps>(({
  tag = 'span',
  className,
  children,
  font,
  color,
  style,
  ...props
}, ref) => {
  const fontSize = props['font-size']
  const fontWeight = props['font-weight']
  const textAlign = props['text-align']
  const marginBottom = props['margin-bottom']
  const marginTop = props['margin-top']

  const fontClasses: Record<string, string> = {
    'heading-2xl': 'text-4xl font-bold',
    'heading-xl': 'text-3xl font-bold',
    'heading-l': 'text-2xl font-bold',
    'heading-m': 'text-xl font-semibold',
    'heading-s': 'text-lg font-semibold',
    'heading-xs': 'text-base font-semibold',
    'body-regular-l': 'text-lg',
    'body-regular-m': 'text-base',
    'body-regular-s': 'text-sm',
    'body-medium-m': 'text-base font-medium',
    'detail-regular-s': 'text-xs',
  }

  const fontSizeClasses: Record<string, string> = {
    'heading-xl': 'text-3xl font-bold',
    'heading-l': 'text-2xl font-bold',
    'heading-s': 'text-lg font-semibold',
    'body-l': 'text-lg',
    'body-s': 'text-sm',
  }

  const colorClasses: Record<string, string> = {
    'neutral-01': 'text-gray-900',
    'neutral-02': 'text-gray-600',
    'brand-01': 'text-blue-600',
    'inversed': 'text-white',
    'negative-01': 'text-red-600',
    'positive-01': 'text-green-600',
    'secondary': 'text-gray-500',
  }

  const Component = tag as any

  return (
    <Component
      ref={ref}
      className={cn(
        font && fontClasses[font],
        fontSize && fontSizeClasses[fontSize],
        fontWeight === 'book' && 'font-normal',
        color && colorClasses[color],
        textAlign === 'center' && 'text-center',
        textAlign === 'start' && 'text-left',
        className
      )}
      style={{
        ...style,
        ...(marginBottom && { marginBottom: marginBottom === 'l' ? '1.5rem' : marginBottom === 'm' ? '1rem' : marginBottom === 's' ? '0.5rem' : marginBottom === 'xs' ? '0.25rem' : marginBottom }),
        ...(marginTop && { marginTop: marginTop === 's' ? '0.5rem' : marginTop === 'xs' ? '0.25rem' : marginTop }),
      }}
    >
      {children}
    </Component>
  )
})
Text.displayName = 'Text'

// ============================================================================
// FORM COMPONENTS
// ============================================================================

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onInput'> {
  label?: string
  onInput?: (e: Event) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  onInput,
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        className
      )}
      onInput={onInput as any}
      {...props}
    />
  </div>
))
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  label,
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        'min-h-[100px]',
        className
      )}
      {...props}
    />
  </div>
))
Textarea.displayName = 'Textarea'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children?: React.ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  children,
  ...props
}, ref) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
        className
      )}
      {...props}
    />
    {children}
  </label>
))
Checkbox.displayName = 'Checkbox'

// ============================================================================
// ACTION COMPONENTS
// ============================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rank?: 'primary' | 'secondary' | 'tertiary'
  variant?: 'neutral' | 'positive' | 'negative' | 'notice' | 'brand'
  size?: 'small' | 'medium' | 'large'
  width?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  rank = 'primary',
  variant,
  size = 'medium',
  disabled,
  width,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const sizeClasses: Record<string, string> = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const rankClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100',
    tertiary: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500 disabled:text-gray-400',
  }

  const variantClasses: Record<string, string> = {
    neutral: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    positive: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    negative: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    notice: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
    brand: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variant ? variantClasses[variant] : rankClasses[rank],
        disabled && 'cursor-not-allowed opacity-50',
        width === '100%' && 'w-full',
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

interface LinkComponentProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  'text-decoration'?: string
}

export const LinkComponent = forwardRef<HTMLAnchorElement, LinkComponentProps>(({
  className,
  children,
  'text-decoration': textDecoration,
  ...props
}, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        'text-blue-600 hover:text-blue-800',
        textDecoration === 'none' && 'no-underline',
        textDecoration === 'hover:underline' && 'hover:underline',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
})
LinkComponent.displayName = 'LinkComponent'

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'positive' | 'negative' | 'notice' | 'information'
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({
  className,
  children,
  variant = 'information',
  ...props
}, ref) => {
  const variantClasses: Record<string, string> = {
    positive: 'bg-green-50 border-green-200 text-green-800',
    negative: 'bg-red-50 border-red-200 text-red-800',
    notice: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    information: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'p-4 rounded-md border',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
Alert.displayName = 'Alert'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'positive' | 'negative' | 'notice' | 'information'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  className,
  children,
  variant = 'information',
  ...props
}, ref) => {
  const variantClasses: Record<string, string> = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    notice: 'bg-yellow-100 text-yellow-800',
    information: 'bg-blue-100 text-blue-800',
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
  <div
    ref={ref}
    className={cn(
      'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
      className
    )}
    {...props}
  />
))
Spinner.displayName = 'Spinner'

// ============================================================================
// OVERLAY COMPONENTS
// ============================================================================

interface DialogProps extends HTMLAttributes<HTMLDialogElement> {
  heading?: string
  open?: boolean
  onClose?: () => void
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(({
  className,
  children,
  heading,
  open,
  onClose,
  ...props
}, ref) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const combinedRef = ref || dialogRef

  React.useImperativeHandle(ref, () => ({
    ...dialogRef.current!,
    show: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }))

  return (
    <dialog
      ref={dialogRef as any}
      className={cn(
        'fixed inset-0 z-50 overflow-y-auto',
        'bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto my-8',
        'backdrop:bg-black backdrop:bg-opacity-50',
        className
      )}
      {...props}
    >
      {heading && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{heading}</h2>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </dialog>
  )
})
Dialog.displayName = 'Dialog'

// ============================================================================
// THEME COMPONENT (wrapper that just passes children through)
// ============================================================================

interface ThemeProps {
  children: React.ReactNode
  'color-scheme'?: 'light' | 'dark'
  'design-version'?: string
}

export const Theme: React.FC<ThemeProps> = ({ children, 'color-scheme': colorScheme }) => {
  return (
    <div className={colorScheme === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  )
}

// ============================================================================
// ADDITIONAL COMPONENT ALIASES
// ============================================================================

export const RadioGroup = Checkbox // Placeholder
export const Select = Input // Placeholder
export const Dropdown = Input // Placeholder
export const Datepicker = Input // Placeholder
export const Fab = Button
export const MenuButton = Button
export const FilterChips = Div
export const FilterChip = Badge
export const SegmentedControl = Div
export const Signal = Badge
export const Coachmark = Div
export const Popover = Dialog
export const ContextMenu = Div
export const Breadcrumbs = Div
export const FormSummary = Div
export const GroupedList = Div
export const Details = Div
export const Img = 'img' as any
export const Video = 'video' as any
export const RichText = Div
export const Mask = Div
export const Blur = Div
export const FormattedNumber = Text
export const FormattedDate = Text
export const FormattedAccount = Text
export const SensitiveNumber = Text
export const SensitiveDate = Text
export const SensitiveAccount = Text
export const Calendar = Div
