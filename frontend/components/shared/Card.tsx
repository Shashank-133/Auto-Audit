import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-[0_1px_3px_rgba(44,62,80,0.06)]",
          hover && "card-hover",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
