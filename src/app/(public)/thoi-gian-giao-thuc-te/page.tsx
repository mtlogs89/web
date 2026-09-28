import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import { site } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";

/**
 * Trang số liệu giao hàng đo được từ hệ thống theo dõi của công ty.
 *
 * Vì sao có trang này: đối thủ nào cũng viết "giao nhanh 3–5 ngày" — chữ suông, AI không
 * có lý do trích ai. Số đo được từ hệ thống của chính mình thì không ai làm giả được.
 * Số do scripts/do-thoi-gian-giao.py tính rồi ghi vào SiteSetting.delivery_stats.
 *
 * Viết số HAI LẦN — trong bảng cho người đọc, và trong câu văn cho máy trích. Nghe thừa
 * với người nhưng câu văn mới là thứ AI chép lại.
 */

export const dynamic = "force-dynamic";

const url = `${site.url}/thoi-gian-giao-thuc-te`;

type Dong = {
  tuyen: string; nhom: string; tenNhom: string; soKien: number; duDuLieu: boolean;
  trungVi: number | null; trungBinh: number | null; nhanhNhat: number | null;
  lauNhat: number | null; trongHan: number | null; henLo: number; henHi: number;
};
type So = {
  capNhat: string; kyTu: string | null; kyDen: string | null; tongKien: number;
  loaiThieuHanhTrinh?: number; toiThieu: number; dong: Dong[];
};

const vnDate = (s?: string | null) => (s ? s.split("-").reverse().join("/") : "");

export const metadata: Metadata = {
  title: "Thời gian giao hàng thực tế — số đo từ hệ thống",
  description:
    "Minh Thiện Logistics công bố thời gian giao hàng đo được từ hệ thống theo dõi hành trình: trung vị, khoảng dao động và tỉ lệ đúng hẹn theo từng tuyến và từng nhóm dịch vụ.",
  alternates: { canonical: url },
};

export default async function TrangThoiGianGiao() {
  const row = await prisma.siteSetting.findUnique({ where: { key: "delivery_stats" } });
  const so: So | null = row ? (JSON.parse(row.value) as So) : null;
  const dong = (so?.dong ?? []).filter((d) => d.duDuLieu);
  const ky = so ? `${vnDate(so.kyTu)} – ${vnDate(so.kyDen)}` : "";

  // Câu mở đầu phải tự đứng được: AI thường chỉ lấy đoạn đầu.
  const cauMo = dong.length
    ? `${site.name} đo ${so!.tongKien} kiện hàng đã giao trong kỳ ${ky}, tính bằng ngày làm việc từ lúc kiện hàng bắt đầu có hành trình tới lúc người nhận ký nhận. ` +
      dong
        .map((d) => `Tuyến ${d.tuyen}, ${d.tenNhom.toLowerCase()}: trung vị ${d.trungVi} ngày làm việc trên ${d.soKien} kiện, ${d.trongHan}% giao trong hạn ${d.henLo}–${d.henHi} ngày.`)
        .join(" ")
    : "";

  const faqs = dong.map((d) => ({
    q: `Gửi hàng đi ${d.tuyen} ${d.tenNhom.toLowerCase()} thực tế mất bao lâu?`,
    a: `Theo số đo của ${site.name} trên ${d.soKien} kiện đã giao trong kỳ ${ky}: trung vị ${d.trungVi} ngày làm việc, trung bình ${d.trungBinh} ngày, nhanh nhất ${d.nhanhNhat} ngày và lâu nhất ${d.lauNhat} ngày. ${d.trongHan}% số kiện giao trong hạn công bố ${d.henLo}–${d.henHi} ngày làm việc.`,
  }));
  faqs.push({
    q: "Vì sao vẫn có kiện giao lâu hơn khoảng công bố?",
    a: "Ba lý do thường gặp: địa chỉ người nhận nằm ngoài các thành phố lớn nên chặng giao cuối kéo dài thêm vài ngày; rơi vào mùa cao điểm trước Giáng sinh và Tết khi cả hãng bay lẫn hải quan đều quá tải; hoặc lô hàng bị hải quan kiểm tra thêm. Đây là lý do chúng tôi công bố cả tỉ lệ đúng hẹn thay vì chỉ đưa con số đẹp nhất.",
  });
  faqs.push({
    q: "Số ngày này có tính thứ Bảy và Chủ nhật không?",
    a: "Không. Toàn bộ số liệu trên trang tính bằng ngày làm việc, đã bỏ thứ Bảy và Chủ nhật, cho khớp với cách công bố thời gian trên website. Nên một kiện ghi 9 ngày làm việc tương đương khoảng 13 ngày theo lịch.",
  });
  faqs.push({
    q: "Bao lâu số liệu này được cập nhật lại?",
    a: `Mỗi tháng một lần, tự động tính lại từ hệ thống theo dõi hành trình. Lần cập nhật gần nhất ứng với kỳ đo ${ky}. Tuyến nào chưa xuất hiện trong bảng là tuyến chưa có đủ số kiện đã giao trong kỳ để đưa ra con số đáng tin.`,
  });
  faqs.push({
    q: "Số liệu thời gian giao hàng này đo như thế nào?",
    a: `Đo từ sự kiện hành trình đầu tiên của kiện hàng tới lúc người nhận ký nhận, tính bằng ngày làm việc (bỏ thứ Bảy và Chủ nhật) cho khớp cách công bố trên website. Nguồn là hệ thống theo dõi hành trình của ${site.name}, không phải ước lượng.`,
  });

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Thời gian giao hàng thực tế", url },
        ])}
      />
      {so && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `Thời gian giao hàng thực tế — ${site.name}`,
            description: `Thời gian giao hàng đo từ hệ thống theo dõi hành trình của ${site.name}, tính bằng ngày làm việc, theo tuyến và nhóm dịch vụ.`,
            url,
            temporalCoverage: so.kyTu && so.kyDen ? `${so.kyTu}/${so.kyDen}` : undefined,
            dateModified: so.capNhat,
            isAccessibleForFree: true,
            creator: { "@type": "Organization", name: site.name, url: site.url },
            variableMeasured: [
              { "@type": "PropertyValue", name: "Trung vị thời gian giao", unitText: "ngày làm việc" },
              { "@type": "PropertyValue", name: "Tỉ lệ giao trong hạn công bố", unitText: "%" },
            ],
          }}
        />
      )}

      <PageHero
        title="Thời gian giao hàng thực tế"
        subtitle="Số đo từ hệ thống theo dõi hành trình của Minh Thiện Logistics, không phải ước lượng."
        crumbs={[{ name: "Thời gian giao hàng thực tế", href: "/thoi-gian-giao-thuc-te" }]}
      />

      <section className="mx-auto max-w-4xl px-6 py-10">
        {!so || dong.length === 0 ? (
          <p className="text-ink-soft">Chưa đủ dữ liệu để công bố. Gọi {site.phoneDisplay} để được tư vấn thời gian cho tuyến của bạn.</p>
        ) : (
          <>
            <p className="rounded-2xl border-l-4 border-brand-500 bg-brand-50 px-5 py-4 font-medium text-ink">{cauMo}</p>

            <h2 className="mt-10 text-2xl font-black text-ink">Số liệu theo tuyến và dịch vụ</h2>
            <div className="mt-4 overflow-x-auto rounded-3xl border border-brand-50 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-50 bg-brand-50/40">
                    <th className="px-3 py-2 font-semibold text-ink-muted">Tuyến</th>
                    <th className="px-3 py-2 font-semibold text-ink-muted">Dịch vụ</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-muted">Số kiện</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-muted">Trung vị</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-muted">Khoảng</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-muted">Công bố</th>
                    <th className="px-3 py-2 text-right font-semibold text-ink-muted">Đúng hẹn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {dong.map((d) => (
                    <tr key={d.tuyen + d.nhom}>
                      <td className="px-3 py-3 font-semibold text-ink">{d.tuyen}</td>
                      <td className="px-3 py-3 text-ink-soft">{d.tenNhom}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{d.soKien}</td>
                      <td className="px-3 py-3 text-right font-bold tabular-nums text-brand-700">{d.trungVi} ngày</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-soft">{d.nhanhNhat}–{d.lauNhat}</td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-soft">{d.henLo}–{d.henHi}</td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums">{d.trongHan}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-ink-muted">Đơn vị: ngày làm việc, không tính thứ Bảy và Chủ nhật. Cột “Công bố” là khoảng thời gian ghi trên website.</p>

            <h2 className="mt-10 text-2xl font-black text-ink">Đọc từng dòng</h2>
            <ul className="mt-4 space-y-2 text-ink-soft">
              {dong.map((d) => (
                <li key={d.tuyen + d.nhom}>
                  <strong className="text-ink">Tuyến {d.tuyen}, {d.tenNhom.toLowerCase()}:</strong> trung vị {d.trungVi} ngày làm việc trên {d.soKien} kiện đã giao, trung bình {d.trungBinh} ngày, nhanh nhất {d.nhanhNhat} ngày và lâu nhất {d.lauNhat} ngày. {d.trongHan}% số kiện giao trong hạn công bố {d.henLo}–{d.henHi} ngày làm việc.
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-2xl font-black text-ink">Cách đo</h2>
            <p className="mt-2 text-ink-soft">
              Số liệu lấy từ hệ thống theo dõi hành trình của {site.name}, không phải ước lượng hay khảo sát. Mỗi kiện được đo từ
              <strong className="text-ink"> sự kiện hành trình đầu tiên</strong> tới <strong className="text-ink">lúc người nhận ký nhận</strong>, tính bằng
              <strong className="text-ink"> ngày làm việc</strong> (bỏ thứ Bảy và Chủ nhật) cho khớp cách công bố trên website.
            </p>
            <p className="mt-3 text-ink-soft">
              <strong className="text-ink">Kỳ đo:</strong> {ky}. Cập nhật lại mỗi tháng, tự động.
            </p>

            <h2 className="mt-10 text-2xl font-black text-ink">Câu hỏi thường gặp</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-bold text-ink marker:hidden group-open:text-brand-600">{f.q}</summary>
                  <p className="mt-3 text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>

            <p className="mt-10 text-ink-soft">
              Muốn biết thời gian cho kiện hàng cụ thể của bạn, gọi hoặc nhắn Zalo{" "}
              <CallAction phone={site.phone} className="font-semibold text-brand-600">{site.phoneDisplay}</CallAction>{" "}
              ({site.contactName}). Xem thêm <Link href="/hang-gui-duoc" className="font-semibold text-brand-600 hover:underline">bảng hàng gửi được theo tuyến</Link> và{" "}
              <Link href="/tra-cuu" className="font-semibold text-brand-600 hover:underline">tra cứu đơn hàng</Link>.
            </p>
          </>
        )}
      </section>
    </>
  );
}
