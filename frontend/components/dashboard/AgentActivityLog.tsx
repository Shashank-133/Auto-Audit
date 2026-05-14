"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Wifi,
  WifiOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Bot,
} from "lucide-react";
import { cn, formatTimestamp } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import type { AgentLogEntry, AgentName, LogLevel } from "@/lib/types";

interface AgentActivityLogProps {
  entries: AgentLogEntry[];
  wsStatus: "connecting" | "connected" | "disconnected";
  isRunning: boolean;
  onClear: () => void;
}

const AGENT_EMOJI: Record<AgentName, string> = {
  System: "🤖",
  Intake: "📥",
  Compliance: "🔍",
  DuplicateChecker: "🧬",
  Investigator: "🧠",
  Remediator: "🔧",
  Auditor: "📊",
};

const LEVEL_ICON: Record<LogLevel, React.ReactNode> = {
  info: <Info className="h-3.5 w-3.5 text-[#5BA3DC]" />,
  success: <CheckCircle2 className="h-3.5 w-3.5 text-[#52C41A]" />,
  warning: <AlertTriangle className="h-3.5 w-3.5 text-[#FA8C16]" />,
  error: <XCircle className="h-3.5 w-3.5 text-[#F5222D]" />,
};

const LEVEL_TONE: Record<LogLevel, string> = {
  info: "text-[#5A6C7D]",
  success: "text-[#3a8c12]",
  warning: "text-[#c66a0d]",
  error: "text-[#cf1322]",
};

export function AgentActivityLog({
  entries,
  wsStatus,
  isRunning,
  onClear,
}: AgentActivityLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries]);

  return (
    <div className="flex h-full min-h-[400px] flex-col overflow-hidden rounded-xl border border-[#BFDDF0] bg-white shadow-[0_1px_3px_rgba(44,62,80,0.06)]">
      <div className="flex items-center justify-between border-b border-[#E5EAF0] bg-[#F8FAFB] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#BFDDF0]/40">
            <Activity className="h-4 w-4 text-[#5BA3DC]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2C3E50]">
              Agent Activity
            </h3>
            <p className="text-xs text-[#8E9BAC]">Real-time pipeline log</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <WsStatusPill status={wsStatus} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={entries.length === 0}
            aria-label="Clear log"
            className="!h-8 !px-2"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="max-h-[440px] flex-1 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#F8FAFB]">
              <Bot className="h-6 w-6 text-[#8E9BAC]" />
            </div>
            <p className="text-sm text-[#5A6C7D]">
              Upload invoices to watch the pipeline run.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <ul className="space-y-1">
              {entries.map((entry) => (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "flex items-start gap-2.5 rounded-md px-2 py-1.5 text-sm",
                    entry.level === "error" && "bg-[#F5222D]/8",
                    entry.level === "warning" && "bg-[#FA8C16]/8"
                  )}
                >
                  <span className="mt-0.5 flex-shrink-0 font-mono text-[11px] tabular-nums text-[#8E9BAC]">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  <span aria-hidden className="flex-shrink-0">
                    {LEVEL_ICON[entry.level]}
                  </span>
                  <span
                    className="flex-shrink-0 text-base leading-5"
                    aria-hidden
                  >
                    {AGENT_EMOJI[entry.agent] ?? "•"}
                  </span>
                  <span className="flex-shrink-0 rounded bg-[#F8FAFB] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5A6C7D]">
                    {entry.agent}
                  </span>
                  <span
                    className={cn(
                      "leading-relaxed",
                      LEVEL_TONE[entry.level]
                    )}
                  >
                    {entry.message}
                  </span>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        )}
        {isRunning && (
          <div className="mt-2 flex items-center gap-2 px-2 text-xs text-[#5BA3DC]">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#5BA3DC]" />
            Pipeline running…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center justify-between border-t border-[#E5EAF0] px-5 py-2 text-xs">
        <span className="text-[#8E9BAC]">
          {entries.length} log {entries.length === 1 ? "entry" : "entries"}
        </span>
        <div className="flex gap-2">
          {(["info", "success", "warning", "error"] as LogLevel[]).map((lvl) => {
            const count = entries.filter((e) => e.level === lvl).length;
            if (!count) return null;
            return (
              <span
                key={lvl}
                className={cn("inline-flex items-center gap-1", LEVEL_TONE[lvl])}
              >
                {LEVEL_ICON[lvl]}
                {count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WsStatusPill({
  status,
}: {
  status: "connecting" | "connected" | "disconnected";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        status === "connected"
          ? "border-[#52C41A]/30 bg-[#52C41A]/10 text-[#3a8c12]"
          : status === "connecting"
          ? "border-[#FA8C16]/30 bg-[#FA8C16]/10 text-[#c66a0d]"
          : "border-[#E5EAF0] bg-[#F8FAFB] text-[#8E9BAC]"
      )}
    >
      {status === "connected" ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {status === "connected"
        ? "WS Live"
        : status === "connecting"
        ? "Connecting…"
        : "WS Offline"}
    </span>
  );
}
