"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./logo";
import { CallAction } from "./call-action";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden bg-brand-700 text-sm text-white/85 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span>{site.addressFull}</span>
            <span>{site.hours}</span>
          </div>
          <CallAction
            phone={site.phone}
            className="flex items-center gap-1.5 font-semibold text-sun-300 hover:text-white"
          >
            <Phone className="h-4 w-4" /> {site.phoneDisplay}
          </CallAction>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6">
          <Logo />

          <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-soft lg:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-brand-600">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CallAction
              phone={site.phone}
              className="hidden items-center gap-2 font-bold text-ink sm:flex"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Phone className="h-4 w-4" />
              </span>
              {site.phoneDisplay}
            </CallAction>
            <Link
              href="/lien-he"
              className="hidden rounded-full bg-coral-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-600 sm:inline-block"
            >
              Báo giá ngay
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink lg:hidden"
              aria-label="Mở menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-brand-50 bg-white lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-6 py-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-brand-50 py-3 font-medium text-ink-soft last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/lien-he"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-full bg-coral-500 px-5 py-3 text-center font-semibold text-white"
              >
                Báo giá ngay
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
