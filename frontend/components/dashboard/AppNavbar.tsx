"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upload", href: "/dashboard/upload" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Settings", href: "/dashboard/settings" },
];

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = user
    ? user.fullName
        .split(" ")
        .map((s) => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5EAF0] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-[#2C3E50]"
                      : "text-[#5A6C7D] hover:text-[#2C3E50]"
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[17px] left-3 right-3 h-[3px] rounded-t bg-[#8CC0EB]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-[#F8FAFB]"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#BFDDF0] to-[#8CC0EB] text-sm font-bold text-white">
              {initials}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-[#5A6C7D] sm:block" />
          </button>

          {menuOpen && (
            <div
              className="fade-in absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-[#E5EAF0] bg-white shadow-xl"
              role="menu"
            >
              <div className="border-b border-[#E5EAF0] bg-[#F8FAFB] px-4 py-3">
                <p className="truncate text-sm font-semibold text-[#2C3E50]">
                  {user?.fullName ?? "Guest"}
                </p>
                <p className="truncate text-xs text-[#5A6C7D]">
                  {user?.email ?? "—"}
                </p>
              </div>
              <div className="py-1">
                <MenuItem
                  icon={<UserIcon className="h-4 w-4" />}
                  label="Profile"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/dashboard/settings");
                  }}
                />
                <MenuItem
                  icon={<SettingsIcon className="h-4 w-4" />}
                  label="Settings"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/dashboard/settings");
                  }}
                />
                <div className="my-1 h-px bg-[#E5EAF0]" />
                <MenuItem
                  icon={<LogOut className="h-4 w-4" />}
                  label="Sign out"
                  destructive
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    router.push("/");
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden border-t border-[#E5EAF0] bg-white px-4 py-2 overflow-x-auto">
        <div className="flex gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap",
                  active
                    ? "bg-[#BFDDF0]/40 text-[#2C3E50]"
                    : "text-[#5A6C7D]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors",
        destructive
          ? "text-[#F5222D] hover:bg-[#F5222D]/8"
          : "text-[#2C3E50] hover:bg-[#F8FAFB]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
