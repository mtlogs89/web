import Link from "next/link";
import type { ServiceAnswer } from "@/lib/service-answer";
import { dong } from "@/lib/service-answer";
import { site } from "@/lib/site";

/**
 * Khối trả lời nhanh + bảng giá ở đầu trang dịch vụ (tuyến đồng giá theo kg).
 * Đoạn tóm tắt viết để đứng một mình vẫn hiểu (AI hay trích nguyên đoạn): có tên công ty,
 * giá, thời gian, hàng nhận/không nhận, nơi lấy hàng, số điện thoại — không dùng "chúng tôi".
 */
export function ServiceAnswerBox({
  answer,
  updated,
  hangGuiDuocHref,
}: {
  answer: ServiceAnswer;
  updated: Date;
  hangGuiDuocHref: string;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 sm:pt-14" aria-labelledby="tra-loi-nhanh">
      <div className="rounded-3xl border-l-4 border-brand-500 bg-brand-50 px-5 py-6 sm:px-8">
        <h2 id="tra-loi-nhanh" className="text-xl font-black text-ink sm:text-2xl">
          {answer.cauHoi}
        </h2>
        <p className="mt-3 leading-7 text-ink">{answer.tomTat}</p>
        {/* div chứ không p: dòng ngày/biên soạn không dính vào đoạn trả lời khi AI tách đoạn */}
        <div className="mt-4 text-sm text-ink-muted">
          Cập nhật{" "}
          <time dateTime={updated.toISOString()}>{updated.toLocaleDateString("vi-VN")}</time>
          {" · "}Biên soạn:{" "}
          <Link href="/gioi-thieu" rel="author" className="author font-semibold text-brand-700 hover:underline">
            đội ngũ {site.name}
          </Link>
          {answer.soLieuHref && (
            <>
              {" · "}
              <Link href={answer.soLieuHref} className="font-semibold text-brand-700 hover:underline">
                xem số liệu đơn thật
              </Link>
            </>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-black text-ink">{answer.tieuDeBang}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-100 bg-white">
        <table className="w-full text-left">
          <caption className="sr-only">{answer.tieuDeBang}</caption>
          <thead className="bg-brand-50 text-sm text-ink">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Cân nặng</th>
              <th scope="col" className="px-4 py-3 font-bold">Tiền cước</th>
              <th scope="col" className="px-4 py-3 font-bold">Cách tính</th>
            </tr>
          </thead>
          <tbody className="text-ink">
            {answer.bang.map((r) => (
              <tr key={r.kg} className="border-t border-brand-50">
                <td className="px-4 py-3 font-semibold">{r.kg}kg</td>
                <td className="px-4 py-3 font-black text-brand-700">{dong(r.cuoc)}</td>
                <td className="px-4 py-3 text-sm text-ink-soft">
                  {r.kg} × {dong(answer.perKg)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-6 text-ink-soft">
        {answer.ghiChu.map((g) => (
          <li key={g}>{g}</li>
        ))}
        <li>
          Danh sách đầy đủ hàng nhận, có điều kiện và không nhận:{" "}
          <Link href={hangGuiDuocHref} className="font-semibold text-brand-700 hover:underline">
            hàng gửi được
          </Link>
          . Muốn tính đúng kiện của mình thì dùng công cụ tính cước bên dưới.
        </li>
      </ul>
    </section>
  );
}
