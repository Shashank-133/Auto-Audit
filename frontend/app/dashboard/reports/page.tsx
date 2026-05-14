"use client";

import { useMemo, useState } from "react";
import {
  Download,
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Filter,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { ViolationCard } from "@/components/dashboard/ViolationCard";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { useAuditHistoryStore } from "@/lib/store";
import { formatDate, formatINR } from "@/lib/utils";
import type { AuditResponse, Violation, RemediationLogEntry } from "@/lib/types";

type FilterKind = "all" | "fixed" | "escalated";

export default function ReportsPage() {
  const audits = useAuditHistoryStore((s) => s.audits);
  const clearAudits = useAuditHistoryStore((s) => s.clearAudits);
  const [filter, setFilter] = useState<FilterKind>("all");

  const metrics = useMemo(() => {
    const processed = audits.length;
    let violations = 0;
    let fixed = 0;
    let escalated = 0;
    for (const a of audits) {
      violations += a.response.audit_report.metrics.total_violations;
      fixed += a.response.audit_report.metrics.fixed_count;
      escalated += a.response.audit_report.metrics.escalated_count;
    }
    return { processed, violations, fixed, escalated };
  }, [audits]);

  const flatViolations = useMemo(() => {
    const items: Array<{
      key: string;
      violation: Violation;
      remediation?: RemediationLogEntry;
      invoiceNumber: string;
      vendor: string;
      filename: string;
      uploadedAt: string;
    }> = [];

    for (const audit of audits) {
      const r = audit.response.audit_report;
      const remLog = r.remediation_summary?.log ?? [];
      const investigations = audit.response.investigations ?? [];

      for (let i = 0; i < investigations.length; i++) {
        const v = investigations[i];
        // Match remediation log by rule + line item
        const rem = remLog.find(
          (x) =>
            x.rule === v.rule && x.line_item_index === v.line_item_index
        );
        items.push({
          key: `${audit.id}-${i}`,
          violation: v,
          remediation: rem,
          invoiceNumber: r.invoice_number || audit.filename,
          vendor: r.vendor_name || "—",
          filename: audit.filename,
          uploadedAt: audit.uploadedAt,
        });
      }
    }
    return items;
  }, [audits]);

  const filtered = useMemo(() => {
    if (filter === "all") return flatViolations;
    if (filter === "fixed")
      return flatViolations.filter(
        (i) => i.remediation?.status === "AUTO_FIXED"
      );
    return flatViolations.filter(
      (i) => i.remediation?.status === "ESCALATED" || !i.remediation
    );
  }, [filter, flatViolations]);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(audits, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autoaudit-report-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Audit Results</h1>
          <p className="mt-1 text-sm text-[#5A6C7D]">
            Every violation detected — auto-fixed or escalated, with full evidence.
          </p>
        </div>
        <div className="flex gap-2">
          {audits.length > 0 && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                if (confirm("Clear all audit history? This cannot be undone."))
                  clearAudits();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={downloadJSON}
            disabled={audits.length === 0}
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Processed" value={metrics.processed} icon={FileText} />
        <StatsCard
          label="Violations"
          value={metrics.violations}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatsCard
          label="Auto-Fixed"
          value={metrics.fixed}
          icon={CheckCircle2}
          tone="success"
        />
        <StatsCard
          label="Escalated"
          value={metrics.escalated}
          icon={AlertCircle}
          tone="danger"
        />
      </div>

      {audits.length === 0 ? (
        <EmptyReports />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#5A6C7D]">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </span>
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All · {flatViolations.length}
            </FilterChip>
            <FilterChip
              active={filter === "fixed"}
              onClick={() => setFilter("fixed")}
            >
              Auto-Fixed · {metrics.fixed}
            </FilterChip>
            <FilterChip
              active={filter === "escalated"}
              onClick={() => setFilter("escalated")}
            >
              Escalated · {metrics.escalated}
            </FilterChip>
          </div>

          {flatViolations.length === 0 ? (
            <CleanState />
          ) : (
            <div className="space-y-4">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ViolationCard
                    violation={item.violation}
                    remediation={item.remediation}
                    invoiceNumber={item.invoiceNumber}
                    vendor={item.vendor}
                  />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <p className="rounded-lg border border-dashed border-[#E5EAF0] bg-white px-4 py-8 text-center text-sm text-[#8E9BAC]">
                  No violations match this filter.
                </p>
              )}
            </div>
          )}

          <ProcessedInvoicesTable audits={audits.map((a) => a.response)} />
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "bg-[#2C3E50] text-white"
          : "bg-white text-[#5A6C7D] border border-[#E5EAF0] hover:bg-[#F8FAFB]"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyReports() {
  return (
    <div className="rounded-xl border border-dashed border-[#E5EAF0] bg-white p-16 text-center">
      <FileText className="mx-auto h-10 w-10 text-[#BFDDF0]" />
      <h3 className="mt-4 text-lg font-semibold text-[#2C3E50]">
        No reports yet
      </h3>
      <p className="mt-1 text-sm text-[#5A6C7D]">
        Upload an invoice to generate your first audit report.
      </p>
    </div>
  );
}

function CleanState() {
  return (
    <div className="rounded-xl border border-[#52C41A]/30 bg-[#52C41A]/5 p-10 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-[#52C41A]" />
      <h3 className="mt-3 text-lg font-semibold text-[#2C3E50]">
        All clean — no violations detected
      </h3>
      <p className="mt-1 text-sm text-[#5A6C7D]">
        Every invoice in your batch passed compliance checks.
      </p>
    </div>
  );
}

function ProcessedInvoicesTable({ audits }: { audits: AuditResponse[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5EAF0] bg-white">
      <div className="border-b border-[#E5EAF0] px-5 py-4">
        <h3 className="text-base font-semibold text-[#2C3E50]">
          Processed Invoices
        </h3>
        <p className="text-xs text-[#8E9BAC]">All files in this session</p>
      </div>
      <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-[#E5EAF0] bg-[#F8FAFB] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#8E9BAC]">
        <span className="col-span-5">Filename</span>
        <span className="col-span-2">Invoice</span>
        <span className="col-span-2">Date</span>
        <span className="col-span-2 text-right">Amount</span>
        <span className="col-span-1 text-right">Status</span>
      </div>
      <ul>
        {audits.map((a, i) => {
          const r = a.audit_report;
          return (
            <li
              key={`${a.filename}-${i}`}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-5 py-3 text-sm ${
                i % 2 === 0 ? "bg-white" : "bg-[#F8FAFB]/60"
              }`}
            >
              <span className="col-span-5 flex items-center gap-2 text-[#2C3E50]">
                <FileText className="h-4 w-4 text-[#8E9BAC]" />
                <span className="truncate">{a.filename}</span>
              </span>
              <span className="col-span-2 text-[#5A6C7D]">
                {r.invoice_number || "—"}
              </span>
              <span className="col-span-2 text-[#5A6C7D]">
                {r.invoice_date ? formatDate(r.invoice_date) : "—"}
              </span>
              <span className="col-span-2 text-right font-semibold text-[#2C3E50]">
                {formatINR(r.total_amount)}
              </span>
              <span className="col-span-1 flex justify-end">
                <Badge
                  tone={
                    r.audit_status === "ESCALATED"
                      ? "danger"
                      : r.audit_status === "PARTIALLY_FIXED"
                      ? "warning"
                      : "success"
                  }
                >
                  {r.audit_status}
                </Badge>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
