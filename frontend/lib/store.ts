import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuditResponse, User } from "./types";

// ─── Auth Store (mock — localStorage backed) ─────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: {
    fullName: string;
    email: string;
    password: string;
    company: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email) => {
        // Mock auth — accept any email + password >= 6 chars
        await new Promise((r) => setTimeout(r, 500));
        const existingRaw =
          typeof window !== "undefined"
            ? window.localStorage.getItem(`autoaudit:user:${email}`)
            : null;
        const existing = existingRaw ? (JSON.parse(existingRaw) as User) : null;
        const user: User =
          existing ?? {
            email,
            fullName: email.split("@")[0],
            company: "",
            createdAt: new Date().toISOString(),
          };
        set({ user, isAuthenticated: true });
      },
      signup: async ({ fullName, email, company }) => {
        await new Promise((r) => setTimeout(r, 500));
        const user: User = {
          fullName,
          email,
          company,
          createdAt: new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            `autoaudit:user:${email}`,
            JSON.stringify(user)
          );
        }
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (patch) =>
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...patch };
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              `autoaudit:user:${updated.email}`,
              JSON.stringify(updated)
            );
          }
          return { user: updated };
        }),
    }),
    {
      name: "autoaudit-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── Audit History Store (local cache of recent uploads) ─────────────────────

export interface AuditHistoryEntry {
  id: string;
  filename: string;
  uploadedAt: string;
  response: AuditResponse;
}

interface AuditHistoryState {
  audits: AuditHistoryEntry[];
  addAudit: (entry: AuditHistoryEntry) => void;
  clearAudits: () => void;
}

export const useAuditHistoryStore = create<AuditHistoryState>()(
  persist(
    (set) => ({
      audits: [],
      addAudit: (entry) =>
        set((state) => ({
          audits: [entry, ...state.audits].slice(0, 50),
        })),
      clearAudits: () => set({ audits: [] }),
    }),
    {
      name: "autoaudit-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
