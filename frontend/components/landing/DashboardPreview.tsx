"use client";

import { CheckCircle2, AlertTriangle, FileText, ShieldCheck } from "lucide-react";

export function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl bg-[#FAF8F3]">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-[#E8DFCB] bg-white px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E89B9B]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#E8C58A]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#9CC9A4]" />
        </div>
        <div className="rounded-full border border-[#E8DFCB] bg-[#FAF5EA] px-3 py-0.5 text-xs text-[#9A938A]">
          app.autoaudit.ai/dashboard
        </div>
        <div className="w-12" />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 p-5 sm:grid-cols-4">
        {[
          { label: "Processed", value: "156", tone: "text-[#1A1A1A]" },
          { label: "Violations", value: "12", tone: "text-[#C66A0D]" },
          { label: "Auto-Fixed", value: "9", tone: "text-[#3A8C12]" },
          { label: "Escalated", value: "3", tone: "text-[#B23830]" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-[#E8DFCB] bg-white p-3"
          >
            <p className="text-[11px] uppercase tracking-wider text-[#9A938A]">
              {s.label}
            </p>
            <p className={`mt-1 text-2xl font-bold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent audits table */}
      <div className="px-5 pb-5">
        <div className="overflow-hidden rounded-lg border border-[#E8DFCB]">
          <div className="border-b border-[#E8DFCB] bg-white px-4 py-2.5">
            <p className="text-sm font-semibold text-[#1A1A1A]">Recent Audits</p>
          </div>
          {[
            {
              num: "#001",
              vendor: "TechSupplies Pvt Ltd",
              amount: "₹3,00,900",
              icon: <CheckCircle2 className="h-4 w-4 text-[#3A8C12]" />,
              status: "Auto-Fixed",
              tone: "text-[#3A8C12]",
            },
            {
              num: "#002",
              vendor: "Office Mart",
              amount: "₹82,500",
              icon: <ShieldCheck className="h-4 w-4 text-[#3A8C12]" />,
              status: "GST Corrected",
              tone: "text-[#3A8C12]",
            },
            {
              num: "#003",
              vendor: "Dell India",
              amount: "₹5,00,000",
              icon: <AlertTriangle className="h-4 w-4 text-[#C66A0D]" />,
              status: "Escalated",
              tone: "text-[#C66A0D]",
            },
          ].map((row, i) => (
            <div
              key={row.num}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                i % 2 === 0 ? "bg-white" : "bg-[#FAF5EA]/60"
              }`}
            >
              <FileText className="h-4 w-4 text-[#9A938A]" />
              <span className="font-medium text-[#1A1A1A] w-12">{row.num}</span>
              <span className="flex-1 text-[#6B655C]">{row.vendor}</span>
              <span className="font-semibold text-[#1A1A1A]">{row.amount}</span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${row.tone}`}>
                {row.icon}
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
