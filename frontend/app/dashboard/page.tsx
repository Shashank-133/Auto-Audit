"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentAudits } from "@/components/dashboard/RecentAudits";
import { Button } from "@/components/shared/Button";
import { useAuditHistoryStore, useAuthStore } from "@/lib/store";
import { formatINRShort } from "@/lib/utils";

export default function DashboardPage() {
  const audits = useAuditHistoryStore((s) => s.audits);
  const user = useAuthStore((s) => s.user);

  const metrics = useMemo(() => {
    const processed = audits.length;
    let violations = 0;
    let fixed = 0;
    let escalated = 0;
    let amountAudited = 0;
    for (const a of audits) {
      const m = a.response.audit_report.metrics;
      violations += m.total_violations ?? 0;
      fixed += m.fixed_count ?? 0;
      escalated += m.escalated_count ?? 0;
      amountAudited += a.response.audit_report.total_amount ?? 0;
    }
    return { processed, violations, fixed, escalated, amountAudited };
  }, [audits]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">
            Welcome{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-[#5A6C7D]">
            Here&apos;s a snapshot of your recent audit activity.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button size="md">Upload New →</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Processed"
          value={metrics.processed}
          icon={FileText}
          tone="default"
          hint="Invoices audited"
        />
        <StatsCard
          label="Violations"
          value={metrics.violations}
          icon={AlertTriangle}
          tone="warning"
          hint="Detected total"
        />
        <StatsCard
          label="Auto-Fixed"
          value={metrics.fixed}
          icon={CheckCircle2}
          tone="success"
          hint="Resolved without humans"
        />
        <StatsCard
          label="Escalated"
          value={metrics.escalated}
          icon={AlertCircle}
          tone="danger"
          hint="Need CFO review"
        />
      </div>

      {audits.length > 0 && (
        <div className="rounded-xl border border-[#BFDDF0] bg-gradient-to-r from-[#FFF9D2]/40 to-[#BFDDF0]/30 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white">
              <TrendingUp className="h-5 w-5 text-[#5BA3DC]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2C3E50]">
                {formatINRShort(metrics.amountAudited)} audited across {metrics.processed}{" "}
                invoice{metrics.processed === 1 ? "" : "s"}
              </p>
              <p className="text-xs text-[#5A6C7D]">
                {metrics.violations > 0
                  ? `AI fixed ${metrics.fixed} of ${metrics.violations} violations automatically.`
                  : "All audits clean — no violations detected."}
              </p>
            </div>
          </div>
        </div>
      )}

      <RecentAudits audits={audits} />
    </div>
  );
}
