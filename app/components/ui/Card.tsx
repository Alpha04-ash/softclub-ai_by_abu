import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: string;
};

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div {...props} className={`ui-card p-6 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
