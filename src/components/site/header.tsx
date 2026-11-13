"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "./logo";
import { CallAction } from "./call-action";
import { nav, services, site } from "@/lib/site";
import { useHotline } from "./so-trang-uc";
import { DESTINATIONS } from "@/lib/eu-countries";
import { KT_PATH, categoryHref, categoryLabel } from "@/lib/kien-thuc";

type MenuLink = { label: string; href: string };
type Dropdown = { cols: 1 | 2; items: MenuLink[]; all: MenuLink };

// Menu xổ xuống của từng mục trên thanh menu. Chỉ đưa trang CÓ THẬT; danh sách cố định
// (không đọc DB) để header vẫn tĩnh. Tuyến mới: thêm vào `services` / DESTINATIONS.
const DROPDOWNS: Record<string, Dropdown> = {
  "/gui-hang": {
    cols: 2,
    items: [
      ...services
        .filter((s) => s.group === "gui-hang")
        .map((s) => ({ label: s.title, href: `/dich-vu/${s.slug}` })),
      { label: "Hàng gì gửi đi được?", href: "/hang-gui-duoc" },
      { label: "Thời gian giao thực tế", href: "/thoi-gian-giao-thuc-te" },
    ],
    all: { label: "Xem tất cả tuyến gửi hàng", href: "/gui-hang" },
  },
  "/nhap-hang": {
    cols: 1,
    items: [
      ...services
        .filter((s) => s.group === "nhap-hang")
        .map((s) => ({ label: s.title, href: `/dich-vu/${s.slug}` })),
      { label: categoryLabel("Nhập hàng Trung Quốc"), href: categoryHref("Nhập hàng Trung Quốc") },
    ],
    all: { label: "Xem dịch vụ nhập hàng", href: "/nhap-hang" },
  },
  [KT_PATH]: {
    cols: 2,
    items: [...DESTINATIONS.map((d) => d.category), "Nhập hàng Trung Quốc"].map((c) => ({
      label: categoryLabel(c),
      href: categoryHref(c),
    })),
    all: { label: "Xem tất cả bài kiến thức", href: KT_PATH },
  },
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState<string | null>(null);
  const hotline = useHotline();

  return (
    <>
      <div className="hidden bg-brand-700 text-sm text-white/85 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span>{site.addressFull}</span>
            <span>{site.hours}</span>
          </div>
          <CallAction
            phone={hotline.phone}
            className="flex items-center gap-1.5 font-semibold text-sun-300 hover:text-white"
            conversionLabel="VzBiCL7SkdUcEKnr1_49"
          >
            <Phone className="h-4 w-4" /> {hotline.display}
          </CallAction>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-brand-50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-6">
          <div className="shrink-0">
            <Logo />
          </div>

          <nav className="hidden items-center gap-5 whitespace-nowrap text-[15px] font-medium text-ink-soft lg:flex xl:gap-7">
            {nav.map((item) => {
              const dd = DROPDOWNS[item.href];
              if (!dd) {
                return (
                  <Link key={item.href} href={item.href} className="transition hover:text-brand-600">
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-0.5 transition hover:text-brand-600 group-hover:text-brand-600"
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                  </Link>
                  {/* pt-3 làm cầu nối để rê chuột từ chữ xuống menu không bị tắt giữa chừng */}
                  <div
                    className={`invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${
                      dd.cols === 2 ? "w-[540px]" : "w-[300px]"
                    }`}
                  >
                    <div className="rounded-2xl border border-brand-50 bg-white p-3 shadow-xl shadow-brand-900/10">
                      <ul className={`grid gap-1 whitespace-normal ${dd.cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {dd.items.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block rounded-xl px-3 py-2 text-[14px] text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={dd.all.href}
                        className="mt-2 block rounded-xl bg-brand-50 px-3 py-2 text-center text-[14px] font-semibold text-brand-700 hover:bg-brand-100"
                      >
                        {dd.all.label}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <CallAction
              phone={hotline.phone}
              className="hidden items-center gap-2 whitespace-nowrap font-bold text-ink sm:flex"
              conversionLabel="VzBiCL7SkdUcEKnr1_49"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Phone className="h-4 w-4" />
              </span>
              {hotline.display}
            </CallAction>
            <Link
              href="/lien-he"
              className="hidden whitespace-nowrap rounded-full bg-coral-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-600 sm:inline-block lg:hidden xl:inline-block"
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
          <div className="max-h-[calc(100vh-74px)] overflow-y-auto border-t border-brand-50 bg-white lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-6 py-3">
              {nav.map((item) => {
                const dd = DROPDOWNS[item.href];
                if (!dd) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="border-b border-brand-50 py-3 font-medium text-ink-soft last:border-0"
                    >
                      {item.label}
                    </Link>
                  );
                }
                const isOpen = subOpen === item.href;
                return (
                  <div key={item.href} className="border-b border-brand-50">
                    <div className="flex items-center justify-between">
                      <Link href={item.href} onClick={() => setOpen(false)} className="flex-1 py-3 font-medium text-ink-soft">
                        {item.label}
                      </Link>
                      <button
                        onClick={() => setSubOpen(isOpen ? null : item.href)}
                        className="flex h-10 w-10 items-center justify-center text-ink-soft"
                        aria-label={`Mở danh mục ${item.label}`}
                        aria-expanded={isOpen}
                      >
                        <ChevronDown className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {isOpen && (
                      <ul className="pb-3 pl-3">
                        {dd.items.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} onClick={() => setOpen(false)} className="block py-2 text-[15px] text-ink-soft">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
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
