import Link from "next/link";
import Image from "next/image";
import { CallAction } from "@/components/site/call-action";
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
import { getDestinations } from "@/lib/price-tables";
import { getGalleryItems } from "@/lib/gallery";
import { JsonLd, faqJsonLd } from "@/lib/structured-data";
import { partners, site } from "@/lib/site";
import { getServiceCards } from "@/lib/service-cards";
import { getPublishedArticles } from "@/lib/articles";
import { getHomeSettings } from "@/lib/settings";
import { laySoGiao } from "@/lib/delivery-stats";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Hỏi–đáp trang chủ. QUAN TRỌNG: trang chủ là nơi AI đọc nhiều nhất — 14 ngày gần nhất
 * các bot chỉ-chạy-khi-có-người-hỏi (ChatGPT-User, Perplexity-User, Claude-User) mở "/"
 * 137 lượt, trong khi mỗi bài viết chỉ 1 lượt. Nên mọi dữ kiện cốt lõi của công ty phải
 * trả lời được ngay tại đây.
 *
 * ⚠️ Danh sách này vừa đổ ra schema FAQPage vừa PHẢI hiện cho người đọc thấy — Google chỉ
 * tính hỏi–đáp có nội dung hiển thị. Trước 28/09/2026 nó chỉ nằm trong schema, khách không
 * thấy gì. Sửa nội dung ở đây là đổi cả hai nơi.
 */
const homeFaqs = [
  {
    q: "Minh Thiện Logistics gửi hàng đi được những nước nào?",
    a: "Minh Thiện Logistics nhận gửi hàng đi hơn 200 quốc gia, phổ biến nhất là Mỹ, Canada, Úc, Châu Âu, Nhật Bản, Hàn Quốc, Singapore, Malaysia, Thái Lan và Đài Loan; đồng thời nhận nhập hàng, mua hộ từ Trung Quốc, Thái Lan và Âu – Mỹ.",
  },
  {
    q: "Gửi hàng đi quốc tế mất bao lâu?",
    a: "Tính theo ngày làm việc, từ khi hàng rời Việt Nam. Mỹ, Canada, Úc: đi nhanh 3–5 ngày, đi tiết kiệm 8–12 ngày. Châu Âu: 5–7 ngày và 8–15 ngày. Hàn Quốc 3–5 ngày, Nhật Bản 5–7 ngày, Malaysia 3–5 ngày, Thái Lan 5–7 ngày, Đài Loan 3–5 ngày, Singapore 1 ngày (nhanh) hoặc 4 ngày (tiết kiệm). Địa chỉ vùng sâu vùng xa cộng thêm 2–3 ngày tuỳ postcode.",
  },
  {
    q: "Giá đã bao gồm thuế nhập khẩu chưa?",
    a: "Tuyến Mỹ và Anh: giá trọn gói đã bao thuế đầu nhập, người nhận không phải đóng thêm — trừ vài mặt hàng đặc thù như nước hoa và bột pha trà sữa thì không bao đầu nhập và được báo trước khi nhận hàng. Các tuyến khác, trong đó có Châu Âu (EU thu VAT trên hàng nhập, mỗi nước áp dụng khác nhau), hãy gọi hotline để được báo rõ tổng chi phí trước khi gửi.",
  },
  {
    q: "Những mặt hàng nào Minh Thiện không nhận gửi?",
    a: "Rau củ và trái cây tươi, pin rời và sạc dự phòng, rượu bia, thuốc lá là các nhóm không nhận ở hầu hết tuyến. Một số nhóm như giò chả, thịt khô, sữa, trứng, thuốc tây và thực phẩm chức năng vẫn gửi được nhưng có phụ thu và có rủi ro bị hải quan giữ — nhân viên báo trước khi nhận hàng. Xem đầy đủ 41 nhóm mặt hàng cho từng tuyến tại trang Hàng gửi được.",
  },
  {
    q: "Có lấy hàng tận nơi không, mất phí không?",
    a: "Có và miễn phí trong TP.HCM — nhắn Zalo trước 15h là lấy hàng trong ngày. Khách ở Khánh Hòa mang hàng tới chi nhánh Nha Trang. Các tỉnh khác gọi hotline để được hướng dẫn gửi hàng về kho.",
  },
  {
    q: "Cước gửi hàng tính thế nào?",
    a: "Tính theo mức cao hơn giữa cân thực và cân quy đổi — cân quy đổi bằng Dài × Rộng × Cao (cm) chia 5000. Hàng nhẹ mà cồng kềnh như chăn gối, snack thường bị tính theo kích thước. Một số nhóm hàng có phụ thu riêng. Dùng công cụ tính cước trên trang để xem mức ước tính ngay.",
  },
  {
    q: "Mất hàng hoặc hư hỏng thì đền thế nào?",
    a: "Có mua bảo hiểm: đền 100% cước và giá trị hàng khai báo. Không mua bảo hiểm: đền cước và tối đa 100 USD. Mỗi kiện đều được cân trước mặt khách và chụp ảnh để đối chiếu về sau.",
  },
  {
    q: "Theo dõi đơn hàng ở đâu?",
    a: "Mỗi kiện có mã theo dõi, tra tại trang Tra cứu đơn trên website cho tới khi người nhận ký nhận.",
  },
  {
    q: "Minh Thiện Logistics là công ty nào, ở đâu?",
    a: `${site.legalName}, mã số thuế ${site.taxId}. Kho chính tại ${site.addressFull} — sát sân bay Tân Sơn Nhất; chi nhánh Nha Trang tại 45 Nguyễn Xiển, P. Bắc Nha Trang, Khánh Hòa. Làm việc ${site.hours}. Hotline và Zalo: ${site.phoneDisplay} (${site.contactName}).`,
  },
  {
    q: "Làm sao để nhận báo giá gửi hàng?",
    a: `Gọi hoặc nhắn Zalo ${site.phoneDisplay}, gửi ảnh kiện hàng kèm số ký và địa chỉ người nhận là có báo giá, không cần ra kho. Hoặc nhập số ký vào công cụ tính cước trên trang để xem mức ước tính ngay.`,
  },
];

export default async function HomePage() {
  const soGiao = await laySoGiao();
  const dongGiao = (soGiao?.dong ?? []).filter((d) => d.duDuLieu).slice(0, 2);
  const home = await getHomeSettings();
  const galleryItems = await getGalleryItems();
  const serviceCards = await getServiceCards();
  const dests = await getDestinations();

  // Bài viết nổi bật: theo admin chọn, thiếu thì bù bằng bài mới nhất.
  const featuredSlugs = home.home_featured_slugs.split(",").map((s) => s.trim()).filter(Boolean);
  let latestArticles;
  if (featuredSlugs.length > 0) {
    const picked = await prisma.article.findMany({
      where: { published: true, slug: { in: featuredSlugs } },
    });
    const bySlug = new Map(picked.map((a) => [a.slug, a]));
    const ordered = featuredSlugs.map((s) => bySlug.get(s)).filter((a): a is NonNullable<typeof a> => Boolean(a));
    if (ordered.length < 3) {
      const fill = await getPublishedArticles({ take: 3 });
      for (const a of fill) {
        if (ordered.length >= 3) break;
        if (!ordered.some((x) => x.slug === a.slug)) ordered.push(a);
      }
    }
    latestArticles = ordered.slice(0, 3);
  } else {
    latestArticles = await getPublishedArticles({ take: 3 });
  }

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
              <Globe className="h-4 w-4 text-sun-400" /> {home.home_hero_badge}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] text-ink md:text-[56px]">
              <span className="grad-text">{home.home_hero_title}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">{home.home_hero_subtitle}</p>
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
            <div className="mt-10 grid max-w-xs grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-black text-brand-600">200+</div>
                <div className="text-sm text-ink-soft">Quốc gia</div>
              </div>
              <div>
                <div className="text-3xl font-black text-sun-500">{site.experienceYears}+</div>
                <div className="text-sm text-ink-soft">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>

          {/* Hero image + quote card */}
          <div className="relative">
          <div className="relative h-64 w-full overflow-hidden rounded-[28px] shadow-xl shadow-brand-500/20">
            <Image
              src={home.home_hero_image}
              alt="Vận chuyển hàng hóa quốc tế"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <div id="bao-gia" className="relative z-10 mx-3 -mt-20 rounded-[28px] bg-white p-7 shadow-2xl shadow-brand-500/20">
            <span className="absolute -right-3 -top-3 rounded-full bg-sun-400 px-3 py-1.5 text-xs font-bold text-white shadow">
              Miễn phí 100%
            </span>
            <QuoteCalculator dests={dests} />
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
          {serviceCards.map((s, i) => {
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
            <div className="relative col-span-2 h-52 w-full overflow-hidden rounded-3xl shadow-lg shadow-brand-500/10">
              <Image
                src={home.home_whyus_image}
                alt="Kho vận hành chuyên nghiệp của Minh Thiện Logistics"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                loading="lazy"
                className="object-cover"
              />
            </div>
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
              <div className="text-4xl font-black text-sun-500">3–5</div>
              <div className="mt-1 text-sm text-ink-soft">Ngày đi nhanh Mỹ · Canada · Úc</div>
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
          <GalleryGrid items={galleryItems.slice(0, 8)} />
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
          <Image
            src={home.home_cta_image}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            loading="lazy"
            className="object-cover"
          />
          <span className="absolute inset-0" style={{ background: "linear-gradient(120deg,rgba(15,117,104,0.92),rgba(21,148,132,0.85) 60%,rgba(31,182,162,0.80))" }} />
          <div className="relative">
            <h2 className="text-3xl font-black md:text-4xl">Bạn cần gửi hàng đi nước ngoài?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Để lại thông tin hoặc gọi ngay — Minh Thiện báo giá chính xác nhất, tư vấn miễn phí 100%.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <CallAction phone={site.phone} className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-brand-700 shadow-lg transition hover:scale-[1.03]">
                <Phone className="h-5 w-5" /> {site.phoneDisplay}
              </CallAction>
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
      {/* Số đo thật từ hệ thống theo dõi — thứ đối thủ không làm giả được, và là
          loại nội dung AI chịu trích. Trang gốc: /thoi-gian-giao-thuc-te */}
      {dongGiao.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pt-4">
          <Reveal className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 md:p-8">
            <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Số đo thật</span>
            <h2 className="mt-2 text-2xl font-black text-ink md:text-3xl">Thời gian giao hàng thực tế</h2>
            <p className="mt-3 text-ink-soft">
              Không phải lời hứa — đây là số đo từ hệ thống theo dõi hành trình của chúng tôi, kỳ{" "}
              {soGiao?.kyTu?.split("-").reverse().join("/")} – {soGiao?.kyDen?.split("-").reverse().join("/")}.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {dongGiao.map((d) => (
                <div key={d.tuyen + d.nhom} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-ink-muted">
                    Tuyến {d.tuyen} · {d.tenNhom.toLowerCase()}
                  </div>
                  <div className="mt-1 text-3xl font-black text-brand-700">{d.trungVi} ngày làm việc</div>
                  <div className="mt-1 text-sm text-ink-soft">
                    trung vị trên {d.soKien} kiện đã giao · {d.trongHan}% trong hạn {d.henLo}–{d.henHi} ngày
                  </div>
                </div>
              ))}
            </div>
            <Link href="/thoi-gian-giao-thuc-te" className="mt-5 inline-block font-semibold text-brand-600 hover:underline">
              Xem đầy đủ số liệu và cách đo →
            </Link>
          </Reveal>
        </section>
      )}

      {/* Hỏi–đáp: phải HIỆN cho người đọc thì schema FAQPage mới được tính, và đây là
          phần AI đọc nhiều nhất trên cả web. Nội dung lấy từ homeFaqs phía trên. */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Hỏi nhanh — đáp nhanh</span>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Câu hỏi thường gặp</h2>
          <p className="mt-3 text-ink-soft">
            Những điều khách hỏi nhiều nhất trước khi gửi hàng. Chưa thấy câu của bạn thì gọi{" "}
            <CallAction phone={site.phone} className="font-semibold text-brand-600">
              {site.phoneDisplay}
            </CallAction>.
          </p>
        </Reveal>
        <div className="mt-8 space-y-3">
          {homeFaqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-bold text-ink marker:hidden group-open:text-brand-600">
                {f.q}
              </summary>
              <p className="mt-3 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

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
