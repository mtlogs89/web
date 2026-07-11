import Link from "next/link";

// Logo Minh Thiện: dùng đúng file logo gốc (public/images/logo-mark.png,
// nền trong suốt) — không vẽ lại. Favicon cùng hình ở src/app/icon.png.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Minh Thiện Logistics">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mark.png" alt="" className="h-11 w-11" />
      <span className="leading-none">
        <span
          className={`block text-xl font-black tracking-tight ${
            light ? "text-brand-400" : "text-brand-600"
          }`}
        >
          MINH THIỆN
        </span>
        <span className="block text-[11px] font-bold tracking-[0.3em] text-coral-500">
          LOGISTICS
        </span>
      </span>
    </Link>
  );
}
