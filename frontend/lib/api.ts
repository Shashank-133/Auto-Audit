import type { AuditResponse, AuditTrailRecord } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? body.message ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(detail, res.status);
  }
  return res.json();
}

export async function uploadInvoice(file: File): Promise<AuditResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<AuditResponse>(res);
}

export async function listAuditTrail(): Promise<{
  total: number;
  records: AuditTrailRecord[];
}> {
  const res = await fetch(`${API_URL}/demo/audit-trail`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function getAuditTrailRecord(
  invoiceNumber: string
): Promise<Record<string, unknown>> {
  const res = await fetch(
    `${API_URL}/demo/audit-trail/${encodeURIComponent(invoiceNumber)}`,
    { cache: "no-store" }
  );
  return handleResponse(res);
}

export async function getSystemStats(): Promise<{
  websocket_connections: number;
  invoices_in_store: number;
  audit_trail_records: number;
  duplicate_detector_ready: boolean;
  timestamp: string;
}> {
  const res = await fetch(`${API_URL}/demo/stats`, { cache: "no-store" });
  return handleResponse(res);
}

export async function getHealth(): Promise<{
  status: string;
  app: string;
  version: string;
  websocket_connections: number;
  duplicate_store_size: number;
}> {
  const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
  return handleResponse(res);
}

export async function simulateOcrFailure(): Promise<unknown> {
  const res = await fetch(`${API_URL}/demo/ocr-failure`, { method: "POST" });
  return res.json();
}

export async function simulateApiTimeout(): Promise<unknown> {
  const res = await fetch(`${API_URL}/demo/api-timeout`, { method: "POST" });
  return res.json();
}

export async function simulateBadFix(): Promise<unknown> {
  const res = await fetch(`${API_URL}/demo/bad-fix`, { method: "POST" });
  return res.json();
}

export { ApiError };
