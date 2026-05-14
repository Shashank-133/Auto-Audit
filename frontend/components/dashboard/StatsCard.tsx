"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "default" | "warning" | "danger" | "success";
  hint?: string;
}

const TONE_BG: Record<NonNullable<StatsCardProps["tone"]>, string> = {
  default: "bg-[#BFDDF0]/40 text-[#5BA3DC]",
  warning: "bg-[#FA8C16]/12 text-[#FA8C16]",
  danger:  "bg-[#F5222D]/10 text-[#F5222D]",
  success: "bg-[#52C41A]/12 text-[#3a8c12]",
};

export function StatsCard({ label, value, icon: Icon, tone = "default", hint }: StatsCardProps) {
  return (
    <div className="card-hover rounded-xl border border-[#E5EAF0] bg-white p-5 shadow-[0_1px_3px_rgba(44,62,80,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#8E9BAC]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#2C3E50]">{value}</p>
          {hint && (
            <p className="mt-1 text-xs text-[#5A6C7D]">{hint}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("grid h-10 w-10 place-items-center rounded-lg", TONE_BG[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}
