import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { CallAction } from "./call-action";

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

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/mascot.png"
        alt="Mascot Minh Thiện Logistics"
        className="animate-float -mb-1 hidden w-16 drop-shadow-xl md:block"
      />
      <CallAction
        id="floating-call"
        phone={site.phone}
        ariaLabel="Gọi điện"
        className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-coral-500 text-white shadow-lg shadow-coral-500/40"
      >
        <Phone className="h-6 w-6" />
      </CallAction>
      <a
        id="floating-zalo"
        href={site.zalo}
        aria-label="Chat Zalo"
        className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#0068FF] shadow-lg shadow-[#0068FF]/40"
      >
        <ZaloIcon className="h-8 w-8" />
      </a>
    </div>
  );
}
