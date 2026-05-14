export function TrustIndicators() {
  const companies = [
    "AcmeCorp",
    "Quantix",
    "Nimbus",
    "Vertex Labs",
    "Helios",
    "Stride",
  ];

  return (
    <section className="border-y border-[var(--cream-border)] bg-[var(--cream-bg-2)]/70 py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          Trusted by finance teams at fast-growing companies
        </p>
        <div className="mt-8 grid grid-cols-2 items-center justify-items-center gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((name) => (
            <div
              key={name}
              className="text-xl tracking-tight text-[var(--ink-muted)] opacity-60 transition-opacity duration-300 hover:opacity-100 hover:text-[var(--ink)]"
              style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
