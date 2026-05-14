"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#2C3E50]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-13 w-full rounded-lg border bg-white px-4 text-[15px] text-[#2C3E50] placeholder:text-[#8E9BAC] transition-all duration-200",
            "focus:outline-none focus:bg-[#FFEBCC]/40 focus:border-[#8CC0EB]",
            error
              ? "border-[#F5222D] focus:border-[#F5222D]"
              : "border-[#E5EAF0]",
            className
          )}
          style={{ height: "52px" }}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-err`} className="text-xs text-[#F5222D]">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-[#8E9BAC]">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
