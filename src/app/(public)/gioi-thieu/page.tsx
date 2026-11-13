import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import { ZaloLink } from "@/components/site/zalo-link";
import { partners, services, site } from "@/lib/site";
import { getCategories } from "@/lib/articles";
import { DESTINATIONS } from "@/lib/eu-countries";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { categoryHref, KT_PATH } from "@/lib/kien-thuc";
import { POLICY_PAGES } from "@/lib/chinh-sach";
import { laySoGiao } from "@/lib/delivery-stats";

export const dynamic = "force-dynamic";

const url = `${site.url}/gioi-thieu`;

export const metadata: Metadata = {
  title: "Giới thiệu công ty",
  description: `${site.name} (${site.legalName}, MST ${site.taxId}) — hơn ${site.experienceYears} năm kinh nghiệm gửi hàng quốc tế từ TP.HCM đi hơn 200 quốc gia. Văn phòng ${site.addressFull}, chi nhánh Nha Trang.`,
  alternates: { canonical: url },
};

/*
 * Trang Giới thiệu viết theo outline 40 mục của bên SEO (11/2026), CHỈ dùng thông tin có thật:
 * pháp nhân, MST, văn phòng, dịch vụ, chính sách chủ đã duyệt, số đo giao hàng từ hệ thống.
 * Bỏ hẳn các mục chưa có dữ liệu thật: lịch sử/năm thành lập (chủ chốt chỉ ghi "hơn 10 năm"),
 * ý nghĩa tên, tầm nhìn – sứ mệnh – giá trị, nhân sự, ảnh hoạt động, đánh giá khách, khách tiêu biểu.
 * Không ghi địa chỉ ĐKKD (41 An Phú Đông 1). Không ghi giá. Không nêu tên đại lý/NCC.
 * Có thêm mục nào thì phải có dữ liệu thật đi kèm.
 */

const TOC = [
  ["tong-quan", "Minh Thiện Logistics là ai"],
  ["phap-ly", "Thông tin pháp lý"],
  ["dich-vu", "Lĩnh vực & dịch vụ"],
  ["tuyen", "Tuyến vận chuyển"],
  ["khach-hang", "Khách hàng phục vụ"],
  ["nang-luc", "Năng lực vận chuyển"],
  ["van-phong", "Văn phòng & khu vực nhận hàng"],
  ["quy-trinh", "Quy trình gửi hàng"],
  ["dong-goi", "Kiểm tra & đóng gói"],
  ["tra-cuu", "Theo dõi vận đơn"],
  ["thoi-gian", "Thời gian giao thực tế"],
  ["cuoc", "Cách tính cước"],
  ["hang-hoa", "Hàng được & không được gửi"],
  ["den-bu", "Bảo hiểm, đền bù & khiếu nại"],
  ["khac-biet", "Điểm khác biệt"],
  ["chinh-sach", "Chính sách & quy định"],
  ["hoi-dap", "Câu hỏi thường gặp"],
  ["lien-he", "Liên hệ"],
] as const;

const faqs = [
  {
    q: `${site.name} là công ty gì?`,
    a: `${site.name} là thương hiệu gửi hàng quốc tế của ${site.legalName} (MST ${site.taxId}), văn phòng tại ${site.addressFull}. Công ty có hơn ${site.experienceYears} năm kinh nghiệm, nhận gửi hàng từ Việt Nam đi hơn 200 quốc gia, trong đó các tuyến chính là Mỹ, Úc, Canada, Châu Âu, Nhật Bản, Hàn Quốc, Singapore, Malaysia, Thái Lan, Đài Loan; đồng thời nhận nhập hàng và mua hộ từ Trung Quốc, Thái Lan, Âu – Mỹ.`,
  },
  {
    q: `${site.name} có phải công ty có pháp nhân không?`,
    a: `Có. Pháp nhân đứng sau thương hiệu ${site.name} là ${site.legalName}, mã số thuế ${site.taxId}. Thông tin doanh nghiệp tra cứu công khai được trên các trang tra cứu mã số thuế.`,
  },
  {
    q: `${site.name} ở đâu?`,
    a: site.branches.map((b) => `${b.name}: ${b.address}`).join(". ") + ".",
  },
  {
    q: `Số điện thoại và email của ${site.name}?`,
    a: `Hotline / Zalo: ${site.phoneDisplay} (${site.contactName}). Email: ${site.email}. Làm việc ${site.hours}.`,
  },
  {
    q: `${site.name} có lấy hàng tận nhà không?`,
    a: "Có. Minh Thiện nhận hàng tận nơi miễn phí trong nội thành TP. Hồ Chí Minh, Hà Nội, Đà Nẵng, Huế, Nha Trang và Cần Thơ. Khách ở nơi khác có thể gửi hàng về văn phòng Minh Thiện.",
  },
  {
    q: `Gửi hàng ở ${site.name} có mất phí đóng gói không?`,
    a: "Không. Minh Thiện đóng gói miễn phí cho mọi đơn gửi đi nước ngoài, gồm thùng, chèn chống sốc và hút chân không thực phẩm khi cần.",
  },
  {
    q: "Hàng bị thất lạc hoặc hư hỏng thì được đền thế nào?",
    a: "Nếu khách không mua bảo hiểm, Minh Thiện hoàn cước phần hàng bị ảnh hưởng và đền tiền hàng 121.000đ/kg, phần tiền hàng tối đa 5.000.000đ. Nếu khách mua bảo hiểm (phí 20% giá trị hàng), Minh Thiện đền 100% giá trị hàng đã khai. Thịt, trứng, sữa không áp dụng khiếu nại – đền bù.",
  },
  {
    q: "Làm sao theo dõi đơn hàng?",
    a: "Vào trang Tra cứu đơn hàng trên minhthienlogs.com, nhập mã đơn Minh Thiện (dạng MT-xxxxxxx) và 2 số cuối số điện thoại người nhận để xem hành trình.",
  },
];

const steps = [
  "Liên hệ hotline/Zalo hoặc để lại thông tin trên website; nhân viên tư vấn dịch vụ hợp với loại hàng và nước nhận.",
  "Báo giá trước khi gửi.",
  "Nhận hàng tận nơi hoặc tại văn phòng, kiểm tra hàng có thuộc danh mục cấm/hạn chế không.",
  "Đóng gói miễn phí, cân và chốt cước chính thức.",
  "Khách xác nhận cước và thanh toán.",
  "Làm thủ tục, gửi hàng; khách nhận mã đơn MT-xxxxxxx để theo dõi.",
  "Hàng thông quan tại nước nhận và giao tới người nhận.",
];

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-28 text-2xl font-black text-ink">
    {children}
  </h2>
);

export default async function AboutPage() {
  const [cats, soGiao] = await Promise.all([getCategories(), laySoGiao()]);
  const counts = new Map(cats.map((c) => [c.name, c.count]));
  const tongBai = cats.reduce((s, c) => s + c.count, 0);
  const dongDu = (soGiao?.dong ?? []).filter((d) => d.duDuLieu);
  const kyDo =
    soGiao?.kyTu && soGiao?.kyDen
      ? `${soGiao.kyTu.split("-").reverse().join("/")} – ${soGiao.kyDen.split("-").reverse().join("/")}`
      : "";
  const sv = (slug: string) => services.find((s) => s.slug === slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${url}#webpage`,
          url,
          name: `Giới thiệu ${site.name}`,
          inLanguage: "vi-VN",
          isPartOf: { "@id": `${site.url}/#website` },
          about: { "@id": `${site.url}/#organization` },
          mainEntity: { "@id": `${site.url}/#organization` },
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
        subtitle={`Hơn ${site.experienceYears} năm gửi hàng quốc tế từ Việt Nam đi hơn 200 quốc gia — lấy hàng tận nơi, đóng gói miễn phí, theo dõi hành trình, chính sách đền bù công khai.`}
        crumbs={[{ name: "Giới thiệu", href: "/gioi-thieu" }]}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-14">
          {/* Thông tin nhanh — khối đầu trang để người đọc và AI lấy đúng dữ kiện */}
          <section className="rounded-3xl border border-brand-100 bg-brand-50/50 p-6">
            <h2 className="text-lg font-black text-ink">Thông tin nhanh</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-[15px] sm:grid-cols-2">
              {[
                ["Thương hiệu", site.name],
                ["Pháp nhân", site.legalName],
                ["Mã số thuế", site.taxId],
                ["Kinh nghiệm", `Hơn ${site.experienceYears} năm`],
                ["Văn phòng", site.addressFull],
                ["Chi nhánh", site.branches[1].address],
                ["Hotline / Zalo", `${site.phoneDisplay} (${site.contactName})`],
                ["Email", site.email],
                ["Giờ làm việc", site.hours],
                ["Phạm vi", "Hơn 200 quốc gia; tuyến chính Mỹ, Úc, Canada, Châu Âu, Nhật, Hàn"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-ink-muted">{k}</dt>
                  <dd className="font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <H2 id="tong-quan">{site.name} là ai?</H2>
            <p className="mt-4 text-lg text-ink-soft">{faqs[0].a}</p>
            <p className="mt-3 text-ink-soft">
              Minh Thiện làm trọn khâu cho khách: tư vấn hàng nào gửi được, lấy hàng tận nơi, đóng gói, làm thủ tục,
              gửi đi và theo dõi tới khi người nhận cầm được hàng.
            </p>
          </section>

          <section>
            <H2 id="phap-ly">Thông tin pháp lý</H2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft">
              <li>
                Tên doanh nghiệp: <strong className="text-ink">{site.legalName}</strong> (tên giao dịch / thương hiệu:{" "}
                {site.name}).
              </li>
              <li>
                Mã số thuế: <strong className="text-ink">{site.taxId}</strong> — tra cứu công khai tại{" "}
                <a href={site.taxRegistry} target="_blank" rel="noopener" className="text-brand-600 underline">
                  masothue.com
                </a>
                .
              </li>
              <li>Văn phòng giao dịch: {site.addressFull}.</li>
              <li>Chi nhánh: {site.branches[1].address}.</li>
            </ul>
          </section>

          <section>
            <H2 id="dich-vu">Lĩnh vực hoạt động & dịch vụ</H2>
            <p className="mt-4 text-ink-soft">
              Minh Thiện hoạt động trong lĩnh vực chuyển phát và vận chuyển hàng hoá quốc tế, gồm hai mảng: gửi hàng từ
              Việt Nam ra nước ngoài, và nhập hàng – mua hộ từ nước ngoài về Việt Nam.
            </p>
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
            <H2 id="tuyen">Tuyến vận chuyển đang khai thác</H2>
            <p className="mt-4 text-ink-soft">
              Minh Thiện nhận gửi hàng đi hơn 200 quốc gia và vùng lãnh thổ. Các tuyến khách gửi nhiều nhất, mỗi tuyến
              có trang kiến thức riêng:
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {DESTINATIONS.map((d) => (
                <li key={d.category}>
                  <Link
                    href={categoryHref(d.category)}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-white px-4 py-2 font-semibold text-brand-700 hover:border-brand-300"
                  >
                    {d.label}
                    {counts.get(d.category) ? (
                      <span className="text-sm font-normal text-ink-muted"> · {counts.get(d.category)} bài</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H2 id="khach-hang">Khách hàng Minh Thiện phục vụ</H2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft">
              <li>Gia đình gửi quà, đồ ăn, thuốc cho người thân ở nước ngoài.</li>
              <li>Du học sinh, người lao động ở Nhật, Hàn, Úc, Canada… cần nhận đồ dùng từ Việt Nam.</li>
              <li>Việt kiều đặt hàng Việt Nam gửi sang.</li>
              <li>Cá nhân và doanh nghiệp bán hàng, xuất hàng mẫu, hàng kinh doanh đi nước ngoài.</li>
              <li>Người cần nhập hàng, mua hộ từ Taobao, 1688, Amazon về Việt Nam.</li>
            </ul>
          </section>

          <section>
            <H2 id="nang-luc">Năng lực vận chuyển</H2>
            <p className="mt-4 text-ink-soft">
              Mỗi tuyến chính có hai nhóm dịch vụ để khách chọn theo thời gian và ngân sách:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-ink-soft">
              <li>
                <strong className="text-ink">Đi nhanh</strong> — gửi qua các hãng chuyển phát quốc tế, thời gian giao ngắn
                nhất.
              </li>
              <li>
                <strong className="text-ink">Đi tiết kiệm</strong> — Minh Thiện tự đặt chỗ hàng không, làm thủ tục thông
                quan và tổ chức giao tại nước nhận, chi phí thấp hơn, thời gian dài hơn.
              </li>
            </ul>
            <p className="mt-3 text-ink-soft">
              Các hãng chuyển phát Minh Thiện làm việc cùng gồm {partners.filter((p) => ["FedEx", "DHL", "UPS", "USPS"].includes(p)).join(", ")}.
            </p>
          </section>

          <section>
            <H2 id="van-phong">Văn phòng & khu vực nhận hàng miễn phí</H2>
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
            <p className="mt-4 text-ink-soft">
              Nhận hàng tận nơi <strong className="text-ink">miễn phí</strong> trong nội thành TP. Hồ Chí Minh, Hà Nội, Đà
              Nẵng, Huế, Nha Trang và Cần Thơ. Ở nơi khác, khách gửi hàng về văn phòng Minh Thiện.
            </p>
          </section>

          <section>
            <H2 id="quy-trinh">Quy trình tiếp nhận và gửi hàng</H2>
            <ol className="mt-5 space-y-3">
              {steps.map((st, i) => (
                <li key={st} className="flex gap-3 rounded-2xl bg-brand-50 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <span className="text-ink-soft">{st}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <H2 id="dong-goi">Kiểm tra và đóng gói</H2>
            <p className="mt-4 text-ink-soft">
              Nhân viên kiểm tra hàng trước khi đóng gói để bảo đảm không có hàng cấm, đúng danh sách khách khai và chọn
              cách đóng phù hợp. <strong className="text-ink">Đóng gói miễn phí</strong>: thực phẩm khô hút chân không, hàng
              dễ vỡ bọc nhiều lớp chống sốc, chất lỏng khoá nắp và bọc túi kín. Chi tiết tại{" "}
              <Link href="/quy-dinh-dong-goi" className="text-brand-600 underline">
                Quy định đóng gói
              </Link>
              .
            </p>
          </section>

          <section>
            <H2 id="tra-cuu">Hệ thống theo dõi vận đơn</H2>
            <p className="mt-4 text-ink-soft">
              Mỗi đơn có mã riêng dạng <strong className="text-ink">MT-xxxxxxx</strong>. Khách xem hành trình tại{" "}
              <Link href="/tra-cuu" className="text-brand-600 underline">
                Tra cứu đơn hàng
              </Link>{" "}
              bằng mã đơn và 2 số cuối số điện thoại người nhận — người khác có mã đơn cũng không xem được hành trình
              của bạn.
            </p>
          </section>

          <section>
            <H2 id="thoi-gian">Thời gian giao hàng thực tế</H2>
            {dongDu.length > 0 ? (
              <>
                <p className="mt-4 text-ink-soft">
                  Số dưới đây đo từ hệ thống theo dõi hành trình của Minh Thiện ({soGiao?.tongKien} kiện đã giao
                  {kyDo ? `, kỳ ${kyDo}` : ""}), tính theo ngày làm việc, không phải số ước lượng:
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-[15px]">
                    <thead>
                      <tr className="border-b border-brand-100 text-ink-muted">
                        <th className="py-2 pr-4 font-semibold">Tuyến</th>
                        <th className="py-2 pr-4 font-semibold">Dịch vụ</th>
                        <th className="py-2 pr-4 font-semibold">Số kiện</th>
                        <th className="py-2 font-semibold">Trung vị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dongDu.map((d) => (
                        <tr key={d.tuyen + d.nhom} className="border-b border-brand-50">
                          <td className="py-2 pr-4 font-semibold text-ink">{d.tuyen}</td>
                          <td className="py-2 pr-4 text-ink-soft">{d.tenNhom}</td>
                          <td className="py-2 pr-4 text-ink-soft">{d.soKien}</td>
                          <td className="py-2 text-ink-soft">{d.trungVi} ngày làm việc</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
            <p className="mt-4 text-ink-soft">
              Đây là thời gian dự kiến, có thể chậm hơn vào mùa cao điểm hoặc khi hải quan kiểm tra. Bảng đầy đủ theo
              từng tuyến tại{" "}
              <Link href="/thoi-gian-giao-thuc-te" className="text-brand-600 underline">
                Thời gian giao thực tế
              </Link>
              .
            </p>
          </section>

          <section>
            <H2 id="cuoc">Cách tính cước vận chuyển</H2>
            <p className="mt-4 text-ink-soft">
              Cước tính theo trọng lượng thực hoặc trọng lượng quy đổi theo kích thước thùng, lấy số lớn hơn. Cách quy
              đổi và bảng cước khác nhau theo dịch vụ (đi nhanh / đi tiết kiệm) và theo nước nhận; nhân viên báo rõ
              trước khi khách đồng ý gửi, cước chính thức chốt sau khi đóng gói và cân thực tế.
            </p>
          </section>

          <section>
            <H2 id="hang-hoa">Hàng được và không được gửi</H2>
            <p className="mt-4 text-ink-soft">
              Minh Thiện nhận gửi phần lớn hàng cá nhân và hàng kinh doanh: thực phẩm khô, đặc sản, quần áo, mỹ phẩm,
              thuốc, quà tặng, đồ dùng… Mỗi nước có quy định nhập khẩu riêng, nên có mặt hàng không gửi được hoặc chỉ
              gửi theo điều kiện — ví dụ pin sạc dự phòng không nhận gửi, trái cây tươi không gửi đi Mỹ. Danh sách theo
              từng nước tại{" "}
              <Link href="/hang-gui-duoc" className="text-brand-600 underline">
                Hàng gì gửi đi được
              </Link>
              .
            </p>
          </section>

          <section>
            <H2 id="den-bu">Bảo hiểm, đền bù và khiếu nại</H2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft">
              <li>Mỗi lô hàng được khai giá trị mặc định 5.000.000đ để thuận lợi thông quan.</li>
              <li>
                Hàng thất lạc, hư hỏng hoặc gặp vấn đề thông quan (khách không mua bảo hiểm): hoàn cước phần hàng bị ảnh
                hưởng và đền tiền hàng <strong className="text-ink">121.000đ/kg</strong>, phần tiền hàng tối đa
                5.000.000đ.
              </li>
              <li>
                Mua bảo hiểm (phí 20% giá trị hàng): đền <strong className="text-ink">100% giá trị hàng</strong> đã
                khai.
              </li>
              <li>Thịt, trứng, sữa và sản phẩm từ thịt, trứng, sữa không áp dụng khiếu nại – đền bù.</li>
              <li>Khiếu nại và hoàn tất đền bù trong 30 ngày kể từ ngày hàng được xác nhận thất lạc, mất mát.</li>
            </ul>
            <p className="mt-3 text-ink-soft">
              Chi tiết tại{" "}
              <Link href="/chinh-sach-den-bu-bao-hiem" className="text-brand-600 underline">
                Chính sách đền bù và bảo hiểm
              </Link>{" "}
              và{" "}
              <Link href="/chinh-sach-khieu-nai" className="text-brand-600 underline">
                Chính sách khiếu nại
              </Link>
              .
            </p>
          </section>

          <section>
            <H2 id="khac-biet">Điểm khác biệt của Minh Thiện</H2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft">
              <li>
                <strong className="text-ink">Công bố thời gian giao đo thật</strong> từ hệ thống theo dõi, không chỉ ghi
                “giao nhanh 3–5 ngày”.
              </li>
              <li>
                <strong className="text-ink">Chính sách đền bù ghi rõ con số</strong> — khách biết trước được đền bao
                nhiêu.
              </li>
              <li>
                <strong className="text-ink">Đóng gói miễn phí</strong> và <strong className="text-ink">lấy hàng miễn phí</strong>{" "}
                nội thành 6 thành phố.
              </li>
              <li>
                <strong className="text-ink">Có pháp nhân, mã số thuế công khai</strong> ({site.taxId}).
              </li>
              <li>
                <strong className="text-ink">{tongBai} bài kiến thức</strong> về thủ tục, hàng cấm, cách gửi từng nước,
                chia theo tuyến tại{" "}
                <Link href={KT_PATH} className="text-brand-600 underline">
                  mục Kiến thức
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <H2 id="chinh-sach">Chính sách & quy định</H2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {POLICY_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="flex items-center justify-between rounded-xl border border-brand-50 bg-white px-4 py-3 font-semibold text-ink hover:border-brand-200"
                  >
                    {p.title} <ArrowRight className="h-4 w-4 text-brand-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H2 id="hoi-dap">Câu hỏi thường gặp về {site.name}</H2>
            <div className="mt-5 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
                  <p className="mt-2 text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-brand-700 p-7 text-white">
            <H2 id="lien-he">
              <span className="text-white">Liên hệ Minh Thiện Logistics</span>
            </H2>
            <ul className="mt-4 space-y-2 text-white/85">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Hotline / Zalo: {site.phoneDisplay} ({site.contactName})
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {site.email}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {site.addressFull}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> {site.hours}
              </li>
            </ul>
            <p className="mt-5 text-lg font-semibold">Cần báo giá gửi hàng? Tư vấn miễn phí, báo giá trong ít phút.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CallAction
                phone={site.phone}
                className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3 font-semibold text-white hover:bg-coral-600"
                conversionLabel="VzBiCL7SkdUcEKnr1_49"
              >
                <Phone className="h-4 w-4" /> Gọi {site.phoneDisplay}
              </CallAction>
              <ZaloLink
                href={site.zalo}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
                conversionLabel="G8fXCJ6D_NQcEKnr1_49"
              >
                <MessageCircle className="h-4 w-4" /> Chat Zalo
              </ZaloLink>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                Gửi yêu cầu báo giá <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>

        {/* Mục lục */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
            <div className="mb-3 font-bold text-ink">Nội dung</div>
            <ol className="space-y-1.5 text-sm">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-ink-soft hover:text-brand-600">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>
    </>
  );
}
