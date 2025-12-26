"use client"
import React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
}

export default function GlassButton({ variant = "primary", className = "", children, ...props }: Props) {
  const base = "ui-btn px-4 py-2 rounded-md font-semibold"
  const variants: Record<string, string> = {
    primary: "ui-btn primary",
    ghost: "ui-btn ghost",
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
