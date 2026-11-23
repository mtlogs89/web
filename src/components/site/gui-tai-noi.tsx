import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Khối "Gửi hàng đi <nước> tại TP.HCM và các tỉnh" ở trang dịch vụ (AEO 23/11/2026).
 *
 * Vì sao có: hỏi ChatGPT / Google AI "gửi hàng đi Hàn ở đâu uy tín", "… tại Cần Thơ" thì AI trả
 * lời bằng danh sách nơi gửi kèm địa chỉ, giờ mở cửa, cách giao hàng. Trang dịch vụ trước đây
 * không nói khách mang hàng tới đâu, mấy giờ, ở tỉnh thì gửi thế nào.
 *
 * Dữ kiện chỉ lấy từ site.ts (địa chỉ, giờ, bản đồ, chi nhánh, 6 nơi lấy tận nơi) và quy tắc chủ
 * chốt 22/11/2026: nơi khác gọi hotline để Minh Thiện đặt chuyển phát nội địa tới nhà lấy hàng.
 * Không viết "không lấy tận nơi" / "lấy tận nơi chỉ ở …", không bịa văn phòng ở tỉnh.
 */
export function GuiTaiNoi({
  country,
  lich,
  baiTheoNoi,
}: {
  country: string;
  lich?: { bay: string; chot: string };
  baiTheoNoi?: { noi: string; slug: string }[];
}) {
  const gio = site.hours.replace(": ", " ");
  const noiKhac = site.pickupCities.filter((c) => c !== "TP. Hồ Chí Minh").join(", ");
  const chiNhanh = site.branches.slice(1);
  return (
    <section className="mx-auto max-w-4xl px-4 pt-6 sm:px-6" aria-labelledby="gui-tai-noi">
      <div className="rounded-3xl border border-brand-100 bg-white px-5 py-6 shadow-sm sm:px-8">
        <h2 id="gui-tai-noi" className="text-xl font-black text-ink sm:text-2xl">
          Gửi hàng đi {country} tại TP.HCM và các tỉnh
        </h2>
        <p className="mt-3 leading-7 text-ink">
          <strong>
            Ở TP.HCM, nơi nhận hàng gửi đi {country} của {site.name} là kho {site.addressFull}, mở cửa {gio};
            gọi {site.phoneDisplay} thì Minh Thiện tới tận nơi lấy hàng.
          </strong>{" "}
          {lich ? `Hàng đi ${country} bay ${lich.bay}, chốt hàng ${lich.chot}.` : ""}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-ink-soft marker:text-brand-500">
          <li>
            <strong className="text-ink">Mang tới kho:</strong> {site.addressFull} —{" "}
            <a
              href={site.googleMaps}
              target="_blank"
              rel="noopener"
              className="font-semibold text-brand-700 underline"
            >
              chỉ đường trên Google Maps
            </a>
            . Kho cân, kiểm hàng và đóng gói miễn phí tại chỗ.
          </li>
          <li>
            <strong className="text-ink">Hẹn lấy tận nơi:</strong> ở TP.HCM, {noiKhac} — nhắn Zalo hoặc gọi{" "}
            <a href={`tel:${site.phone}`} className="font-semibold text-brand-700 underline">
              {site.phoneDisplay}
            </a>{" "}
            để hẹn giờ.
          </li>
          <li>
            <strong className="text-ink">Tỉnh khác:</strong> gọi hotline {site.phoneDisplay} để Minh Thiện đặt chuyển
            phát nội địa tới nhà lấy hàng, hoặc tự gửi xe khách, chành xe về kho TP.HCM. Hàng tới kho được cân,
            chụp ảnh gửi bạn xác nhận rồi mới đóng gói và bay.
          </li>
          <li>
            <strong className="text-ink">Văn phòng:</strong> trụ sở TP.HCM
            {chiNhanh.map((b) => (
              <span key={b.name}>
                {" "}
                và {b.name.charAt(0).toLowerCase() + b.name.slice(1)} ({b.address}, {b.phones.join(", ")})
              </span>
            ))}
            .
          </li>
        </ul>
        {baiTheoNoi && baiTheoNoi.length > 0 && (
          <p className="mt-4 text-sm text-ink-muted">
            Hướng dẫn theo nơi gửi:{" "}
            {baiTheoNoi.map((b, i) => (
              <span key={b.slug}>
                {i > 0 && " · "}
                <Link href={`/tin-tuc/${b.slug}`} className="font-semibold text-brand-700 hover:underline">
                  {b.noi}
                </Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
