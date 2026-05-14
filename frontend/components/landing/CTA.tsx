"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="border-y border-[var(--cream-border)] bg-[var(--cream-bg-2)]/70 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl"
        >
          Ready to save{" "}
          <span className="font-serif-italic">200 hours</span> this quarter?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-lg text-[var(--ink-muted)]"
        >
          Start your free audit — no credit card, no commitment. Watch the agents work in real time.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <button
            onClick={onGetStarted}
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-[var(--ink)] pl-7 pr-2 text-base font-medium text-white transition-all hover:bg-black hover:shadow-xl"
          >
            Get Started Free
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--ink)] transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
