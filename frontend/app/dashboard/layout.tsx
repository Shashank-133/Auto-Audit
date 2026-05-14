"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppNavbar } from "@/components/dashboard/AppNavbar";
import { useAuthStore } from "@/lib/store";
import { Spinner } from "@/components/shared/Spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand persist rehydration before deciding
    const unsub = useAuthStore.persist?.onFinishHydration(() =>
      setHydrated(true)
    );
    if (useAuthStore.persist?.hasHydrated()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrated(true);
    }
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace("/");
  }, [isAuthenticated, hydrated, router]);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-white">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
