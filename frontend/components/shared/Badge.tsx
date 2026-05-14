import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      tone: {
        success: "bg-[#52C41A]/12 text-[#3a8c12] border border-[#52C41A]/30",
        warning: "bg-[#FA8C16]/12 text-[#c66a0d] border border-[#FA8C16]/30",
        danger:  "bg-[#F5222D]/10 text-[#cf1322] border border-[#F5222D]/30",
        info:    "bg-[#1890FF]/10 text-[#0c6dc7] border border-[#1890FF]/30",
        neutral: "bg-[#F8FAFB] text-[#5A6C7D] border border-[#E5EAF0]",
        accent:  "bg-[#BFDDF0]/40 text-[#2C3E50] border border-[#BFDDF0]",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, className }))} {...props} />
  );
}
