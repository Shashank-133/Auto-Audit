"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  precision?: number;
}

const STATS: Stat[] = [
  { value: 98, suffix: "%", label: "Accuracy" },
  { value: 75, suffix: "%", label: "Auto-Fix Rate" },
  { value: 84, suffix: "%", label: "Faster" },
  { value: 14.5, prefix: "₹", suffix: "L", label: "Saved / yr", precision: 1 },
];

function useCountUp(target: number, duration = 1200, run = false, precision = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    const animate = (t: number) => {
      const elapsed = t - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, run]);

  return value.toFixed(precision);
}

function StatCard({ stat, run }: { stat: Stat; run: boolean }) {
  const display = useCountUp(stat.value, 1400, run, stat.precision ?? 0);
  return (
    <div className="rounded-2xl border border-[var(--cream-border-2)] bg-white px-6 py-10 text-center">
      <p className="text-5xl tracking-tight text-[var(--ink)] sm:text-6xl">
        <span className="font-bold">
          {stat.prefix}
          {display}
        </span>
        <span className="font-serif-italic ml-0.5">{stat.suffix}</span>
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
        {stat.label}
      </p>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" className="cream-bg py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            By the numbers
          </p>
          <h2 className="mt-4 text-4xl tracking-tight text-[var(--ink)] sm:text-5xl">
            Real results from <span className="font-serif-italic">real invoice batches.</span>
          </h2>
          <p className="mt-5 text-lg text-[var(--ink-muted)]">
            No marketing math. These are the numbers that come out of the pipeline.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <StatCard key={s.label} stat={s} run={inView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
