import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="cream-bg border-t border-[var(--cream-border)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7CB3E0] to-[#4A8BC7]">
                <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-bold tracking-tight text-[var(--ink)]">
                AutoAudit<span className="ml-0.5 text-[#4A8BC7]">AI</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
              Autonomous financial compliance system. Detects GST errors,
              duplicate payments, and policy violations — and fixes them
              automatically.
            </p>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "#" },
              { label: "API Docs", href: "https://auto-audit.onrender.com/docs" },
            ]}
          />

          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "#" },
              { label: "Contact", href: "#" },
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
            ]}
          />
        </div>

        <div className="mt-14 border-t border-[var(--cream-border)] pt-6 text-center text-sm text-[var(--ink-light)]">
          © 2026 AutoAudit AI · Built for ET AI Hackathon 2026
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
