import Link from "next/link";
import { Zap, Wallet, Check, Phone, ArrowRight } from "lucide-react";
import { GalleryGrid } from "./gallery-grid";
import { ServiceMedia } from "./service-media";
import { gallery } from "@/lib/gallery";
import { services, site } from "@/lib/site";
import { serviceContent } from "@/lib/service-content";

const HARD_GOODS = [
  { img: "thuoc-tay", label: "Thuốc tây & TPCN", note: "Khai báo đúng chuẩn, phụ thu theo loại" },
  { img: "kho-bo-ga", label: "Khô bò, khô gà", note: "Hút chân không, đóng gói kỹ" },
  { img: "hai-san-kho", label: "Hải sản khô", note: "Mực, cá, tôm khô" },
  { img: "thuc-pham-kho-dac-san", label: "Đồ khô, đặc sản", note: "Bánh kẹo, hạt, gia vị" },
  { img: "hang-kho-da-dang", label: "Thực phẩm đa dạng", note: "Đồ ăn, đồ hộp, gia vị" },
  { img: "hang-gui-da-dang", label: "Hàng kinh doanh", note: "Số lượng lớn, hàng mẫu" },
];

const SPEEDS = [
  { icon: Zap, name: "Chuyển nhanh", days: "3–5 ngày", desc: "Hàng gấp, giá trị cao — ưu tiên bay chuyến gần nhất.", featured: true },
  { icon: Wallet, name: "Tiết kiệm", days: "8–12 ngày", desc: "Tối ưu chi phí cho hàng không gấp, số lượng nhiều.", featured: false },
];

export function GuiHangMyDetail() {
  const faqs = serviceContent["gui-hang-di-my"].faqs;
  const others = services.filter((s) => s.slug !== "gui-hang-di-my").slice(0, 3);

  return (
    <>
      {/* Hàng khó */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Hàng khó? Cứ để Minh Thiện</span>
          <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Nhận cả những mặt hàng khó gửi nhất</h2>
          <p className="mt-3 text-ink-soft">
            Nhiều nơi từ chối, nhưng Minh Thiện vẫn nhận gửi đi Mỹ — đóng gói &amp; khai báo đúng chuẩn để qua hải quan:
            thuốc tây, TPCN, khô bò, khô gà, hải sản khô, yến, mỹ phẩm…
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {HARD_GOODS.map((g) => (
            <div key={g.img} className="overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/real/${g.img}.jpg`} alt={g.label} className="h-40 w-full object-cover md:h-48" />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-brand-600" />
                  <h3 className="font-bold text-ink">{g.label}</h3>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{g.note}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-ink-muted">
          * Một số mặt hàng có phụ thu hoặc cần khai báo riêng — gọi <a href={`tel:${site.phone}`} className="font-semibold text-brand-600">{site.phoneDisplay}</a> để được tư vấn.
        </p>
      </section>

      {/* 2 tốc độ */}
      <section className="bg-brand-50/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Tốc độ giao hàng</span>
            <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Chọn tốc độ phù hợp túi tiền</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {SPEEDS.map((s) => (
              <div
                key={s.name}
                className={`rounded-3xl p-7 shadow-lg ${s.featured ? "text-white shadow-coral-500/30" : "border border-brand-50 bg-white shadow-brand-500/10"}`}
                style={s.featured ? { background: "linear-gradient(135deg,#EC5E5E,#d94747)" } : undefined}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.featured ? "bg-white/20 text-white" : "bg-brand-50 text-brand-600"}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className={`mt-4 text-xl font-black ${s.featured ? "text-white" : "text-ink"}`}>{s.name}</h3>
                <div className={`mt-1 text-3xl font-black ${s.featured ? "text-white" : "text-brand-600"}`}>{s.days}</div>
                <p className={`mt-2 text-sm ${s.featured ? "text-white/85" : "text-ink-soft"}`}>{s.desc}</p>
                <Link
                  href="/#bao-gia"
                  className={`mt-5 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${s.featured ? "bg-white text-coral-600 hover:bg-white/90" : "bg-brand-500 text-white hover:bg-brand-600"}`}
                >
                  Tính cước ngay
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-ink-muted">Giá theo cân nặng &amp; loại hàng — xem ước tính ngay ở công cụ báo giá hoặc gọi {site.phoneDisplay}.</p>
        </div>
      </section>

      {/* FAQ + Hàng thật + Dịch vụ khác */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black text-ink">Câu hỏi thường gặp</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
                <p className="mt-2 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-black text-ink">Hàng thực tế khách đã gửi đi Mỹ</h2>
          <p className="mt-2 text-ink-soft">Hình ảnh thật tại kho Minh Thiện — minh bạch, đáng tin.</p>
          <div className="mt-5">
            <GalleryGrid items={gallery.slice(0, 8)} aspect="landscape" />
          </div>
          <div className="mt-4">
            <Link href="/thu-vien" className="inline-flex items-center gap-1.5 font-semibold text-brand-600">
              Xem thêm hàng đã gửi <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 rounded-3xl bg-brand-50 p-8 text-center">
          <h3 className="text-2xl font-black text-ink">Sẵn sàng gửi hàng đi Mỹ?</h3>
          <p className="mt-2 text-ink-soft">Tư vấn miễn phí, báo giá chính xác trong 5 phút.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 rounded-full bg-coral-500 px-7 py-3 font-semibold text-white shadow-lg shadow-coral-500/30 hover:bg-coral-600">
              <Phone className="h-5 w-5" /> {site.phoneDisplay}
            </a>
            <Link href="/lien-he" className="rounded-full border border-brand-200 bg-white px-7 py-3 font-semibold text-brand-700">
              Gửi yêu cầu báo giá
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-black text-ink">Dịch vụ khác</h2>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {others.map((s) => (
              <Link key={s.slug} href={`/dich-vu/${s.slug}`} className="group flex items-center justify-between rounded-3xl border border-brand-50 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <ServiceMedia service={s} size="sm" />
                  <span className="font-bold text-ink">{s.title}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-brand-600 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
