import type { Metadata } from "next";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { LeadForm } from "@/components/site/lead-form";
import { CallAction } from "@/components/site/call-action";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ & báo giá",
  description: `Liên hệ ${site.name} — hotline ${site.phoneDisplay}, ${site.addressFull}. Báo giá gửi hàng quốc tế miễn phí.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Liên hệ & báo giá"
        subtitle="Để lại thông tin, Minh Thiện sẽ liên hệ báo giá chính xác trong ít phút. Tư vấn miễn phí 100%."
        crumbs={[{ name: "Liên hệ", href: "/lien-he" }]}
      />
      <section className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-black text-ink">Thông tin liên hệ</h2>
          <div className="mt-6 space-y-5">
            {site.branches.map((b) => (
              <div key={b.name} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-ink">{b.name}</div>
                  <p className="text-ink-soft">{b.address}</p>
                  {b.phones.length > 0 && (
                    <p className="mt-0.5">
                      {b.phones.map((p, i) => (
                        <span key={p}>
                          {i > 0 && " · "}
                          <CallAction phone={p.replace(/\./g, "")} className="font-semibold text-brand-600">{p}</CallAction>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun-50 text-sun-500">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-ink">Giờ làm việc</div>
                <p className="text-ink-soft">{site.hours}</p>
              </div>
            </div>
            <a
              href={site.zalo}
              className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
            >
              <MessageCircle className="h-5 w-5" /> Chat Zalo ngay
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-ink">Gửi yêu cầu báo giá</h2>
          <p className="mt-2 text-ink-soft">Điền thông tin bên dưới, chúng tôi sẽ gọi lại ngay.</p>
          <div className="mt-5">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
