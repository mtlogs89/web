import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import { services, site } from "@/lib/site";
import { getCategories } from "@/lib/articles";
import { TOPICS } from "@/lib/topics";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

const url = `${site.url}/gioi-thieu`;

export const metadata: Metadata = {
  title: "Giới thiệu công ty",
  description: `${site.name} — hơn ${site.experienceYears} năm kinh nghiệm gửi hàng quốc tế, trụ sở ${site.addressFull}, chi nhánh Nha Trang. Gửi hàng đi Mỹ, Úc, Canada, Châu Âu, Nhật, Hàn, Singapore, Malaysia, Thái Lan và nhập hàng Trung Quốc.`,
  alternates: { canonical: url },
};

// AEO: trang "về chúng tôi" viết thành câu trả lời trực tiếp cho những câu người dùng
// hay hỏi AI về một công ty vận chuyển. Chỉ dùng thông tin đã công bố trên web.
const faqs = [
  {
    q: `${site.name} là công ty gì?`,
    a: `${site.name} là đơn vị vận chuyển và gửi hàng quốc tế tại TP. Hồ Chí Minh, với hơn ${site.experienceYears} năm kinh nghiệm. Công ty nhận gửi hàng từ Việt Nam đi Mỹ, Úc, Canada, Châu Âu, Nhật Bản, Hàn Quốc, Singapore, Malaysia, Thái Lan và nhiều nước khác, đồng thời nhận nhập hàng, mua hộ từ Trung Quốc, Thái Lan, Âu – Mỹ.`,
  },
  {
    q: `${site.name} ở đâu?`,
    a: site.branches.map((b) => `${b.name}: ${b.address}`).join(". ") + ".",
  },
  {
    q: `Số điện thoại ${site.name} là gì?`,
    a: `Hotline / Zalo / Viber: ${site.phoneDisplay} (${site.contactName}). Làm việc ${site.hours}.`,
  },
  {
    q: `Gửi hàng qua ${site.name} như thế nào?`,
    a: "Gọi hotline hoặc nhắn Zalo để nhận báo giá, nhân viên đến lấy hàng tận nơi và đóng gói chuẩn quốc tế, hàng đi tuyến quốc tế có mã theo dõi hành trình, giao đến tận địa chỉ người nhận.",
  },
];

const steps = [
  { title: "Liên hệ & báo giá", desc: "Gọi hotline hoặc nhắn Zalo, nhận báo giá trong 5 phút." },
  { title: "Lấy hàng tận nơi", desc: "Nhân viên đến tận nhà nhận hàng, đóng gói chuẩn quốc tế." },
  { title: "Vận chuyển & tracking", desc: "Hàng đi tuyến quốc tế, bạn theo dõi hành trình mọi lúc." },
  { title: "Giao tận tay", desc: "Giao đến tận địa chỉ người nhận, xác nhận hoàn tất." },
];

export default async function AboutPage() {
  const counts = new Map((await getCategories()).map((c) => [c.name, c.count]));
  const guides = TOPICS.filter((t) => (counts.get(t.category) ?? 0) > 0);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url,
          name: `Giới thiệu ${site.name}`,
          inLanguage: "vi-VN",
          about: { "@id": `${site.url}/#organization` },
          mainEntity: { "@id": `${site.url}/#business` },
        }}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Giới thiệu", url },
        ])}
      />

      <PageHero
        title={`Về ${site.name}`}
        subtitle={`Hơn ${site.experienceYears} năm gửi hàng quốc tế từ Việt Nam — lấy hàng tận nơi, đóng gói chuẩn, giao tận tay người nhận.`}
        crumbs={[{ name: "Giới thiệu", href: "/gioi-thieu" }]}
      />

      <div className="mx-auto max-w-4xl space-y-14 px-6 py-12">
        <section>
          <h2 className="text-2xl font-black text-ink">{site.name} là ai?</h2>
          <p className="mt-4 text-lg text-ink-soft">
            {faqs[0].a} Công ty có trụ sở tại TP. Hồ Chí Minh và chi nhánh tại Nha Trang.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">Dịch vụ</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className="block h-full rounded-2xl border border-brand-50 bg-white p-4 shadow-sm hover:border-brand-200"
                >
                  <span className="font-bold text-ink">{s.title}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{s.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">Quy trình gửi hàng</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {steps.map((st, i) => (
              <li key={st.title} className="rounded-2xl bg-brand-50 p-5">
                <span className="font-black text-brand-600">Bước {i + 1}. </span>
                <span className="font-bold text-ink">{st.title}</span>
                <p className="mt-1 text-ink-soft">{st.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-black text-ink">Văn phòng & liên hệ</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {site.branches.map((b) => (
              <div key={b.name} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <MapPin className="h-4 w-4 text-brand-600" /> {b.name}
                </div>
                <p className="mt-1 text-ink-soft">{b.address}</p>
                {b.phones.map((p) => (
                  <p key={p} className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-600" />
                    <CallAction phone={p.replace(/\./g, "")} className="font-semibold text-brand-600">
                      {p}
                    </CallAction>
                  </p>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-2 text-ink-soft">
            <Clock className="h-4 w-4 text-brand-600" /> Giờ làm việc: {site.hours}
          </p>
        </section>

        {guides.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-ink">Cẩm nang theo tuyến</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {guides.map((t) => (
                <li key={t.category}>
                  <Link
                    href={`/tin-tuc?cat=${encodeURIComponent(t.category)}`}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-white px-4 py-2 font-semibold text-brand-700 hover:border-brand-300"
                  >
                    {t.category} ({counts.get(t.category)}) <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-black text-ink">Câu hỏi thường gặp về {site.name}</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
                <p className="mt-2 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
