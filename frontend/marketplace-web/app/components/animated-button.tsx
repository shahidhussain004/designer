"use client"

import type * as React from "react"
import { useState } from "react"
import { cn } from "../../lib/utils"

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
      {/* Rainbow border on hover */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)",
          backgroundSize: "400% 400%",
          animation: isHovered ? "gradient-shift 2s linear infinite" : undefined,
        }}
      />

      {/* Button container with 3D transform */}
      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
          transform: isHovered ? "rotateX(-90deg)" : "rotateX(0deg)",
        }}
      >
        {/* Front face */}
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
        
        {/* Back face */}
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
      
      {/* Keyframe animation style */}
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
