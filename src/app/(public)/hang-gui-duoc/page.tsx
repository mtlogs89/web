import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, AlertTriangle, X } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CallAction } from "@/components/site/call-action";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { TUYEN_HANG, demTheoTrangThai, tenTuyen } from "@/lib/hang-tuyen";

export const dynamic = "force-static";

const url = `${site.url}/hang-gui-duoc`;

export const metadata: Metadata = {
  title: "Hàng gì gửi đi nước ngoài được? Bảng 41 mặt hàng × 10 tuyến",
  description: `Tra nhanh mặt hàng nào gửi đi Mỹ, Canada, Úc, Châu Âu, Nhật, Hàn, Singapore, Malaysia, Thái Lan, Đài Loan được — loại nào có điều kiện, loại nào không nhận. Bảng do ${site.name} xác nhận, kèm mức phụ thu.`,
  alternates: { canonical: url },
};

export default function TrangHangGuiDuoc() {
  const faqs = [
    {
      q: "Hàng gì gửi đi nước ngoài được?",
      a: `${site.name} có bảng xác nhận 41 nhóm mặt hàng cho 10 tuyến (Mỹ, Canada, Úc, Châu Âu, Nhật Bản, Hàn Quốc, Singapore, Malaysia, Thái Lan, Đài Loan), ghi rõ loại nào nhận gửi bình thường, loại nào nhận có điều kiện hoặc có phụ thu, loại nào không nhận. Xem theo từng tuyến tại ${url}.`,
    },
    {
      q: "Mặt hàng nào hầu như tuyến nào cũng không nhận?",
      a: "Pin rời và sạc dự phòng, rượu bia, thuốc lá là những nhóm bị từ chối ở phần lớn tuyến. Rau củ, trái cây tươi cũng không đi được đường bay quốc tế ở nhiều tuyến.",
    },
    {
      q: `Không thấy mặt hàng của tôi trong bảng thì sao?`,
      a: `Gọi hotline ${site.phoneDisplay} (${site.contactName}) để nhân viên xem hàng thật rồi trả lời, vì cùng một tên hàng nhưng đóng gói và giấy tờ khác nhau thì kết quả khác nhau.`,
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", url: site.url },
          { name: "Hàng gửi được", url },
        ])}
      />

      <PageHero
        title="Hàng gì gửi đi nước ngoài được?"
        subtitle={`Bảng 41 nhóm mặt hàng cho 10 tuyến, ghi rõ loại nào ${site.shortName} nhận gửi, loại nào có điều kiện hoặc phụ thu, loại nào không nhận. Chọn tuyến để xem.`}
        crumbs={[{ name: "Hàng gửi được", href: "/hang-gui-duoc" }]}
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {TUYEN_HANG.map((t) => {
            const d = demTheoTrangThai(t);
            return (
              <Link
                key={t.slug}
                href={`/hang-gui-duoc/${t.slug}`}
                className="group rounded-3xl border border-brand-50 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-ink">Gửi hàng đi {tenTuyen(t.ten)}</h2>
                  <ArrowRight className="h-4 w-4 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1 text-brand-700">
                    <Check className="h-3.5 w-3.5" /> {d.nhan} nhận
                  </span>
                  {d["dieu-kien"] > 0 && (
                    <span className="inline-flex items-center gap-1 text-sun-600">
                      <AlertTriangle className="h-3.5 w-3.5" /> {d["dieu-kien"]} có điều kiện
                    </span>
                  )}
                  {d.khong > 0 && (
                    <span className="inline-flex items-center gap-1 text-coral-600">
                      <X className="h-3.5 w-3.5" /> {d.khong} không nhận
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink">Không thấy món hàng của bạn?</h2>
          <p className="mt-2 text-ink-soft">
            Cùng một tên hàng nhưng đóng gói và giấy tờ khác nhau thì kết quả khác nhau. Gọi{" "}
            <CallAction phone={site.phone} className="font-semibold text-brand-600">
              {site.phoneDisplay}
            </CallAction>{" "}
            ({site.contactName}) để nhân viên xem hàng thật rồi trả lời, làm việc {site.hours}.
          </p>
        </div>
      </section>
    </>
  );
}
