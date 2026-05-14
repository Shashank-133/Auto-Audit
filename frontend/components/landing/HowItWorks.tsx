"use client";

import { motion } from "framer-motion";
import { UploadCloud, ScanLine, Wrench, FileText, UserCheck } from "lucide-react";

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload PDFs",
    body: "Drag and drop invoice PDFs. Up to 100 files at once.",
  },
  {
    icon: ScanLine,
    title: "AI Detects",
    body: "Five agents scan for GST errors, duplicates, and policy violations.",
  },
  {
    icon: Wrench,
    title: "Auto-Remediate",
    body: "75% of violations fixed automatically — with rollback safety.",
  },
  {
    icon: FileText,
    title: "Audit Trail",
    body: "Every action logged. Compliance-ready report on demand.",
  },
  {
    icon: UserCheck,
    title: "CFO Approval",
    body: "Only the 25% of high-risk cases reach a human — with full evidence.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-[var(--cream-border)] bg-[var(--cream-bg-2)]/60 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            How It Works
          </p>
          <h2 className="mt-4 text-4xl tracking-tight text-[var(--ink)] sm:text-5xl">
            Five agents.{" "}
            <span className="font-serif-italic">One workflow.</span> Zero manual work.
          </h2>
          <p className="mt-5 text-lg text-[var(--ink-muted)]">
            A LangGraph state machine orchestrates every step — auditable, debuggable, and fully transparent.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="card-hover relative rounded-2xl border border-[var(--cream-border-2)] bg-white p-6"
            >
              <div className="absolute -top-3 left-6 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--ink)] px-2 text-xs font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--cream-border-2)] bg-[var(--cream-bg)]">
                <step.icon className="h-6 w-6 text-[var(--ink)]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
