import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Globe,
  Package,
  Phone,
  PhoneCall,
  Truck,
  PlaneTakeoff,
  Gift,
  ShieldCheck,
  BadgeCheck,
  Map as MapIcon,
  Headphones,
  MessageCircle,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { ServiceMedia } from "@/components/site/service-media";
import { ArticleCard } from "@/components/site/article-card";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { QuoteCalculator } from "@/components/site/quote-calculator";
import { gallery } from "@/lib/gallery";
import { JsonLd, faqJsonLd } from "@/lib/structured-data";
import { partners, services, site } from "@/lib/site";
import { getPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

const homeFaqs = [
  {
    q: "Minh Thiện Logistics gửi hàng đi được những nước nào?",
    a: "Minh Thiện Logistics nhận gửi hàng đi hơn 200 quốc gia, phổ biến nhất là Mỹ, Úc, Canada, Châu Âu (Anh, Pháp, Đức), Nhật Bản và Hàn Quốc; đồng thời nhận nhập hàng từ Trung Quốc, Thái Lan và Âu – Mỹ.",
  },
  {
    q: "Thời gian gửi hàng đi quốc tế mất bao lâu?",
    a: "Tùy tuyến và loại dịch vụ, hàng thường tới tay người nhận trong khoảng 3–7 ngày. Nhân viên sẽ lấy hàng tận nơi trong vòng 24 giờ sau khi bạn đặt.",
  },
  {
    q: "Làm sao để nhận báo giá gửi hàng?",
    a: `Bạn gọi hotline ${site.phoneDisplay} (${site.contactName}) qua Zalo/Viber hoặc điền form báo giá trên website. Minh Thiện báo giá miễn phí, chính xác trong vòng 5 phút.`,
  },
];

export default async function HomePage() {
  const latestArticles = await getPublishedArticles({ take: 3 });
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* Hero */}
      <section className="mesh-bg relative overflow-hidden">
        <span className="animate-float absolute -left-10 top-24 h-40 w-40 rounded-full bg-sun-400/30" />
        <span className="animate-float absolute bottom-10 right-24 h-24 w-24 rounded-full bg-coral-500/20" style={{ animationDelay: "-3s" }} />
        <div className="relative mx-auto grid grid-cols-1 max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-600 shadow-sm">
              <Globe className="h-4 w-4 text-sun-400" /> Vận chuyển tới hơn 200 quốc gia
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] text-ink md:text-[56px]">
              Gửi hàng đi quốc tế
              <br />
              <span className="grad-text">nhanh, an toàn,</span>{" "}
              <span className="text-coral-500">giá tốt</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              {site.name} chuyển phát hàng đi Mỹ, Úc, Canada, Châu Âu, Nhật, Hàn… và nhập
              hàng Trung Quốc – Thái Lan tận nơi. Tư vấn miễn phí, báo giá trong 5 phút.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#bao-gia"
                className="flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
              >
                <Calculator className="h-5 w-5" /> Nhận báo giá miễn phí
              </Link>
              <Link
                href="#dich-vu"
                className="flex items-center gap-2 rounded-full border border-brand-100 bg-white px-7 py-3.5 font-semibold text-ink transition hover:bg-brand-50"
              >
                <Package className="h-5 w-5" /> Xem dịch vụ
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-black text-brand-600">200+</div>
                <div className="text-sm text-ink-soft">Quốc gia</div>
              </div>
              <div>
                <div className="text-3xl font-black text-coral-500">10K+</div>
                <div className="text-sm text-ink-soft">Đơn / tháng</div>
              </div>
              <div>
                <div className="text-3xl font-black text-sun-500">8+</div>
                <div className="text-sm text-ink-soft">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>

          {/* Hero image + quote card */}
          <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/cargo-port.jpg"
            alt="Vận chuyển hàng hóa quốc tế"
            className="h-64 w-full rounded-[28px] object-cover shadow-xl shadow-brand-500/20"
          />
          <div id="bao-gia" className="relative z-10 mx-3 -mt-20 rounded-[28px] bg-white p-7 shadow-2xl shadow-brand-500/20">
            <span className="absolute -right-3 -top-3 rounded-full bg-sun-400 px-3 py-1.5 text-xs font-bold text-white shadow">
              Miễn phí 100%
            </span>
            <QuoteCalculator />
          </div>
          </div>
        </div>
      </section>

      {/* Partner marquee */}
      <section className="overflow-hidden border-y border-brand-50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-6">
          <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-ink-muted">
            Đối tác vận chuyển
          </span>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-12 whitespace-nowrap text-2xl font-extrabold text-ink-muted/50">
              {[...partners, ...partners].map((p, i) => (
                <span key={i}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="dich-vu" className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Dịch vụ</span>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Gửi hàng đi khắp thế giới</h2>
          <p className="mt-3 text-ink-soft">
            Chọn điểm đến — chúng tôi lo trọn gói từ lấy hàng tại nhà đến giao tận tay người nhận.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const featured = s.group === "nhap-hang";
            return (
              <Reveal key={s.slug} delay={i * 60}>
                <Link
                  href={`/dich-vu/${s.slug}`}
                  className={`group block h-full rounded-3xl p-6 transition hover:-translate-y-1.5 ${
                    featured
                      ? "text-white shadow-xl shadow-brand-500/30"
                      : "border border-brand-50 bg-white shadow-sm hover:shadow-xl hover:shadow-brand-500/10"
                  }`}
                  style={featured ? { background: "linear-gradient(135deg,#1FB6A2,#0f7568)" } : undefined}
                >
                  <ServiceMedia service={s} />
                  <h3 className={`mt-4 text-lg font-bold ${featured ? "text-white" : "text-ink"}`}>
                    {s.title}
                  </h3>
                  <p className={`mt-1.5 text-sm ${featured ? "text-white/80" : "text-ink-soft"}`}>
                    {s.short}
                  </p>
                  <span
                    className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5 ${
                      featured ? "text-sun-300" : "text-brand-600"
                    }`}
                  >
                    Xem chi tiết <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-brand-50/50 py-20">
        <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-wider text-coral-500">
              Vì sao chọn Minh Thiện?
            </span>
            <h2 className="mt-2 text-3xl font-black leading-tight text-ink md:text-4xl">
              Đối tác vận chuyển
              <br />
              khách hàng tin tưởng nhất
            </h2>
            <p className="mt-4 text-ink-soft">
              Không chỉ là chuyển hàng — chúng tôi đồng hành cùng bạn trên từng đơn, minh bạch
              chi phí và cam kết thời gian.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { icon: ShieldCheck, color: "text-brand-600", title: "An toàn tuyệt đối", desc: "Đóng gói chuẩn quốc tế, bảo hiểm hàng hóa, đền bù nếu thất lạc." },
                { icon: BadgeCheck, color: "text-coral-500", title: "Giá minh bạch", desc: "Báo giá rõ ràng trước khi gửi, không phát sinh phí ẩn." },
                { icon: MapIcon, color: "text-sun-500", title: "Theo dõi 24/7", desc: "Tra cứu hành trình đơn hàng mọi lúc, cập nhật từng chặng." },
                { icon: Headphones, color: "text-brand-600", title: "Tư vấn tận tâm", desc: "Đội ngũ am hiểu thủ tục từng quốc gia, phản hồi nhanh qua Zalo." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-ink">{f.title}</div>
                    <p className="text-sm text-ink-soft">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/boxes.jpg"
              alt="Kho vận hành chuyên nghiệp của Minh Thiện Logistics"
              className="col-span-2 h-52 w-full rounded-3xl object-cover shadow-lg shadow-brand-500/10"
            />
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-4xl font-black text-brand-600">99%</div>
              <div className="mt-1 text-sm text-ink-soft">Đơn giao đúng hẹn</div>
            </div>
            <div className="rounded-3xl p-6 text-white shadow-xl shadow-brand-500/20" style={{ background: "linear-gradient(135deg,#1FB6A2,#0f7568)" }}>
              <div className="text-4xl font-black text-sun-300">5★</div>
              <div className="mt-1 text-sm text-white/80">Đánh giá khách hàng</div>
            </div>
            <div className="rounded-3xl bg-coral-500 p-6 text-white shadow-xl shadow-coral-500/30">
              <div className="text-4xl font-black">24h</div>
              <div className="mt-1 text-sm text-white/90">Lấy hàng tận nơi</div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="text-4xl font-black text-sun-500">3–7</div>
              <div className="mt-1 text-sm text-ink-soft">Ngày tới tay người nhận</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section id="quy-trinh" className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Quy trình</span>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Gửi hàng chỉ với 4 bước</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            { n: "01", icon: PhoneCall, title: "Liên hệ & báo giá", desc: "Gọi hotline hoặc nhắn Zalo, nhận báo giá trong 5 phút." },
            { n: "02", icon: Truck, title: "Lấy hàng tận nơi", desc: "Nhân viên đến tận nhà nhận hàng, đóng gói chuẩn quốc tế." },
            { n: "03", icon: PlaneTakeoff, title: "Vận chuyển & tracking", desc: "Hàng đi tuyến quốc tế, bạn theo dõi hành trình mọi lúc." },
            { n: "04", icon: Gift, title: "Giao tận tay", desc: "Giao đến tận địa chỉ người nhận, xác nhận hoàn tất.", featured: true },
          ].map((step, i) => (
            <Reveal key={step.n} delay={i * 70}>
              <div
                className={`relative h-full rounded-3xl p-6 ${
                  step.featured ? "text-white shadow-xl shadow-brand-500/30" : "border border-brand-50 bg-white shadow-sm"
                }`}
                style={step.featured ? { background: "linear-gradient(135deg,#1FB6A2,#0f7568)" } : undefined}
              >
                <div className={`absolute right-5 top-4 text-5xl font-black ${step.featured ? "text-white/10" : "text-brand-50"}`}>
                  {step.n}
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.featured ? "bg-white/15 text-sun-300" : "bg-brand-50 text-brand-600"}`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className={`mt-4 font-bold ${step.featured ? "text-white" : "text-ink"}`}>{step.title}</h3>
                <p className={`mt-1.5 text-sm ${step.featured ? "text-white/80" : "text-ink-soft"}`}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Thư viện hàng thật */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Hàng thật khách đã gửi</span>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Hình ảnh thực tế tại kho</h2>
          <p className="mt-3 text-ink-soft">
            Mỗi ngày Minh Thiện đóng gói và gửi đi hàng trăm kiện — đây là hình ảnh thật, minh bạch và đáng tin.
          </p>
        </Reveal>
        <div className="mt-10">
          <GalleryGrid items={gallery.slice(0, 8)} />
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/thu-vien"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-7 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Xem toàn bộ thư viện <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-[32px] p-10 text-center text-white md:p-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/delivery.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(120deg,rgba(15,117,104,0.92),rgba(21,148,132,0.85) 60%,rgba(31,182,162,0.80))" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mascot/pose-6-giao-hang.png"
            alt="Mascot Minh Thiện"
            className="pointer-events-none absolute -bottom-2 left-4 z-10 hidden h-52 drop-shadow-2xl lg:block xl:left-12 xl:h-60"
          />
          <div className="relative">
            <h2 className="text-3xl font-black md:text-4xl">Bạn cần gửi hàng đi nước ngoài?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Để lại thông tin hoặc gọi ngay — Minh Thiện báo giá chính xác nhất, tư vấn miễn phí 100%.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-brand-700 shadow-lg transition hover:scale-[1.03]">
                <Phone className="h-5 w-5" /> {site.phoneDisplay}
              </a>
              <a href={site.zalo} className="flex items-center gap-2 rounded-full bg-coral-500 px-8 py-3.5 font-semibold shadow-lg shadow-coral-500/30 transition hover:bg-coral-600">
                <MessageCircle className="h-5 w-5" /> Chat Zalo {site.contactName}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News preview */}
      <section className="bg-brand-50/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="flex items-end justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Tin tức & kinh nghiệm</span>
              <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Cẩm nang gửi hàng quốc tế</h2>
            </div>
            <Link href="/tin-tuc" className="hidden items-center gap-1.5 font-semibold text-brand-600 sm:inline-flex">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestArticles.map((a, i) => (
              <Reveal key={a.id} delay={i * 70}>
                <ArticleCard article={a} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
