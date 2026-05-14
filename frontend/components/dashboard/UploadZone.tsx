"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload, FileText, X } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

interface UploadZoneProps {
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

const MAX_BYTES = 10 * 1024 * 1024;

export function UploadZone({ files, onAdd, onRemove, disabled }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = useCallback(
    (incoming: FileList | File[]) => {
      const accepted: File[] = [];
      let rejectedReason: string | null = null;
      for (const f of Array.from(incoming)) {
        if (f.type !== "application/pdf") {
          rejectedReason = `${f.name} — only PDFs are accepted.`;
          continue;
        }
        if (f.size > MAX_BYTES) {
          rejectedReason = `${f.name} — exceeds the 10 MB limit.`;
          continue;
        }
        accepted.push(f);
      }
      setError(rejectedReason);
      if (accepted.length > 0) onAdd(accepted);
    },
    [onAdd]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files;
      if (dropped && dropped.length > 0) validateAndAdd(dropped);
    },
    [disabled, validateAndAdd]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) validateAndAdd(e.target.files);
    // allow re-selecting the same file
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        role="button"
        tabIndex={0}
        aria-label="Drop zone for invoice PDFs"
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "relative flex h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
          dragActive
            ? "border-[#8CC0EB] bg-[#FFF9D2] scale-[1.01] shadow-md"
            : "border-[#BFDDF0] bg-[#FFF9D2]/30 hover:border-[#8CC0EB] hover:bg-[#FFF9D2]/60",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={onChange}
          disabled={disabled}
        />
        <CloudUpload className="h-12 w-12 text-[#5BA3DC]" strokeWidth={1.5} />
        <p className="mt-4 text-lg font-semibold text-[#2C3E50]">
          Drag &amp; drop invoice PDFs here
        </p>
        <p className="mt-1 text-sm text-[#5A6C7D]">
          or <span className="font-semibold text-[#5BA3DC]">click to browse files</span>
        </p>
        <p className="mt-4 text-xs text-[#8E9BAC]">
          Supports PDF · up to 100 files at once · max 10 MB each
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-[#F5222D]/30 bg-[#F5222D]/8 px-3 py-2 text-sm text-[#cf1322]">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#2C3E50]">
            {files.length} file{files.length === 1 ? "" : "s"} ready
          </p>
          <ul className="space-y-2">
            {files.map((file, i) => (
              <motion.li
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-lg border border-[#E5EAF0] bg-white px-4 py-3"
              >
                <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-[#F5222D]/8">
                  <FileText className="h-4 w-4 text-[#F5222D]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#2C3E50]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#8E9BAC]">{formatBytes(file.size)}</p>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(i);
                    }}
                    aria-label={`Remove ${file.name}`}
                    className="rounded-md p-1.5 text-[#8E9BAC] transition-colors hover:bg-[#F5222D]/10 hover:text-[#F5222D]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
