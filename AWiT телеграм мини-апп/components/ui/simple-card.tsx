import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "rounded-lg border bg-card text-card-foreground shadow-sm";
    
    return (
      <div
        ref={ref}
        className={`${baseClasses} ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

export { Card };