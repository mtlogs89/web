import Link from "next/link";
import {
  ArrowRight,
  Box,
  Calculator,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  PackageCheck,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { GalleryGrid } from "./gallery-grid";
import { ServiceMedia } from "./service-media";
import { gallery } from "@/lib/gallery";
import { services, site } from "@/lib/site";
import { serviceContent } from "@/lib/service-content";

const BENEFITS = [
  { icon: Truck, title: "Nhận hàng tận nơi", text: "Hỗ trợ nhận hàng tại nhà và gom nhiều loại hàng trong cùng một kiện." },
  { icon: PackageCheck, title: "Đóng gói phù hợp", text: "Kiểm tra, phân loại và gia cố theo đặc tính của từng mặt hàng." },
  { icon: FileCheck2, title: "Hỗ trợ khai báo", text: "Tư vấn thông tin hàng hóa và chứng từ cần thiết trước khi gửi." },
  { icon: MapPin, title: "Giao tận địa chỉ", text: "Giao đến nhà người nhận tại các bang và thành phố trên toàn nước Mỹ." },
];

const GOODS = [
  { img: "thuoc-tay", title: "Thuốc và thực phẩm bổ sung", text: "Cần kiểm tra thành phần, số lượng và hồ sơ trước khi nhận." },
  { img: "thuc-pham-kho-dac-san", title: "Thực phẩm khô, đặc sản", text: "Bánh kẹo, cà phê, gia vị và thực phẩm đóng gói còn hạn sử dụng." },
  { img: "hai-san-kho", title: "Hải sản và đồ khô", text: "Cá, tôm, mực khô cần hút chân không, nhãn rõ ràng và đóng gói kín." },
  { img: "hang-gui-da-dang", title: "Quà tặng, đồ cá nhân", text: "Quần áo, giày dép, sách, đồ gia dụng nhỏ và quà cho người thân." },
  { img: "hang-kho-da-dang", title: "Mỹ phẩm, sản phẩm chăm sóc", text: "Ưu tiên hàng có thương hiệu, tem nhãn, thành phần và hạn sử dụng." },
  { img: "kho-bo-ga", title: "Hàng cần kiểm tra riêng", text: "Sản phẩm có nguồn gốc động vật hoặc thành phần đặc biệt cần tư vấn trước." },
];

const PROCESS = [
  { icon: Phone, title: "Gửi thông tin", text: "Cho biết loại hàng, số lượng, cân nặng và địa chỉ nhận tại Mỹ." },
  { icon: ShieldCheck, title: "Kiểm tra hàng", text: "Nhân viên tư vấn mặt hàng được nhận, lưu ý khai báo và chi phí dự kiến." },
  { icon: Box, title: "Nhận và đóng gói", text: "Hàng được kiểm đếm, phân loại, đóng gói và xác nhận lại trước khi bay." },
  { icon: Plane, title: "Vận chuyển", text: "Cung cấp mã theo dõi để khách chủ động kiểm tra hành trình kiện hàng." },
  { icon: CheckCircle2, title: "Giao tận tay", text: "Đơn vị phát hàng liên hệ và giao đến địa chỉ người nhận tại Mỹ." },
];

const SPEEDS = [
  { name: "Chuyển nhanh", time: "Khoảng 3–5 ngày", text: "Phù hợp với hồ sơ, quà tặng hoặc hàng cần nhận sớm.", accent: true },
  { name: "Tiết kiệm", time: "Khoảng 8–12 ngày", text: "Phù hợp với kiện hàng không gấp và ưu tiên tối ưu chi phí.", accent: false },
];

export function GuiHangMyDetail({ articleHtml }: { articleHtml?: string | null }) {
  const faqs = serviceContent["gui-hang-di-my"].faqs;
  const others = services.filter((service) => service.slug !== "gui-hang-di-my").slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
              <Sparkles className="h-4 w-4" /> Dịch vụ trọn gói từ Việt Nam đến Mỹ
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-ink sm:text-4xl">
              Gửi hàng đi Mỹ rõ quy trình, dễ theo dõi và giao tận nhà
            </h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-ink-soft">
              <p>
                Minh Thiện Logistics hỗ trợ khách cá nhân và doanh nghiệp gửi hàng từ Việt Nam đi Mỹ. Từ bước kiểm tra mặt hàng, nhận hàng, đóng gói đến khai báo và theo dõi vận chuyển đều được hướng dẫn rõ ràng trước khi gửi.
              </p>
              <p>
                Mỗi kiện hàng có yêu cầu khác nhau. Vì vậy, cước phí và thời gian được xác định dựa trên loại hàng, kích thước, trọng lượng, địa chỉ giao và hình thức vận chuyển mà khách lựa chọn.
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={`tel:${site.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-bold text-white shadow-lg shadow-coral-500/25 transition hover:bg-coral-600">
                <Phone className="h-5 w-5" /> Gọi {site.phoneDisplay}
              </a>
              <a href={site.zalo} className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3 font-bold text-brand-700 transition hover:bg-brand-50">
                Gửi ảnh hàng qua Zalo
              </a>
            </div>
          </div>

          <aside className="rounded-3xl bg-ink p-6 text-white shadow-xl sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-200">Thông tin cần để báo giá</p>
            <ul className="mt-5 space-y-4">
              {["Tên và số lượng từng mặt hàng", "Cân nặng, kích thước kiện dự kiến", "Thành phố hoặc ZIP code tại Mỹ", "Thời gian mong muốn nhận hàng"].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-white/85">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" /> {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/80">
              Chụp ảnh hàng và gửi trước sẽ giúp nhân viên kiểm tra nhanh, hạn chế phát sinh sau khi nhận kiện.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-y border-brand-50 bg-brand-50/45 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-coral-500">Vì sao chọn Minh Thiện?</p>
            <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Một đầu mối hỗ trợ suốt hành trình</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-lg font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
              </article>
            ))}
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
              <img src={`/images/real/${item.img}.jpg`} alt={item.title} className="aspect-[16/10] w-full object-cover" />
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
      </section>

      <section className="bg-ink py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-300">Quy trình 5 bước</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Đơn giản, không cần hiệu ứng nặng</h2>
            <p className="mt-3 leading-7 text-white/70">Quy trình dạng thẻ tĩnh hiển thị ổn định trên điện thoại, máy tính bảng và máy tính.</p>
          </div>
          <ol className="mt-9 grid gap-4 md:grid-cols-5">
            {PROCESS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="relative rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white"><Icon className="h-5 w-5" /></div>
                  <span className="text-3xl font-black text-white/15">0{index + 1}</span>
                </div>
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-50 text-coral-600"><Calculator className="h-6 w-6" /></div>
            <h2 className="mt-4 text-3xl font-black text-ink">Cước gửi hàng đi Mỹ được tính thế nào?</h2>
            <p className="mt-4 leading-7 text-ink-soft">Đơn vị vận chuyển so sánh trọng lượng thực tế với trọng lượng quy đổi theo kích thước và dùng mức lớn hơn để tính cước.</p>
            <div className="mt-5 rounded-3xl border border-brand-100 bg-brand-50 p-5 text-center sm:p-6">
              <p className="text-sm font-bold text-brand-700">CÔNG THỨC THAM KHẢO</p>
              <p className="mt-2 text-lg font-black text-ink sm:text-xl">Dài × Rộng × Cao (cm) ÷ hệ số quy đổi</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink-muted">Hệ số và phụ phí có thể khác theo hãng, loại hàng và thời điểm. Báo giá chỉ chính xác sau khi có thông tin kiện hàng.</p>
          </div>
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Clock3 className="h-6 w-6" /></div>
            <h2 className="mt-4 text-3xl font-black text-ink">Hai lựa chọn thời gian</h2>
            <div className="mt-5 space-y-4">
              {SPEEDS.map((speed) => (
                <article key={speed.name} className={`rounded-3xl border p-5 sm:p-6 ${speed.accent ? "border-coral-200 bg-coral-50" : "border-brand-100 bg-brand-50"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-black text-ink">{speed.name}</h3>
                    <span className={`font-black ${speed.accent ? "text-coral-600" : "text-brand-700"}`}>{speed.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{speed.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-ink-muted">Thời gian là dự kiến, tính từ khi hàng hoàn tất xử lý và không bao gồm trường hợp kiểm tra hải quan hoặc phát sinh ngoài lịch vận chuyển.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-50 bg-brand-50/40 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-coral-500">Chuẩn bị trước khi gửi</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Thông tin càng rõ, xử lý càng nhanh</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Danh sách hàng và số lượng chính xác", "Bao bì, nhãn hiệu và hạn sử dụng", "Tên, điện thoại, địa chỉ người nhận", "Giá trị khai báo của kiện hàng", "Ảnh chụp hàng trước khi đóng gói", "Yêu cầu về thời gian hoặc bảo hiểm"].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span className="text-sm font-semibold leading-6 text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-ink">Câu hỏi thường gặp</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="group rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none pr-8 font-bold text-ink">{faq.q}</summary>
                <p className="mt-3 border-t border-brand-50 pt-3 leading-7 text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </div>
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

        {articleHtml && (
          <div className="mx-auto mt-14 max-w-3xl">
            <h2 className="text-3xl font-black text-ink">Cẩm nang gửi hàng đi Mỹ từ A đến Z</h2>
            <div
              className="prose-mt mt-6"
              dangerouslySetInnerHTML={{
                __html: articleHtml.replace(/<img /g, '<img loading="lazy" decoding="async" '),
              }}
            />
          </div>
        )}

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
