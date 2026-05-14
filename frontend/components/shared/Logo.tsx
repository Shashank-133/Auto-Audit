import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-tight",
        className
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#8CC0EB] to-[#5BA3DC] shadow-sm">
        <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span className="text-xl logo-gradient">AutoAudit AI</span>
    </Link>
  );
}
