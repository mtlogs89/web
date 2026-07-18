import type { Metadata } from "next";
import Link from "next/link";
import { Check, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import { serviceContent } from "@/lib/service-content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nhập hàng & mua hộ quốc tế",
  description:
    "Nhập hàng Trung Quốc, Thái Lan, Âu – Mỹ và mua hộ Taobao, 1688, Amazon. Thanh toán hộ, kiểm hàng, ship tận nơi cùng Minh Thiện Logistics.",
};

export default function ImportPage() {
  const detail = serviceContent["nhap-hang-mua-ho"];
  return (
    <>
      <PageHero
        title="Nhập hàng & mua hộ quốc tế"
        subtitle={detail.intro}
        crumbs={[{ name: "Nhập hàng", href: "/nhap-hang" }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {detail.highlights.map((h) => (
            <div key={h.title} className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
              <div className="font-black text-brand-600">{h.title}</div>
              <p className="mt-1 text-sm text-ink-soft">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-black text-ink">Dịch vụ nhập hàng & mua hộ</h2>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detail.items.map((it) => (
                <li key={it} className="flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3">
                  <Check className="h-5 w-5 shrink-0 text-brand-600" />
                  <span className="font-medium text-ink">{it}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-black text-ink">Câu hỏi thường gặp</h2>
            <div className="mt-5 space-y-3">
              {detail.faqs.map((f, i) => (
                <details key={i} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
                  <p className="mt-2 text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <aside>
            <div className="sticky top-24 rounded-3xl p-7 text-white shadow-xl shadow-brand-500/30" style={{ background: "linear-gradient(135deg,#1FB6A2,#0f7568)" }}>
              <h3 className="text-xl font-black">Cần nhập hàng?</h3>
              <p className="mt-2 text-white/80">Gửi link sản phẩm, Minh Thiện báo giá trọn gói tiền hàng + cước về Việt Nam.</p>
              <CallAction phone={site.phone} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-bold text-brand-700">
                <Phone className="h-5 w-5" /> {site.phoneDisplay}
              </CallAction>
              <Link href="/lien-he" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3.5 font-semibold text-white hover:bg-coral-600">
                Gửi yêu cầu báo giá
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
