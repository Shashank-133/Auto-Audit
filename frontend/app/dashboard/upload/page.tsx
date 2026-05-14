"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, FlaskConical } from "lucide-react";

import { UploadZone } from "@/components/dashboard/UploadZone";
import { AgentActivityLog } from "@/components/dashboard/AgentActivityLog";
import { Button } from "@/components/shared/Button";
import { useAuditHistoryStore } from "@/lib/store";
import { useWebSocket } from "@/lib/useWebSocket";
import {
  WS_URL,
  uploadInvoice,
  simulateOcrFailure,
  simulateApiTimeout,
  simulateBadFix,
  ApiError,
} from "@/lib/api";
import type { AgentLogEntry, AuditResponse, WsEvent } from "@/lib/types";

let _logCounter = 0;
const nextLogId = () => `log-${++_logCounter}-${Date.now()}`;

export default function UploadPage() {
  const router = useRouter();
  const addAudit = useAuditHistoryStore((s) => s.addAudit);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [results, setResults] = useState<AuditResponse[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addLog = useCallback(
    (entry: Omit<AgentLogEntry, "id">) => {
      setLogs((prev) => [...prev, { ...entry, id: nextLogId() }]);
    },
    []
  );

  const handleWsEvent = useCallback(
    (event: WsEvent | { type: "raw"; payload: string }) => {
      if (event.type === "log") {
        addLog({
          agent: event.agent,
          level: event.level,
          message: event.message,
          timestamp: event.timestamp ?? new Date().toISOString(),
        });
      } else if (event.type === "event") {
        // Pipeline lifecycle events — surface as System info
        addLog({
          agent: "System",
          level: "info",
          message: `Pipeline ${event.event}`,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [addLog]
  );

  const { status: wsStatus } = useWebSocket({
    url: WS_URL,
    onEvent: handleWsEvent,
    enabled: true,
  });

  const handleAdd = useCallback((incoming: File[]) => {
    setFiles((prev) => [...prev, ...incoming]);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const runSequentialUploads = async () => {
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);
    setErrorMsg(null);
    setResults([]);
    setProgress({ current: 0, total: files.length });

    addLog({
      agent: "System",
      level: "info",
      message: `Queuing ${files.length} invoice${files.length === 1 ? "" : "s"} for audit.`,
      timestamp: new Date().toISOString(),
    });

    const collected: AuditResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });
      addLog({
        agent: "System",
        level: "info",
        message: `Uploading ${file.name} (${i + 1}/${files.length})…`,
        timestamp: new Date().toISOString(),
      });

      try {
        const res = await uploadInvoice(file);
        collected.push(res);
        addAudit({
          id: `${Date.now()}-${i}`,
          filename: file.name,
          uploadedAt: new Date().toISOString(),
          response: res,
        });
        const status = res.audit_report.audit_status;
        const v = res.audit_report.metrics.total_violations;
        const fx = res.audit_report.metrics.fixed_count;
        addLog({
          agent: "Auditor",
          level: status === "ESCALATED" ? "warning" : "success",
          message: `${file.name} → ${status} · ${v} violation(s), ${fx} auto-fixed.`,
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        const msg =
          e instanceof ApiError
            ? `${e.status} — ${e.message}`
            : e instanceof Error
            ? e.message
            : "Upload failed";
        setErrorMsg(msg);
        addLog({
          agent: "System",
          level: "error",
          message: `Failed for ${file.name}: ${msg}`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    setResults(collected);
    setIsUploading(false);
    setProgress({ current: 0, total: 0 });

    addLog({
      agent: "System",
      level: collected.length > 0 ? "success" : "warning",
      message: `Batch complete: ${collected.length} of ${files.length} processed.`,
      timestamp: new Date().toISOString(),
    });
  };

  const runDemo = async (
    kind: "ocr" | "timeout" | "badfix",
    fn: () => Promise<unknown>
  ) => {
    setErrorMsg(null);
    addLog({
      agent: "System",
      level: "info",
      message: `Running demo scenario: ${kind}`,
      timestamp: new Date().toISOString(),
    });
    try {
      await fn();
      // Logs arrive over the WebSocket.
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Demo failed";
      setErrorMsg(msg);
    }
  };

  const goToReports = () => router.push("/dashboard/reports");
  const clearLogs = () => setLogs([]);
  const someResults = results.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#2C3E50]">Upload Invoices</h1>
        <p className="mt-1 text-sm text-[#5A6C7D]">
          Drop your PDFs and watch the agents work — extraction, compliance,
          investigation, and remediation in real time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-[0_1px_3px_rgba(44,62,80,0.06)]">
          <UploadZone
            files={files}
            onAdd={handleAdd}
            onRemove={handleRemove}
            disabled={isUploading}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#5A6C7D]">
              {isUploading ? (
                <span>
                  Auditing {progress.current} of {progress.total}…
                </span>
              ) : someResults ? (
                <span className="inline-flex items-center gap-1.5 text-[#3a8c12]">
                  <CheckCircle2 className="h-4 w-4" />
                  Audit complete — {results.length} report
                  {results.length === 1 ? "" : "s"} ready
                </span>
              ) : (
                <span>Ready when you are.</span>
              )}
            </div>

            <div className="flex gap-2">
              {someResults && !isUploading && (
                <Button variant="secondary" size="md" onClick={goToReports}>
                  View Reports
                </Button>
              )}
              <Button
                size="md"
                loading={isUploading}
                disabled={files.length === 0 || isUploading}
                onClick={runSequentialUploads}
              >
                {isUploading ? "Running audit…" : `Start Audit →`}
              </Button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 rounded-lg border border-[#F5222D]/30 bg-[#F5222D]/8 px-3 py-2 text-sm text-[#cf1322]">
              {errorMsg}
            </div>
          )}

          <DemoScenarios onRun={runDemo} disabled={isUploading} />
        </section>

        <section>
          <AgentActivityLog
            entries={logs}
            wsStatus={wsStatus}
            isRunning={isUploading}
            onClear={clearLogs}
          />
        </section>
      </div>

      {someResults && !isUploading && (
        <BatchSummary results={results} />
      )}
    </div>
  );
}

// ─── Demo scenarios card ─────────────────────────────────────────────────────

function DemoScenarios({
  onRun,
  disabled,
}: {
  onRun: (kind: "ocr" | "timeout" | "badfix", fn: () => Promise<unknown>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 rounded-lg border border-[#BFDDF0] bg-[#BFDDF0]/15 p-4">
      <div className="mb-3 flex items-center gap-2">
        <FlaskConical className="h-4 w-4 text-[#5BA3DC]" />
        <p className="text-sm font-semibold text-[#2C3E50]">
          Error Simulation Lab
        </p>
      </div>
      <p className="mb-3 text-xs text-[#5A6C7D]">
        See how the pipeline degrades gracefully. Each scenario streams a realistic log sequence over WebSocket.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => onRun("ocr", simulateOcrFailure)}
        >
          OCR Failure
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => onRun("timeout", simulateApiTimeout)}
        >
          API Timeout
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => onRun("badfix", simulateBadFix)}
        >
          Bad Fix / Escalate
        </Button>
      </div>
    </div>
  );
}

// ─── Batch summary card after a run ──────────────────────────────────────────

function BatchSummary({ results }: { results: AuditResponse[] }) {
  const totals = results.reduce(
    (acc, r) => {
      acc.violations += r.audit_report.metrics.total_violations;
      acc.fixed += r.audit_report.metrics.fixed_count;
      acc.escalated += r.audit_report.metrics.escalated_count;
      acc.totalAmount += r.audit_report.total_amount;
      return acc;
    },
    { violations: 0, fixed: 0, escalated: 0, totalAmount: 0 }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl border border-[#BFDDF0] bg-gradient-to-br from-[#FFF9D2]/40 to-white p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#5BA3DC] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Batch results
          </div>
          <h3 className="mt-3 text-2xl font-bold text-[#2C3E50]">
            {results.length} invoice{results.length === 1 ? "" : "s"} audited
          </h3>
          <p className="mt-1 text-sm text-[#5A6C7D]">
            {totals.violations} total violation
            {totals.violations === 1 ? "" : "s"} · {totals.fixed} auto-fixed ·{" "}
            {totals.escalated} escalated
          </p>
        </div>
      </div>
    </motion.div>
  );
}
