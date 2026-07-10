import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  title,
  subtitle,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  crumbs?: { name: string; href: string }[];
}) {
  return (
    <section className="mesh-bg border-b border-brand-50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {crumbs && (
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-ink-muted">
            <Link href="/" className="hover:text-brand-600">Trang chủ</Link>
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={c.href} className="hover:text-brand-600">{c.name}</Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-black text-ink md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-ink-soft">{subtitle}</p>}
      </div>
    </section>
  );
}
