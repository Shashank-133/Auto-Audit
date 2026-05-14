"use client";

import { useEffect, useRef, useState } from "react";
import type { WsEvent } from "./types";

export type WsStatus = "connecting" | "connected" | "disconnected";

export interface UseWebSocketOptions {
  url: string;
  onEvent: (event: WsEvent | { type: "raw"; payload: string }) => void;
  enabled?: boolean;
}

export function useWebSocket({ url, onEvent, enabled = true }: UseWebSocketOptions) {
  const [status, setStatus] = useState<WsStatus>("disconnected");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("disconnected");
      return;
    }

    let cancelled = false;

    const connect = () => {
      setStatus("connecting");
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch {
        setStatus("disconnected");
        scheduleReconnect();
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setStatus("connected");
      };

      ws.onmessage = (e) => {
        if (cancelled) return;
        const raw = typeof e.data === "string" ? e.data : "";
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw) as WsEvent;
          onEventRef.current(parsed);
        } catch {
          onEventRef.current({ type: "raw", payload: raw });
        }
      };

      ws.onerror = () => {
        // Don't change status here; let onclose handle it.
      };

      ws.onclose = () => {
        if (cancelled) return;
        setStatus("disconnected");
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(() => {
        if (!cancelled) connect();
      }, 3000);
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [url, enabled]);

  return { status };
}
