import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ServiceMedia } from "@/components/site/service-media";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gửi hàng đi quốc tế",
  description:
    "Dịch vụ gửi hàng đi Mỹ, Úc, Canada, Châu Âu, Nhật Bản, Hàn Quốc và hơn 200 quốc gia của Minh Thiện Logistics.",
};

export default function ShippingPage() {
  const list = services.filter((s) => s.group === "gui-hang");
  return (
    <>
      <PageHero
        title="Gửi hàng đi quốc tế"
        subtitle="Chọn điểm đến — Minh Thiện lo trọn gói từ lấy hàng tại nhà đến giao tận tay người nhận."
        crumbs={[{ name: "Gửi hàng đi", href: "/gui-hang" }]}
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link
              key={s.slug}
              href={`/dich-vu/${s.slug}`}
              className="group block rounded-3xl border border-brand-50 bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/10"
            >
              <ServiceMedia service={s} />
              <h2 className="mt-4 text-lg font-bold text-ink">{s.title}</h2>
              <p className="mt-1.5 text-sm text-ink-soft">{s.short}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2.5">
                Xem chi tiết <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
