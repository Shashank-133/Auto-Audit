"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { DashboardPreview } from "./DashboardPreview";

interface HeroProps {
  onPrimary: () => void;
}

export function Hero({ onPrimary }: HeroProps) {
  return (
    <section className="cream-bg relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="warm-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Pill badge */}
          <motion.button
            onClick={onPrimary}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--cream-border-2)] bg-[var(--cream-bg)]/60 py-1.5 pl-5 pr-1.5 text-[13px] font-medium tracking-wide text-[var(--ink-2)] backdrop-blur transition-all hover:bg-white"
          >
            FOR FINANCE TEAMS PROCESSING &gt; 100 INVOICES / MONTH
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] text-white transition-transform group-hover:translate-x-0.5">
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </motion.button>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mt-10 text-[44px] leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl"
          >
            <span className="font-bold">Tomorrow&apos;s</span>{" "}
            <span className="font-serif-italic">Compliance Engine</span>
            <br />
            <span className="font-bold">Built Today.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[var(--ink-muted)]"
          >
            We build autonomous audit agents that detect GST errors, duplicates,
            and policy violations — and fix 75% of them while you sleep.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <button
              onClick={onPrimary}
              className="inline-flex h-12 items-center rounded-full bg-[var(--ink)] px-7 text-[15px] font-medium text-white transition-all hover:bg-black hover:shadow-lg"
            >
              Start Free Audit →
            </button>
            <button className="inline-flex h-12 items-center rounded-full border border-[var(--cream-border-2)] bg-white/60 px-7 text-[15px] font-medium text-[var(--ink-2)] transition-colors hover:bg-white">
              Watch 2-Min Demo
            </button>
          </motion.div>

          {/* Mini stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--ink-muted)]"
          >
            <StatPill value="98%" label="Accuracy" />
            <span className="hidden h-4 w-px bg-[var(--cream-border-2)] sm:block" />
            <StatPill value="75%" label="Auto-Fix" />
            <span className="hidden h-4 w-px bg-[var(--cream-border-2)] sm:block" />
            <StatPill value="₹14.5L" label="Saved / yr" />
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute inset-x-12 -bottom-4 h-16 rounded-full bg-[var(--ink)]/10 blur-2xl" />
          <div className="relative rounded-2xl border border-[var(--cream-border-2)] bg-white p-2 shadow-[0_30px_70px_-25px_rgba(26,26,26,0.25)]">
            <DashboardPreview />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-base font-semibold text-[var(--ink)]">{value}</span>
      <span>{label}</span>
    </span>
  );
}
