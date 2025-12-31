"use client"

import { cn } from '@/lib/utils'
import type * as React from "react"
import { useState } from "react"

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost" | "slim"
  size?: "default" | "sm" | "lg"
  onClick?: () => void
  type?: "button" | "submit"
  href?: string
  disabled?: boolean
}

export default function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  type = "button",
  href,
  disabled = false,
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-2.5",
    lg: "px-8 py-3 text-lg",
  }

  const variantClasses = {
    default: "bg-white text-black",
    outline: "border border-gray-300 bg-transparent",
    ghost: "bg-transparent",
    slim: "bg-white text-black px-6 py-2 text-sm",
  }

  const buttonContent = (
    <div
      className={cn(
        "relative inline-block rounded-xl overflow-visible group",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="relative">
        <div
          className={cn(
            "relative z-10 rounded-xl font-medium flex items-center justify-center",
            sizeClasses[size],
            variantClasses[variant],
            className,
          )}
        >
          {children}
        </div>

        <div
          className={cn(
            "absolute inset-0 z-10 rounded-xl font-medium flex items-center justify-center",
            sizeClasses[size],
            variantClasses[variant],
            className,
          )}
        >
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-block border-0 bg-transparent p-0 cursor-pointer">
      {buttonContent}
    </button>
  )
}

export type { AnimatedButtonProps }

