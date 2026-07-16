import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { GalleryGrid } from "./gallery-grid";
import { ServiceMedia } from "./service-media";
import { QuoteCalculator } from "./quote-calculator";
import { gallery } from "@/lib/gallery";
import { services, site } from "@/lib/site";

const GOODS = [
  { img: "thuoc-tay", title: "Thuốc và thực phẩm bổ sung", text: "Cần kiểm tra thành phần, số lượng và hồ sơ trước khi nhận." },
  { img: "thuc-pham-kho-dac-san", title: "Thực phẩm khô, đặc sản", text: "Bánh kẹo, cà phê, gia vị và thực phẩm đóng gói còn hạn sử dụng." },
  { img: "hai-san-kho", title: "Hải sản và đồ khô", text: "Cá, tôm, mực khô cần hút chân không, nhãn rõ ràng và đóng gói kín." },
  { img: "hang-gui-da-dang", title: "Quà tặng, đồ cá nhân", text: "Quần áo, giày dép, sách, đồ gia dụng nhỏ và quà cho người thân." },
  { img: "hang-kho-da-dang", title: "Mỹ phẩm, sản phẩm chăm sóc", text: "Ưu tiên hàng có thương hiệu, tem nhãn, thành phần và hạn sử dụng." },
  { img: "kho-bo-ga", title: "Hàng cần kiểm tra riêng", text: "Sản phẩm có nguồn gốc động vật hoặc thành phần đặc biệt cần tư vấn trước." },
];

export function GuiHangMyDetail({ articleHtml }: { articleHtml?: string | null }) {
  const others = services.filter((service) => service.slug !== "gui-hang-di-my").slice(0, 3);

  return (
    <>
      {articleHtml && (
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div
            className="prose-mt"
            dangerouslySetInnerHTML={{
              __html: articleHtml.replace(/<img /g, '<img loading="lazy" decoding="async" '),
            }}
          />
        </section>
      )}

      <section className="border-y border-brand-50 bg-brand-50/45 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-coral-500">Tự tính trước chi phí</p>
            <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Ước tính cước gửi hàng đi Mỹ</h2>
            <p className="mt-3 leading-7 text-ink-soft">
              Nhập cân nặng và loại hàng để xem mức cước tham khảo ngay. Giá chính thức được báo lại sau khi kiểm tra kiện hàng thực tế.
            </p>
          </div>
          <div className="mt-8 rounded-[28px] bg-white p-6 shadow-xl shadow-brand-500/10 sm:p-8">
            <QuoteCalculator />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-coral-500">Mặt hàng thường gửi</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Kiểm tra trước để gửi đúng ngay từ đầu</h2>
          <p className="mt-3 leading-7 text-ink-soft">Khả năng tiếp nhận phụ thuộc thành phần, nguồn gốc, số lượng, bao bì và quy định tại thời điểm gửi.</p>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GOODS.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/real/${item.img}.jpg`} alt={item.title} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <h3 className="flex items-start gap-2 font-black text-ink"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> {item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-sun-200 bg-sun-50 p-4 text-sm leading-6 text-ink-soft sm:p-5">
          <strong className="text-ink">Lưu ý:</strong> Không tự đóng kín kiện trước khi được kiểm tra. Các mặt hàng dạng lỏng, có pin, dễ cháy, thực phẩm có nguồn gốc động vật hoặc sản phẩm không nhãn cần được tư vấn riêng.
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-black text-ink">Hình ảnh hàng thực tế</h2>
          <p className="mt-2 text-ink-soft">Một số kiện hàng được xử lý tại kho Minh Thiện Logistics.</p>
          <div className="mt-5"><GalleryGrid items={gallery.slice(0, 8)} aspect="landscape" /></div>
          <Link href="/thu-vien" className="mt-5 inline-flex items-center gap-1.5 font-bold text-brand-700">Xem thêm thư viện <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-14 rounded-[2rem] bg-gradient-to-br from-brand-700 to-brand-900 px-5 py-9 text-center text-white sm:px-8 sm:py-12">
          <h2 className="text-3xl font-black">Bạn cần báo giá kiện hàng?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">Gửi ảnh hàng, cân nặng dự kiến và ZIP code người nhận để được kiểm tra và tư vấn phương án phù hợp.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={`tel:${site.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral-500 px-7 py-3 font-bold text-white hover:bg-coral-600"><Phone className="h-5 w-5" /> {site.phoneDisplay}</a>
            <a href={site.zalo} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-bold text-brand-800 hover:bg-brand-50">Nhắn Zalo ngay</a>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-black text-ink">Dịch vụ khác</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {others.map((service) => (
              <Link key={service.slug} href={`/dich-vu/${service.slug}`} className="group flex items-center justify-between rounded-3xl border border-brand-50 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3"><ServiceMedia service={service} size="sm" /><span className="font-bold text-ink">{service.title}</span></div>
                <ArrowRight className="h-5 w-5 shrink-0 text-brand-600 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
