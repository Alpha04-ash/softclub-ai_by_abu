import React from 'react';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
};

export default function Button({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  isLoading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const base = 'ui-btn focus-ring font-semibold transition-all duration-150';
  
  const variantClass = {
    primary: 'bg-primary text-white shadow-lg hover:bg-primary-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-surface text-foreground border border-border hover:border-primary/50 hover:bg-surface/80 hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent text-foreground border border-border/60 hover:border-primary hover:text-primary hover:bg-primary/5',
    neutral: 'bg-surface/50 text-foreground border border-border/40 hover:bg-surface/70'
  }[variant];

  const sizeClass = {
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2.5 rounded-md',
    lg: 'text-base px-6 py-3 rounded-md'
  }[size];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cx(
        base,
        variantClass,
        sizeClass,
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
