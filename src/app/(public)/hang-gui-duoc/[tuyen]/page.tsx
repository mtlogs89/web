import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, AlertTriangle, X, HelpCircle, Clock, Calculator, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import { site } from "@/lib/site";
import { ROUTE_TRANSIT } from "@/lib/transit";
import { TOPICS } from "@/lib/topics";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { TUYEN_HANG, TUYEN_CHUYEN_MUC, NHAN, type MatHang, type TrangThai, cauTraLoi, demTheoTrangThai, layTuyen, tenTuyen } from "@/lib/hang-tuyen";

/**
 * "Gửi <mặt hàng> đi <nước> được không?" — câu khách hỏi AI nhiều nhất (45/130 câu trong
 * bảng khảo sát tuyến Mỹ). Trang này trả lời thẳng cả 41 mặt hàng bằng bảng đã được chủ
 * xác nhận, kèm FAQ schema để máy đọc được từng câu một.
 */

export const dynamic = "force-static";

export function generateStaticParams() {
  return TUYEN_HANG.map((t) => ({ tuyen: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tuyen: string }> }): Promise<Metadata> {
  const t = layTuyen((await params).tuyen);
  if (!t) return {};
  const ten = tenTuyen(t.ten);
  const d = demTheoTrangThai(t);
  const url = `${site.url}/hang-gui-duoc/${t.slug}`;
  return {
    title: `Gửi hàng đi ${ten} được những gì? Danh sách ${t.hang.length} mặt hàng`,
    description: `Danh sách mặt hàng gửi đi ${ten} được và không được, do ${site.name} xác nhận: ${d.nhan} mặt hàng nhận gửi, ${d["dieu-kien"]} mặt hàng có điều kiện, ${d.khong} mặt hàng không nhận. Kèm mức phụ thu từng loại.`,
    alternates: { canonical: url },
  };
}

const KIEU: Record<TrangThai, { vien: string; nen: string; chu: string; Icon: typeof Check }> = {
  nhan: { vien: "border-brand-100", nen: "bg-brand-50", chu: "text-brand-700", Icon: Check },
  "dieu-kien": { vien: "border-sun-100", nen: "bg-sun-50", chu: "text-sun-600", Icon: AlertTriangle },
  khong: { vien: "border-coral-100", nen: "bg-coral-50", chu: "text-coral-600", Icon: X },
  "chua-ro": { vien: "border-brand-50", nen: "bg-white", chu: "text-ink-muted", Icon: HelpCircle },
};

function The({ h, tuyen }: { h: MatHang; tuyen: string }) {
  const k = KIEU[h.trangThai];
  return (
    <tr className="border-b border-brand-50 last:border-0">
      <td className="px-3 py-3 align-top">
        <div className="font-semibold text-ink">{h.ten}</div>
        {h.viDu && <div className="mt-0.5 text-sm text-ink-muted">{h.viDu}</div>}
      </td>
      <td className="px-3 py-3 align-top">
        <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full ${k.nen} px-2.5 py-1 text-sm font-semibold ${k.chu}`}>
          <k.Icon className="h-3.5 w-3.5" /> {NHAN[h.trangThai].nhan}
        </span>
      </td>
      <td className="px-3 py-3 align-top text-sm text-ink-soft">
        {h.ghiChu || (h.trangThai === "nhan" ? "Không phụ thu riêng." : "")}
        <span className="sr-only">{cauTraLoi(h, tuyen)}</span>
      </td>
    </tr>
  );
}

export default async function TrangHangTuyen({ params }: { params: Promise<{ tuyen: string }> }) {
  const t = layTuyen((await params).tuyen);
  if (!t) notFound();

  const ten = tenTuyen(t.ten);
  const url = `${site.url}/hang-gui-duoc/${t.slug}`;
  const d = demTheoTrangThai(t);
  const chuyenMuc = TUYEN_CHUYEN_MUC[t.ten];
  const thoiGian = ROUTE_TRANSIT[chuyenMuc]?.text;
  const hub = TOPICS.find((x) => x.category === chuyenMuc)?.hub;
  const khongNhan = t.hang.filter((h) => h.trangThai === "khong");

  // Gom theo nhóm hàng, giữ đúng thứ tự trong file của chủ.
  const nhoms: { ten: string; hang: MatHang[] }[] = [];
  for (const h of t.hang) {
    const cuoi = nhoms.at(-1);
    if (cuoi?.ten === h.nhom) cuoi.hang.push(h);
    else nhoms.push({ ten: h.nhom, hang: [h] });
  }

  const faqs = [
    {
      q: `Gửi hàng đi ${ten} được những gì?`,
      a: `${site.name} nhận gửi ${d.nhan} trên ${t.hang.length} nhóm mặt hàng đi ${ten} bình thường, ${d["dieu-kien"]} nhóm nhận có điều kiện hoặc có phụ thu, và không nhận ${d.khong} nhóm${khongNhan.length ? `: ${khongNhan.map((h) => h.ten.toLowerCase()).join("; ")}` : ""}.`,
    },
    ...t.hang.map((h) => ({ q: `Gửi ${h.ten.toLowerCase()} đi ${ten} được không?`, a: cauTraLoi(h, t.ten) })),
  ];

  const oTom = [
    { nhan: "Nhận gửi", so: d.nhan, kieu: KIEU.nhan },
    { nhan: "Có điều kiện", so: d["dieu-kien"], kieu: KIEU["dieu-kien"] },
    { nhan: "Không nhận", so: d.khong, kieu: KIEU.khong },
    { nhan: "Gọi hỏi", so: d["chua-ro"], kieu: KIEU["chua-ro"] },
  ].filter((o) => o.so > 0);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Hàng gửi được", url: `${site.url}/hang-gui-duoc` },
          { name: ten, url },
        ])}
      />

      <PageHero
        title={`Gửi hàng đi ${ten} được những gì?`}
        subtitle={`Danh sách ${t.hang.length} nhóm mặt hàng, ghi rõ loại nào ${site.shortName} nhận gửi, loại nào có điều kiện hoặc phụ thu, loại nào không nhận.`}
        crumbs={[{ name: "Hàng gửi được", href: "/hang-gui-duoc" }, { name: ten, href: `/hang-gui-duoc/${t.slug}` }]}
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {oTom.map((o) => (
            <div key={o.nhan} className={`rounded-2xl border ${o.kieu.vien} ${o.kieu.nen} p-4`}>
              <div className={`text-3xl font-black ${o.kieu.chu}`}>{o.so}</div>
              <div className="mt-1 text-sm font-semibold text-ink-soft">{o.nhan}</div>
            </div>
          ))}
        </div>

        {thoiGian && (
          <p className="mt-6 flex items-start gap-2 rounded-2xl border border-sun-100 bg-sun-50 p-4 text-ink-soft">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sun-600" />
            <span>
              <b className="text-ink">Thời gian đi {ten}:</b> {thoiGian}.
            </span>
          </p>
        )}

        {khongNhan.length > 0 && (
          <div className="mt-4 rounded-2xl border border-coral-100 bg-coral-50 p-4">
            <p className="font-semibold text-coral-600">Không nhận gửi đi {ten}</p>
            <p className="mt-1 text-ink-soft">{khongNhan.map((h) => h.ten).join(" · ")}</p>
          </div>
        )}

        <p className="mt-6 text-ink-soft">
          Bảng dưới là hàng {site.shortName} thực tế nhận gửi đi {ten}, do chính công ty xác nhận chứ không phải chép luật.
          Mặt hàng ghi “có điều kiện” là vẫn gửi được nhưng có phụ thu hoặc có rủi ro bị hải quan giữ — nhân viên sẽ báo
          trước khi nhận hàng. Chưa thấy món của bạn trong bảng thì gọi{" "}
          <CallAction phone={site.phone} className="font-semibold text-brand-600">
            {site.phoneDisplay}
          </CallAction>{" "}
          để được trả lời ngay.
        </p>

        {nhoms.map((n) => (
          <div key={n.ten} className="mt-8">
            <h2 className="text-xl font-black text-ink">{n.ten}</h2>
            <div className="mt-3 overflow-x-auto rounded-3xl border border-brand-50 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-brand-50 bg-brand-50/40">
                    <th className="px-3 py-2 text-sm font-semibold text-ink-muted">Mặt hàng</th>
                    <th className="px-3 py-2 text-sm font-semibold text-ink-muted">Đi {ten}</th>
                    <th className="px-3 py-2 text-sm font-semibold text-ink-muted">Điều kiện, phụ thu</th>
                  </tr>
                </thead>
                <tbody>
                  {n.hang.map((h) => (
                    <The key={h.ten} h={h} tuyen={t.ten} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="mt-10 rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink">Gửi hàng đi {ten} hết bao nhiêu?</h2>
          <p className="mt-2 text-ink-soft">
            Cước tính theo cân nặng và kích thước kiện. Bấm tính thử để có giá ước tính, hoặc gọi hotline để được báo giá
            đúng món hàng của bạn kèm phụ thu (nếu có).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/#tinh-cuoc" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-600">
              <Calculator className="h-4 w-4" /> Tính cước thử
            </Link>
            <CallAction phone={site.phone} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 font-semibold text-brand-600 hover:bg-brand-50">
              <Phone className="h-4 w-4" /> Gọi {site.phoneDisplay}
            </CallAction>
            {hub && (
              <Link href={hub} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 font-semibold text-brand-600 hover:bg-brand-50">
                Dịch vụ gửi hàng đi {ten}
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TUYEN_HANG.filter((x) => x.slug !== t.slug).map((x) => (
            <Link key={x.slug} href={`/hang-gui-duoc/${x.slug}`} className="rounded-full border border-brand-100 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-600">
              Đi {tenTuyen(x.ten)}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
