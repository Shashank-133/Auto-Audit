"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Inbox } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { formatINR, formatDate } from "@/lib/utils";
import type { AuditHistoryEntry } from "@/lib/store";

const STATUS_TONE = {
  CLEAN:           { tone: "success", label: "Clean" },
  FIXED:           { tone: "success", label: "Auto-Fixed" },
  PARTIALLY_FIXED: { tone: "warning", label: "Partial" },
  ESCALATED:       { tone: "danger",  label: "Escalated" },
} as const;

export function RecentAudits({ audits }: { audits: AuditHistoryEntry[] }) {
  if (audits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#E5EAF0] bg-white p-12 text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FAFB]">
          <Inbox className="h-6 w-6 text-[#8E9BAC]" />
        </div>
        <h3 className="text-lg font-semibold text-[#2C3E50]">No audits yet</h3>
        <p className="mt-1 text-sm text-[#5A6C7D]">
          Upload your first invoice to see results here.
        </p>
        <Link href="/dashboard/upload">
          <Button className="mt-5">Upload Invoice →</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5EAF0] bg-white">
      <div className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4">
        <h3 className="text-base font-semibold text-[#2C3E50]">Recent Audits</h3>
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#5BA3DC] hover:text-[#2C3E50]"
        >
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-[#E5EAF0] bg-[#F8FAFB] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#8E9BAC]">
        <span className="col-span-1">#</span>
        <span className="col-span-4">Vendor</span>
        <span className="col-span-2">Invoice</span>
        <span className="col-span-2">Date</span>
        <span className="col-span-2 text-right">Amount</span>
        <span className="col-span-1 text-right">Status</span>
      </div>
      <ul>
        {audits.slice(0, 8).map((entry, i) => {
          const r = entry.response.audit_report;
          const tone = STATUS_TONE[r.audit_status] ?? STATUS_TONE.CLEAN;
          return (
            <li
              key={entry.id}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-5 py-3 text-sm transition-colors hover:bg-[#FFF9D2]/30 ${
                i % 2 === 0 ? "bg-white" : "bg-[#F8FAFB]/60"
              }`}
            >
              <span className="hidden sm:block col-span-1 text-[#8E9BAC]">{i + 1}</span>
              <span className="col-span-4 flex items-center gap-2 font-medium text-[#2C3E50]">
                <FileText className="h-4 w-4 text-[#8E9BAC]" />
                <span className="truncate">{r.vendor_name || entry.filename}</span>
              </span>
              <span className="col-span-2 text-[#5A6C7D]">{r.invoice_number || "—"}</span>
              <span className="col-span-2 text-[#5A6C7D]">{r.invoice_date ? formatDate(r.invoice_date) : "—"}</span>
              <span className="col-span-2 text-right font-semibold text-[#2C3E50]">
                {formatINR(r.total_amount)}
              </span>
              <span className="col-span-1 flex justify-end">
                <Badge tone={tone.tone}>{tone.label}</Badge>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
