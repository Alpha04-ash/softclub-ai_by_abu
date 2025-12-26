import React from "react"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
}

export default function GlassCard({ title, children, className = "", ...props }: Props) {
  return (
    <div className={`ui-card glass p-6 ${className}`} {...props}>
      {title && <h3 className="hero-subtitle" style={{ marginBottom: '0.5rem' }}>{title}</h3>}
      <div>{children}</div>
    </div>
  )
}
