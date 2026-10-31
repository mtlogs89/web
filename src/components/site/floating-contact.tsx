"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { CallAction } from "./call-action";
import { trackConversion } from "@/lib/google-ads";

/** Logo Zalo (bong bóng chat trắng + chữ "Zalo" xanh) — để khách nhận ra ngay là Zalo. */
function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#fff"
        d="M14 7h20a9 9 0 0 1 9 9v14a9 9 0 0 1-9 9H21.5l-8.7 5.2a1 1 0 0 1-1.5-.9V38.4A9 9 0 0 1 5 30V16a9 9 0 0 1 9-9Z"
      />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="14"
        fontWeight="800"
        fill="#0068FF"
      >
        Zalo
      </text>
    </svg>
  );
}

/**
 * Một nút gọi: số hiện ở nhãn bên trái + vòng tròn điện thoại. Cả cụm bấm được.
 * Có 2 hotline nên phải ghi số ra, khách mới biết nút nào gọi ai.
 */
function HotlineButton({
  id,
  phone,
  display,
  name,
  circleClass,
}: {
  id: string;
  phone: string;
  display: string;
  name: string;
  circleClass: string;
}) {
  return (
    <CallAction
      id={id}
      phone={phone}
      ariaLabel={`Gọi ${name} ${display}`}
      className="flex items-center gap-2"
      conversionLabel="VzBiCL7SkdUcEKnr1_49"
    >
      <span className="rounded-full bg-white/95 px-2.5 py-1 text-right leading-tight shadow-md ring-1 ring-black/5 sm:px-3 sm:py-1.5">
        <span data-name-for={id} className="block text-[9px] font-medium text-slate-500 sm:text-[10px]">
          {name}
        </span>
        <span data-label-for={id} className="block text-xs font-bold whitespace-nowrap text-ink sm:text-sm">
          {display}
        </span>
      </span>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg sm:h-[54px] sm:w-[54px] ${circleClass}`}>
        <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
    </CallAction>
  );
}

// Số Ms Vy CHỈ hiện ở trang liên quan tới Úc, còn lại chỉ 1 hotline chung — chủ chốt 31/10/2026.
// Trang Úc = đường dẫn khớp chủ đề Úc (trang dịch vụ + bài có slug Úc), hoặc bài có ô Điện thoại
// = số Ms Vy (ContactOverride bật qua setHienSoVy).
const UC_PATH = /(^|-|\/)(di|o|sang)-uc($|-|\/)|australia|sydney|melbourne|brisbane|perth|adelaide/;

let baiSoVy = false;
const listeners = new Set<() => void>();
export function setHienSoVy(v: boolean) {
  baiSoVy = v;
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function FloatingContact() {
  const pathname = usePathname();
  const bai = useSyncExternalStore(subscribe, () => baiSoVy, () => false);
  const hienSo2 = UC_PATH.test(pathname) || bai;
  return (
    <div id="floating-contact" className="fixed bottom-4 right-3 z-50 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5 sm:gap-3">
      <HotlineButton
        id="floating-call"
        phone={site.phone}
        display={site.phoneDisplay}
        name={`Hotline · ${site.contactName}`}
        circleClass="bg-coral-500 shadow-coral-500/40"
      />
      {hienSo2 && (
        <HotlineButton
          id="floating-call2"
          phone={site.phone2}
          display={site.phone2Display}
          name={`Hotline · ${site.contactName2}`}
          circleClass="bg-brand-500 shadow-brand-500/40"
        />
      )}
      <a
        id="floating-zalo"
        href={site.zalo}
        aria-label="Chat Zalo"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0068FF] shadow-lg shadow-[#0068FF]/40 sm:h-[54px] sm:w-[54px]"
        onClick={() => trackConversion("G8fXCJ6D_NQcEKnr1_49")}
      >
        <ZaloIcon className="h-7 w-7 sm:h-8 sm:w-8" />
      </a>
    </div>
  );
}
