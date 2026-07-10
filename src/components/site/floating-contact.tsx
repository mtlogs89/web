import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/mascot.png"
        alt="Mascot Minh Thiện Logistics"
        className="animate-float -mb-1 hidden w-16 drop-shadow-xl md:block"
      />
      <a
        id="floating-call"
        href={`tel:${site.phone}`}
        aria-label="Gọi điện"
        className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-coral-500 text-white shadow-lg shadow-coral-500/40"
      >
        <Phone className="h-6 w-6" />
      </a>
      <a
        id="floating-zalo"
        href={site.zalo}
        aria-label="Chat Zalo"
        className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/40"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
