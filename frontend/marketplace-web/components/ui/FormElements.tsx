/**
 * Form Components
 * ================
 * Textarea, Checkbox, Radio, and Switch components
 */

'use client';

import { cn } from '@/lib/design-system/utils';
import React, { forwardRef } from 'react';

// =============================================================================
// TEXTAREA
// =============================================================================

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Enable auto-resize */
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      autoResize = false,
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${textareaId}-helper`;

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
            {required && <span className="text-error-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId}
          aria-describedby={helperText || error ? helperId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          disabled={disabled}
          required={required}
          onInput={handleInput}
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-all duration-200',
            'text-secondary-900 placeholder:text-secondary-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'min-h-[120px] resize-y',
            error
              ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
              : 'border-secondary-300 hover:border-secondary-400',
            disabled && 'bg-secondary-50 text-secondary-500 cursor-not-allowed resize-none',
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          {...props}
        />

        {/* Helper text / Error */}
        {(helperText || error) && (
          <p
            id={helperId}
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-error-500' : 'text-secondary-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// =============================================================================
// CHECKBOX
// =============================================================================

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Indeterminate state */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, indeterminate, disabled, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Handle indeterminate state
    React.useEffect(() => {
      const checkbox = document.getElementById(checkboxId) as HTMLInputElement;
      if (checkbox) {
        checkbox.indeterminate = !!indeterminate;
      }
    }, [checkboxId, indeterminate]);

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className={cn(
              'peer w-5 h-5 rounded border-2 border-secondary-300',
              'appearance-none cursor-pointer transition-all duration-200',
              'checked:bg-primary-500 checked:border-primary-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'hover:border-primary-400',
              'disabled:cursor-not-allowed disabled:bg-secondary-100'
            )}
            {...props}
          />
          {/* Checkmark */}
          <svg
            className={cn(
              'absolute w-3 h-3 text-white pointer-events-none opacity-0',
              'peer-checked:opacity-100 transition-opacity'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={4}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {/* Indeterminate mark */}
          <span
            className={cn(
              'absolute w-2.5 h-0.5 bg-white pointer-events-none opacity-0',
              indeterminate && 'opacity-100'
            )}
          />
        </div>
        {(label || description) && (
          <div className="pt-0.5">
            {label && (
              <span className="text-sm font-medium text-secondary-900">{label}</span>
            )}
            {description && (
              <p className="text-sm text-secondary-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// =============================================================================
// RADIO
// =============================================================================

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, disabled, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          'flex items-start gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            disabled={disabled}
            className={cn(
              'peer w-5 h-5 rounded-full border-2 border-secondary-300',
              'appearance-none cursor-pointer transition-all duration-200',
              'checked:border-primary-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'hover:border-primary-400',
              'disabled:cursor-not-allowed disabled:bg-secondary-100'
            )}
            {...props}
          />
          {/* Radio dot */}
          <span
            className={cn(
              'absolute w-2.5 h-2.5 rounded-full bg-primary-500 pointer-events-none',
              'opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100',
              'transition-all duration-200'
            )}
          />
        </div>
        {(label || description) && (
          <div className="pt-0.5">
            {label && (
              <span className="text-sm font-medium text-secondary-900">{label}</span>
            )}
            {description && (
              <p className="text-sm text-secondary-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

// =============================================================================
// RADIO GROUP
// =============================================================================

export interface RadioGroupProps {
  /** Group name */
  name: string;
  /** Options */
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Label for the group */
  label?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
  label,
  error,
  disabled,
}) => {
  return (
    <fieldset className="w-full">
      {label && (
        <legend className="text-sm font-medium text-secondary-700 mb-3">
          {label}
        </legend>
      )}
      <div
        role="radiogroup"
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {options.map(option => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error-500">{error}</p>
      )}
    </fieldset>
  );
};

// =============================================================================
// SWITCH
// =============================================================================

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const switchSizes = {
  sm: {
    track: 'w-8 h-5',
    thumb: 'w-4 h-4',
    translate: 'translate-x-3',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = 'md', disabled, checked, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
    const sizes = switchSizes[size];

    return (
      <label
        htmlFor={switchId}
        className={cn(
          'inline-flex items-center gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-60',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={switchId}
            disabled={disabled}
            checked={checked}
            aria-checked={checked}
            className="sr-only peer"
            {...props}
          />
          {/* Track */}
          <div
            className={cn(
              'rounded-full transition-colors duration-200',
              'bg-secondary-300 peer-checked:bg-primary-500',
              'peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
              sizes.track
            )}
          />
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              'peer-checked:' + sizes.translate,
              sizes.thumb
            )}
          />
        </div>
        {(label || description) && (
          <div>
            {label && (
              <span className="text-sm font-medium text-secondary-900">{label}</span>
            )}
            {description && (
              <p className="text-sm text-secondary-500">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export { Textarea as default };

