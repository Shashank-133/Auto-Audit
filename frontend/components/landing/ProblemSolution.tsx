"use client";

import { motion } from "framer-motion";
import { Clock, AlertTriangle, IndianRupee, Zap, CheckCircle2, Sparkles } from "lucide-react";

export function ProblemSolution() {
  return (
    <section id="features" className="cream-bg py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            The Problem · The Solution
          </p>
          <h2 className="mt-4 text-4xl tracking-tight text-[var(--ink)] sm:text-5xl">
            Manual audits are{" "}
            <span className="font-serif-italic">expensive theatre.</span>
          </h2>
          <p className="mt-5 text-lg text-[var(--ink-muted)]">
            Two accountants, ninety hours, sixty-percent catch rate.
            And the penalties still arrive.
          </p>
        </div>

        {/* Problem */}
        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <ProblemPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block rounded-full border border-[var(--cream-border-2)] bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--ink-muted)]">
              Before AutoAudit
            </span>
            <h3 className="mt-4 text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
              Every CFO is bleeding{" "}
              <span className="font-serif-italic">hours, money, and trust.</span>
            </h3>
            <ul className="mt-8 space-y-5 text-[var(--ink-muted)]">
              <Bullet
                icon={<Clock className="h-5 w-5" />}
                title="200+ hours wasted quarterly"
                body="Two accountants and a manager combing through invoices line by line."
              />
              <Bullet
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Only 60% of errors caught"
                body="GST mismatches, duplicate payments, and over-limit invoices slip through every cycle."
              />
              <Bullet
                icon={<IndianRupee className="h-5 w-5" />}
                title="₹12L GST penalties · ₹3L duplicate payments"
                body="Real incidents at Bangalore and Mumbai companies in the last fiscal year."
              />
            </ul>
          </motion.div>
        </div>

        <div className="my-20 h-px bg-gradient-to-r from-transparent via-[var(--cream-border-2)] to-transparent" />

        {/* Solution */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block rounded-full border border-[var(--ink)]/20 bg-[var(--ink)]/4 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--ink)]">
              After AutoAudit
            </span>
            <h3 className="mt-4 text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
              Five agents <span className="font-serif-italic">catch, investigate, fix</span> —{" "}
              autonomously.
            </h3>
            <ul className="mt-8 space-y-5 text-[var(--ink-muted)]">
              <Bullet
                icon={<Zap className="h-5 w-5" />}
                title="2-minute processing for 600 invoices"
                body="Five specialised agents work in parallel via LangGraph orchestration."
              />
              <Bullet
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="98% accuracy · 75% auto-remediation"
                body="Risk-gated fixes: low-risk auto-applied, high-risk goes to the CFO with full evidence."
              />
              <Bullet
                icon={<Sparkles className="h-5 w-5" />}
                title="₹14.5L saved — zero ops cost"
                body="Runs on free-tier infrastructure. ROI from day one."
              />
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <SolutionPanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[var(--cream-border-2)] bg-white text-[var(--ink)]">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-[var(--ink)]">{title}</p>
        <p className="mt-1 text-sm leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function ProblemPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--cream-border-2)] bg-white p-6">
      <div className="absolute top-4 right-4 text-[11px] font-semibold uppercase tracking-widest text-[var(--ink-light)]">
        Q1 / Without AI
      </div>
      <div className="space-y-3 pt-8">
        <Row
          dot="bg-[#C66A0D]"
          label="Q1 GST audit"
          sub="3 invoices missed"
          right="-₹12L"
          tone="text-[#B23830]"
        />
        <Row
          dot="bg-[#9A938A]"
          label="Manual review"
          sub="90 hours / quarter"
          right="-₹53K"
          tone="text-[#C66A0D]"
        />
        <Row
          dot="bg-[#B23830]"
          label="Duplicate paid"
          sub="Vendor ABC-2034"
          right="-₹3L"
          tone="text-[#B23830]"
        />
      </div>
    </div>
  );
}

function SolutionPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--ink)]/15 bg-[var(--ink)] p-6 text-white">
      <div className="absolute top-4 right-4 text-[11px] font-semibold uppercase tracking-widest text-white/50">
        Q1 / With AutoAudit
      </div>
      <div className="space-y-3 pt-8">
        <RowDark
          label="GST corrected"
          sub="28% → 18% (Electronics)"
          right="+₹13.5K"
        />
        <RowDark
          label="Auto-Audit run"
          sub="600 invoices in 2m 13s"
          right="100%"
        />
        <RowDark
          label="Saved this year"
          sub="Audits + GST + duplicates"
          right="+₹14.5L"
        />
      </div>
    </div>
  );
}

function Row({
  dot,
  label,
  sub,
  right,
  tone,
}: {
  dot: string;
  label: string;
  sub: string;
  right: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--cream-border)] bg-[var(--cream-bg)] p-4">
      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--ink)]">{label}</p>
        <p className="text-xs text-[var(--ink-muted)]">{sub}</p>
      </div>
      <span className={`font-bold ${tone}`}>{right}</span>
    </div>
  );
}

function RowDark({
  label,
  sub,
  right,
}: {
  label: string;
  sub: string;
  right: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#9CC9A4]" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/60">{sub}</p>
      </div>
      <span className="font-bold text-[#9CC9A4]">{right}</span>
    </div>
  );
}
