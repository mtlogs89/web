import type { Metadata } from "next";
import Link from "next/link";
import { Beef, Egg, MapPin, MessageCircle, Package, Phone, Pill, Store } from "lucide-react";
import { CallAction } from "@/components/site/call-action";
import { LeadForm } from "@/components/site/lead-form";
import { ZaloLink } from "@/components/site/zalo-link";
import { landingMy } from "@/lib/landing-my";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/structured-data";

/**
 * Trang đích quảng cáo ChatGPT. Chỉ dùng số liệu đã chốt với chủ:
 * giao tại Mỹ 3–5 ngày, kho Tân Sơn Nhất, điểm gom 4 tỉnh, hotline Dũng.
 * Không giá, không tên đối thủ. Chỉ nói hàng Minh Thiện nhận.
 */

const PAGE_PATH = landingMy.path;
const PAGE_URL = `${site.url}${PAGE_PATH}`;
const TITLE = "Gửi hàng đi Mỹ — thuốc tây, thịt, trứng, sữa";
const DESCRIPTION =
  "Gửi hàng từ Việt Nam đi Mỹ: thuốc tây, thịt, trứng, sữa và hàng cho người bán Amazon, Etsy, TikTok Shop. Giao tại Mỹ 3–5 ngày. Kho 5/5 Nguyễn Văn Vĩnh, phường Tân Sơn Nhất, TP.HCM. Hotline 0977064246 (Dũng).";

const WAREHOUSE = "5/5 Nguyễn Văn Vĩnh, phường Tân Sơn Nhất, TP.HCM";
const POINTS = ["Hà Nội", "Đà Nẵng", "Nha Trang", "Cần Thơ"] as const;

const faqs = [
  {
    q: "Minh Thiện nhận những mặt hàng nào đi Mỹ?",
    a: "Minh Thiện nhận mọi hàng gửi hợp pháp sang Mỹ. Khách gửi nhiều thuốc tây, thịt, trứng, sữa, và hàng cho người bán Amazon, Etsy, TikTok Shop tại Mỹ.",
  },
  {
    q: "Hàng tới Mỹ trong bao lâu?",
    a: "Giao tại Mỹ trong 3–5 ngày.",
  },
  {
    q: "Gửi hàng ở đâu?",
    a: `Kho chính tại ${WAREHOUSE}. Điểm gom tại Hà Nội, Đà Nẵng, Nha Trang và Cần Thơ.`,
  },
  {
    q: "Liên hệ báo giá với ai?",
    a: `Gọi hoặc nhắn Zalo ${landingMy.phone} (${landingMy.contactName}), hoặc điền form trên trang này.`,
  },
  {
    q: "Có gửi hàng FBA và fulfillment không?",
    a: "Có. Minh Thiện nhận hàng gửi cho người bán Amazon, Etsy và TikTok Shop tại Mỹ, gồm hàng FBA và fulfillment.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    locale: "vi_VN",
    type: "website",
    siteName: site.name,
    images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-cover.jpg"],
  },
};

const callClass =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C4474F] px-4 text-base font-bold text-white shadow-lg shadow-[#C4474F]/25 transition hover:bg-[#B23A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a]";
const zaloClass =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0068FF] px-4 text-base font-bold text-white shadow-lg shadow-[#0068FF]/25 transition hover:bg-[#0056D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a]";

function ContactButtons({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <CallAction
        id={`${idPrefix}-call`}
        phone={landingMy.phone}
        ariaLabel={`Gọi ${landingMy.contactName} ${landingMy.phone}`}
        className={callClass}
      >
        <Phone className="h-5 w-5 shrink-0" aria-hidden />
        Gọi {landingMy.phone}
      </CallAction>
      <ZaloLink id={`${idPrefix}-zalo`} href={landingMy.zalo} className={zaloClass}>
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
        Zalo
      </ZaloLink>
    </div>
  );
}

const categories = [
  {
    title: "Thuốc tây",
    text: "Nhận thuốc tây gửi từ Việt Nam sang Mỹ.",
    icon: Pill,
    tint: "bg-[#DC5A62]/12 text-[#C4474F]",
  },
  {
    title: "Thịt",
    text: "Nhận sản phẩm thịt gửi đi Mỹ.",
    icon: Beef,
    tint: "bg-[#F2AE52]/25 text-[#8A5A10]",
  },
  {
    title: "Trứng và sữa",
    text: "Nhận trứng và sữa gửi đi Mỹ.",
    icon: Egg,
    tint: "bg-[#4DC3B5]/20 text-[#0E7568]",
  },
  {
    title: "Hàng hợp pháp khác",
    text: "Mọi hàng gửi hợp pháp sang Mỹ, Minh Thiện đều nhận.",
    icon: Package,
    tint: "bg-[#4DC3B5]/20 text-[#0E7568]",
  },
] as const;

const steps = [
  {
    n: "1",
    title: "Giao hàng hoặc lấy hàng tại điểm gom",
    text: "Mang hàng tới kho chính ở TP.HCM hoặc điểm gom Hà Nội, Đà Nẵng, Nha Trang, Cần Thơ. Cần lấy hàng thì gọi Dũng.",
  },
  {
    n: "2",
    title: "Đóng gói và gửi đi",
    text: "Minh Thiện đóng gói kiện hàng và gửi sang Mỹ.",
  },
  {
    n: "3",
    title: "Giao tại Mỹ trong 3–5 ngày",
    text: "Người nhận tại Mỹ nhận hàng trong 3–5 ngày.",
  },
] as const;

export default function GuiHangDiMyPage() {
  return (
    <div className="lp-my">
      <JsonLd
        data={serviceJsonLd({
          name: "Gửi hàng đi Mỹ",
          description: DESCRIPTION,
          url: PAGE_URL,
          areaServed: { "@type": "Country", name: "United States" },
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Gửi hàng đi Mỹ", url: PAGE_URL },
        ])}
      />

      <a
        href="#bao-gia"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
      >
        Tới form báo giá
      </a>

      <section className="lp-hero relative overflow-hidden">
        <div className="relative mx-auto grid max-w-7xl items-start gap-8 px-6 pb-12 pt-6 md:gap-10 md:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:pb-20">
          <div className="lp-in">
            {/* Logo gốc public/images/logo-full.png — cùng cách header dùng <img> cho logo. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-full.png"
              alt="Minh Thiện Logistics"
              width={782}
              height={769}
              fetchPriority="high"
              className="h-auto w-28 md:w-44"
            />
            <nav aria-label="Đường dẫn" className="mt-6 text-base text-ink-muted">
              <Link href="/" className="font-medium hover:text-[#0E7568]">
                Trang chủ
              </Link>
              <span aria-hidden> / </span>
              <span className="font-semibold text-ink">Gửi hàng đi Mỹ</span>
            </nav>
            <p className="mt-5 inline-flex rounded-full bg-white px-4 py-1.5 text-base font-bold text-[#0E7568] shadow-sm">
              Giao tại Mỹ trong 3–5 ngày
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.12] text-ink md:text-5xl">
              Gửi hàng đi Mỹ
              <span className="mt-1 block text-[#0E7568]">trong 3–5 ngày</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
              Thuốc tây, thịt, trứng, sữa, và hàng cho người bán Amazon, Etsy, TikTok Shop tại Mỹ.
              Minh Thiện nhận mọi hàng gửi hợp pháp từ Việt Nam sang Mỹ.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-base font-semibold text-ink">
              <li className="rounded-full bg-[#4DC3B5]/25 px-3 py-1.5">Mọi hàng hợp pháp</li>
              <li className="rounded-full bg-[#F2AE52]/35 px-3 py-1.5">Kho Tân Sơn Nhất</li>
              <li className="rounded-full bg-white px-3 py-1.5 shadow-sm">Điểm gom 4 tỉnh</li>
            </ul>
            {/* Trên điện thoại, thanh dính đáy đã có Gọi và Zalo — khỏi lặp và khỏi bị thanh đó che. */}
            <div className="mt-8 hidden max-w-lg md:block">
              <ContactButtons idPrefix="lp-hero" />
            </div>
          </div>

          <div id="bao-gia" className="scroll-mt-28 rounded-[28px] border border-[#4DC3B5]/40 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(20,50,58,0.45)] sm:p-7">
            <LeadForm
              compact
              defaultRoute="Gửi đi Mỹ"
              source={PAGE_PATH}
              notePlaceholder="Thuốc tây, thịt, trứng, sữa, hàng Amazon"
              phone={landingMy.phone}
              contactName={landingMy.contactName}
              zaloHref={landingMy.zalo}
            />
          </div>
        </div>
      </section>

      <section id="hang" aria-labelledby="hang-title" className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <h2 id="hang-title" className="text-3xl font-black text-ink md:text-4xl">
          Hàng Minh Thiện nhận gửi đi Mỹ
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Minh Thiện nhận mọi hàng gửi hợp pháp sang Mỹ. Các nhóm nổi bật:
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
            <li key={item.title} className="rounded-3xl border border-[#4DC3B5]/30 bg-white p-5 shadow-sm">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.tint}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-4 text-xl font-black text-ink">{item.title}</h3>
              <p className="mt-1.5 text-lg leading-relaxed text-ink-soft">{item.text}</p>
            </li>
            );
          })}
        </ul>
      </section>

      <section id="quy-trinh" aria-labelledby="quy-trinh-title" className="bg-[#f7fbfa]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <h2 id="quy-trinh-title" className="text-3xl font-black text-ink md:text-4xl">
            Ba bước gửi hàng
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n} className="rounded-3xl bg-white p-6 shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2AE52] text-xl font-black text-ink">
                  {step.n}
                </span>
                <h3 className="mt-4 text-xl font-black leading-snug text-ink">{step.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="nguoi-ban" aria-labelledby="nguoi-ban-title" className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="rounded-[28px] bg-[#0E7568] px-6 py-10 text-white md:px-10 md:py-12">
          <span className="inline-flex items-center gap-2 text-base font-bold text-[#F2AE52]">
            <Store className="h-5 w-5" aria-hidden />
            Người bán tại Mỹ
          </span>
          <h2 id="nguoi-ban-title" className="mt-3 text-3xl font-black leading-tight md:text-4xl">
            Gửi hàng cho Amazon, Etsy và TikTok Shop
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Bạn ở Việt Nam, người bán ở Mỹ. Minh Thiện nhận hàng gửi tới Amazon, Etsy và TikTok Shop,
            gồm hàng FBA và fulfillment.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["Amazon", "Etsy", "TikTok Shop"].map((name) => (
              <li key={name} className="rounded-2xl bg-white/10 px-4 py-4 text-xl font-black">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="kho" aria-labelledby="kho-title" className="bg-[#f7fbfa]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:py-16 lg:grid-cols-2">
          <div>
            <h2 id="kho-title" className="text-3xl font-black text-ink md:text-4xl">
              Kho và điểm gom
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Kho chính của Minh Thiện ở TP.HCM. Khách ở tỉnh mang hàng tới điểm gom hoặc gọi Dũng để lấy hàng.
            </p>
            <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-ink">Kho chính</h3>
              <p className="mt-2 flex gap-2 text-lg leading-relaxed text-ink">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C4474F]" aria-hidden />
                <a
                  href={site.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0E7568] underline decoration-[#4DC3B5] underline-offset-4"
                >
                  {WAREHOUSE}
                </a>
              </p>
              <p className="mt-3 text-lg text-ink-soft">Giờ làm việc: {site.hours}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-ink">Điểm gom trên cả nước</h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {POINTS.map((city) => (
                <li key={city} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 text-lg font-bold text-ink shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4DC3B5]/25 text-[#0E7568]">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="hoi-dap" aria-labelledby="hoi-dap-title" className="mx-auto max-w-3xl px-6 py-14 md:py-16">
        <h2 id="hoi-dap-title" className="text-3xl font-black text-ink md:text-4xl">
          Câu hỏi thường gặp
        </h2>
        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <article key={item.q} className="rounded-3xl border border-[#4DC3B5]/30 bg-white p-5 shadow-sm md:p-6">
              <h3 className="text-xl font-black leading-snug text-ink">{item.q}</h3>
              <p className="mt-2 text-lg leading-relaxed text-ink-soft">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="ket-title" className="px-6 pb-16">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-[#F2AE52]/30 px-6 py-10 text-center md:px-10">
          <h2 id="ket-title" className="text-3xl font-black text-ink md:text-4xl">
            Nhận báo giá gửi hàng đi Mỹ
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-ink">
            Gọi {landingMy.phone}, nhắn Zalo, hoặc điền form. {landingMy.contactName} tiếp nhận yêu cầu của bạn.
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <ContactButtons idPrefix="lp-final" />
          </div>
          <a
            href="#bao-gia"
            className="mt-4 inline-flex min-h-12 items-center justify-center font-bold text-[#0E7568] underline decoration-[#4DC3B5] underline-offset-4"
          >
            Điền form báo giá
          </a>
        </div>
      </section>

      <div
        role="region"
        aria-label="Liên hệ nhanh"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#4DC3B5]/60 bg-white/95 px-3 pt-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <CallAction
            id="lp-bar-call"
            phone={landingMy.phone}
            ariaLabel={`Gọi ${landingMy.contactName} ${landingMy.phone}`}
            className="flex min-h-14 w-full items-center justify-center gap-1.5 rounded-2xl bg-[#C4474F] px-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a]"
          >
            <Phone className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-center leading-tight">
              <span className="block text-sm font-bold">Gọi</span>
              <span className="block text-[15px] font-bold tracking-wide">{landingMy.phone}</span>
            </span>
          </CallAction>
          <ZaloLink
            id="lp-bar-zalo"
            href={landingMy.zalo}
            className="flex min-h-14 w-full items-center justify-center gap-1.5 rounded-2xl bg-[#0068FF] px-2 text-base font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a]"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            Zalo
          </ZaloLink>
        </div>
      </div>
    </div>
  );
}
