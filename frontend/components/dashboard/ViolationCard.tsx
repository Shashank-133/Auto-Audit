"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { cn, formatINR } from "@/lib/utils";
import type { Violation, RemediationLogEntry } from "@/lib/types";

interface ViolationCardProps {
  violation: Violation;
  remediation?: RemediationLogEntry;
  invoiceNumber: string;
  vendor: string;
}

const RULE_LABEL: Record<string, string> = {
  GST_MISMATCH: "GST Mismatch",
  OVER_LIMIT: "Over Policy Limit",
  DUPLICATE: "Duplicate Payment",
};

const SEVERITY_TONE = {
  LOW: "info",
  MEDIUM: "warning",
  HIGH: "warning",
  CRITICAL: "danger",
} as const;

export function ViolationCard({
  violation,
  remediation,
  invoiceNumber,
  vendor,
}: ViolationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = remediation?.status ?? "PENDING";
  const isFixed = status === "AUTO_FIXED";
  const isEscalated = status === "ESCALATED";
  const ruleLabel = RULE_LABEL[violation.rule] ?? violation.rule;
  const headIcon = isEscalated ? AlertCircle : AlertTriangle;
  const HeadIcon = headIcon;

  return (
    <div className="rounded-xl border border-[#E5EAF0] bg-white shadow-[0_1px_3px_rgba(44,62,80,0.06)]">
      <div className="flex items-start gap-4 p-6">
        <div
          className={cn(
            "grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg",
            isFixed
              ? "bg-[#52C41A]/12 text-[#52C41A]"
              : isEscalated
              ? "bg-[#F5222D]/10 text-[#F5222D]"
              : "bg-[#FA8C16]/12 text-[#FA8C16]"
          )}
        >
          <HeadIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#2C3E50]">
              Invoice {invoiceNumber} — {ruleLabel}
            </h3>
            <Badge tone={SEVERITY_TONE[violation.severity]}>
              {violation.severity}
            </Badge>
            {isFixed && (
              <Badge tone="success">
                <CheckCircle2 className="h-3 w-3" />
                Auto-Fixed
              </Badge>
            )}
            {isEscalated && (
              <Badge tone="danger">Escalated to CFO</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-[#5A6C7D]">
            Vendor: <span className="font-medium text-[#2C3E50]">{vendor}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#5A6C7D]">
            {violation.message}
          </p>

          <ViolationDetails violation={violation} remediation={remediation} />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expanded && "rotate-180"
                )}
              />
              {expanded ? "Hide details" : "View details"}
            </Button>
            {isEscalated && (
              <>
                <Button variant="success" size="sm">
                  Approve
                </Button>
                <Button variant="danger" size="sm">
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden border-t border-[#E5EAF0] bg-[#F8FAFB]"
          >
            <div className="space-y-3 p-6 text-sm">
              {violation.cause && (
                <DetailRow label="Root cause">{violation.cause}</DetailRow>
              )}
              {typeof violation.confidence === "number" && (
                <DetailRow label="LLM confidence">
                  {(violation.confidence * 100).toFixed(0)}%
                </DetailRow>
              )}
              {typeof violation.risk_score === "number" && (
                <DetailRow label="Risk score">
                  {violation.risk_score} / 10
                </DetailRow>
              )}
              {violation.action && (
                <DetailRow label="Recommended action">
                  {violation.action}
                </DetailRow>
              )}
              {remediation?.detail && (
                <DetailRow label="Remediation detail">
                  {remediation.detail}
                </DetailRow>
              )}
              {violation.rule === "GST_MISMATCH" &&
                violation.expected_gst != null &&
                violation.actual_gst != null && (
                  <DetailRow label="GST">
                    Expected {violation.expected_gst}% · Found{" "}
                    {violation.actual_gst}%
                  </DetailRow>
                )}
              {violation.rule === "OVER_LIMIT" &&
                violation.actual_amount != null &&
                violation.limit != null && (
                  <DetailRow label="Amount vs Limit">
                    {formatINR(violation.actual_amount)} vs{" "}
                    {formatINR(violation.limit)} (excess{" "}
                    {formatINR(violation.excess_amount ?? 0)})
                  </DetailRow>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ViolationDetails({
  violation,
  remediation,
}: {
  violation: Violation;
  remediation?: RemediationLogEntry;
}) {
  // Compact financial-impact line right below the message
  if (violation.rule === "GST_MISMATCH" && violation.expected_gst != null && violation.actual_gst != null) {
    const diff = (violation.actual_gst - violation.expected_gst).toFixed(0);
    return (
      <p className="mt-2 text-sm font-medium text-[#2C3E50]">
        GST rate {violation.actual_gst}% (expected {violation.expected_gst}%) —{" "}
        <span className="text-[#FA8C16]">{diff}pp difference</span>
        {remediation?.status === "AUTO_FIXED" && remediation.detail && (
          <span className="text-[#52C41A]"> · {remediation.detail}</span>
        )}
      </p>
    );
  }
  if (violation.rule === "OVER_LIMIT" && violation.actual_amount != null && violation.limit != null) {
    return (
      <p className="mt-2 text-sm font-medium text-[#2C3E50]">
        Total {formatINR(violation.actual_amount)} (limit{" "}
        {formatINR(violation.limit)}) —{" "}
        <span className="text-[#F5222D]">
          excess {formatINR(violation.excess_amount ?? 0)}
        </span>
      </p>
    );
  }
  return null;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <span className="w-44 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-[#8E9BAC]">
        {label}
      </span>
      <span className="text-[#2C3E50]">{children}</span>
    </div>
  );
}
