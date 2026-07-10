import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Minh Thiện Logistics">
      <span className="flex items-center -space-x-1.5">
        <span className="h-3.5 w-3.5 rounded-full bg-coral-500" />
        <span className="h-3.5 w-3.5 rounded-full bg-sun-400" />
        <span className="h-3.5 w-3.5 rounded-full bg-brand-500" />
      </span>
      <span className="ml-1 leading-none">
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
