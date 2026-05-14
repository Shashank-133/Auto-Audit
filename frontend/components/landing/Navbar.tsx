"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Navbar({ onLogin, onSignup }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-200",
        scrolled
          ? "bg-[var(--cream-bg)]/95 backdrop-blur-md border-b border-[var(--cream-border)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-[#4A8BC7]/30 blur-md" />
            <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7CB3E0] to-[#4A8BC7]">
              <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--ink)]">
            AutoAudit
            <span className="ml-0.5 text-[#4A8BC7]">AI</span>
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-10 md:flex">
          <a
            href="#features"
            className="text-[15px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
          >
            Features
          </a>
          <NavDropdown
            label="How It Works"
            items={[
              { label: "Five-agent pipeline", href: "#how-it-works" },
              { label: "Error recovery", href: "#how-it-works" },
              { label: "Audit trail", href: "#how-it-works" },
            ]}
          />
          <NavDropdown
            label="Resources"
            items={[
              { label: "API Docs", href: "https://auto-audit.onrender.com/docs", external: true },
              { label: "Demo Video", href: "#" },
              { label: "Case Studies", href: "#" },
            ]}
          />
        </nav>

        {/* Right CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onLogin}
            className="text-[15px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
          >
            Login
          </button>
          <button
            onClick={onSignup}
            className="inline-flex h-11 items-center rounded-full bg-[var(--ink)] px-6 text-[15px] font-medium text-white transition-all hover:bg-[#000] hover:shadow-lg"
          >
            Get Started
          </button>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden rounded-lg p-2 text-[var(--ink)] hover:bg-[var(--cream-bg-2)]"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--cream-border)] bg-[var(--cream-bg)]">
          <div className="space-y-1 px-6 py-4">
            <a
              href="#features"
              className="block py-2 text-sm font-medium text-[var(--ink-2)]"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-sm font-medium text-[var(--ink-2)]"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#stats"
              className="block py-2 text-sm font-medium text-[var(--ink-2)]"
              onClick={() => setMobileOpen(false)}
            >
              Results
            </a>
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--cream-border)]">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onLogin();
                }}
                className="h-11 rounded-full border border-[var(--ink)] text-sm font-medium text-[var(--ink)]"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onSignup();
                }}
                className="h-11 rounded-full bg-[var(--ink)] text-sm font-medium text-white"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="inline-flex items-center gap-1 text-[15px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors">
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
          <div className="min-w-[200px] rounded-xl border border-[var(--cream-border)] bg-white p-1.5 shadow-xl">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="block rounded-lg px-3 py-2 text-sm text-[var(--ink-2)] hover:bg-[var(--cream-bg-2)] hover:text-[var(--ink)] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
