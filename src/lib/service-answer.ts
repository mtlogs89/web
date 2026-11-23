import type { Destination } from "./pricing";
import { VOLUMETRIC_DIVISOR } from "./pricing";
import { ROUTE_TRANSIT } from "./transit";
import { LICH_BAY } from "./lich-bay";
import { layTuyen } from "./hang-tuyen";
import { site } from "./site";

/**
 * Khối "trả lời nhanh + bảng giá" ở đầu trang dịch vụ, cho các tuyến ĐỒNG GIÁ theo kg.
 *
 * Vì sao có (audit AEO tuyến Hàn 22/11/2026): hỏi ChatGPT "gửi thùng 10kg đi Hàn công ty nào,
 * giá bao nhiêu" thì nó lập bảng so giá 10kg từ các bên CÓ CÔNG BỐ bảng giá (1,3–1,6 triệu),
 * còn Minh Thiện không có trong bảng vì trang Hàn ghi "giá chỉ từ 70K/kg" (giá cũ) và các ô giá
 * ghi "liên hệ". Giá thật chủ chốt 22/11/2026 là 95.000đ/kg → 10kg = 950.000đ.
 *
 * Mọi con số lấy từ nguồn chung — không gõ tay ở đây:
 *   giá, phụ thu kiện nhỏ  → lib/pricing.ts (qua getDestinations, admin up bảng giá cũng theo)
 *   thời gian              → lib/transit.ts (ROUTE_TRANSIT)
 *   lịch bay, giờ chốt     → lib/lich-bay.ts
 *   hàng nhận / không nhận → src/data/hang-tuyen.json (chủ xác nhận)
 * Chủ đổi giá ở pricing.ts là đoạn tóm tắt, bảng giá, schema và câu hỏi–đáp đổi theo.
 */
export type ServiceAnswerConfig = {
  /** key trong lib/pricing.ts */
  destKey: string;
  /** slug tuyến trong hang-tuyen.json */
  tuyenHang: string;
  /** key trong LICH_BAY */
  lichBay: string;
  /** "Hàn Quốc" */
  country: string;
  /** Nơi giao hay gặp nhất, viết cho người đọc. */
  noiGiao: string;
  /** Vài nhóm hàng nhận gửi tiêu biểu (đều là "nhan" trong hang-tuyen.json). */
  hangTieuBieu: string;
  /** Gọi gọn nhóm thực phẩm "có điều kiện, rủi ro bị giữ" (đúng hang-tuyen.json) cho đoạn tóm tắt. */
  hangRuiRo?: string;
  /** Một số liệu đơn thật đã công bố trên web (kèm nguồn) — AI ưu tiên dữ liệu riêng. */
  soLieu?: { cau: string; href: string };
  /** Câu về thuế — tuyến nào chưa bao thuế phải nói rõ. */
  thue: string;
  /** Câu thuế gọn (viết thường đầu câu) cho dòng giá ở ô vàng đầu bài viết. */
  thueNgan?: string;
  /** Các mốc cân in trong bảng giá (từ mốc không còn phụ thu kiện nhỏ trở lên). */
  mocCan: number[];
  /** Ngày chủ chốt giá (YYYY-MM-DD) — đổi giá ở pricing.ts thì đổi ngày này. */
  giaCapNhat: string;
  /**
   * Bài hướng dẫn gửi theo nơi (Cần Thơ, Hà Nội…) — link ở khối "Gửi hàng đi … tại TP.HCM và các
   * tỉnh". Chỉ đưa bài đã soát không ghi sai cách lấy hàng/văn phòng.
   */
  baiTheoNoi?: { noi: string; slug: string }[];
};

export const SERVICE_ANSWER: Record<string, ServiceAnswerConfig> = {
  "gui-hang-di-han": {
    destKey: "han",
    tuyenHang: "han",
    lichBay: "Hàn",
    country: "Hàn Quốc",
    noiGiao: "Seoul, Gyeonggi, Incheon, Busan và các tỉnh",
    hangTieuBieu: "đồ khô, cá khô, mực khô, nước mắm, cà phê, bánh kẹo, thuốc tây, mỹ phẩm, quần áo",
    hangRuiRo: "đồ làm từ thịt (khô bò, lạp xưởng, chà bông, giò chả), sữa, trứng, rau củ tươi",
    // Bài "số liệu thực tế" đã đăng 09/10/2026 (đếm 125 đơn thật 06–10/2026).
    soLieu: {
      cau: "Theo số liệu 125 đơn thật Minh Thiện đã gửi đi Hàn (06–10/2026), thùng trung bình nặng 13,6kg, phần lớn là đồ ăn quê.",
      href: "/tin-tuc/gui-hang-di-han-quoc-so-lieu-thuc-te",
    },
    thue: "Cước chưa gồm thuế nhập khẩu tại Hàn Quốc nếu phát sinh (tuỳ giá trị, loại và số lượng hàng); điện thoại, laptop và hàng giá trị cao thường bị hải quan Hàn yêu cầu đóng thuế, nên hỏi trước từng đơn.",
    thueNgan: "chưa gồm thuế nhập khẩu tại Hàn Quốc nếu phát sinh",
    mocCan: [3, 5, 10, 15, 20, 30],
    giaCapNhat: "2026-11-22",
    // Soát 23/11/2026: không ghi văn phòng ở tỉnh, không ghi giá. Bình Dương, An Giang, Hải Phòng,
    // Quy Nhơn còn câu "lấy tận nơi chỉ áp dụng ở…" (trái quy tắc chủ) — sửa xong mới thêm vào.
    baiTheoNoi: [
      { noi: "Cần Thơ và miền Tây", slug: "gui-hang-di-han-quoc-tai-can-tho" },
      { noi: "Hà Nội", slug: "gui-hang-di-han-quoc-tai-ha-noi-quy-trinh-luu-y-va-bang-gia-2026" },
      { noi: "Đà Nẵng", slug: "gui-hang-di-han-quoc-tai-da-nang-quy-trinh-thuc-te-luu-y-hai-quan-bang-gia-2026" },
      { noi: "Huế", slug: "gui-hang-di-han-quoc-tai-hue-cach-gui-thu-tuc-va-luu-y-thuc-te-2026" },
    ],
  },
};

/** 95000 → "95.000đ" */
export const dong = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";

export type ServiceAnswer = {
  cauHoi: string;
  tomTat: string;
  tieuDeBang: string;
  bang: { kg: number; cuoc: number }[];
  ghiChu: string[];
  faqs: { q: string; a: string }[];
  perKg: number;
  /** Một câu giá + thời gian cho schema Offer. */
  note: string;
  /**
   * Dòng giá cho ô vàng đầu các bài viết của tuyến (chủ cho hiện giá ở ô này 23/11/2026; thân bài
   * vẫn theo quy tắc "không ghi số tiền trong bài"). Viết thường đầu câu để nối sau nhãn "Giá cước…:".
   */
  giaNgan: string;
  /** Ngày chủ chốt giá, YYYY-MM-DD. */
  giaCapNhat: string;
  /** <title> (mẫu tiêu đề tự nối "| Minh Thiện Logistics") và mô tả ≤160 ký tự cho Google/AI. */
  seoTitle: string;
  metaDescription: string;
  soLieuHref?: string;
};

const thuong = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const hoa = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Dựng toàn bộ chữ của khối trả lời nhanh từ dữ liệu chung. Trả null khi tuyến không phải
 * đồng giá theo kg (bảng mốc cân như Mỹ/Úc dùng công cụ tính, không dùng khối này).
 */
export function buildServiceAnswer(
  cfg: ServiceAnswerConfig,
  dest: Destination | undefined,
  routeCategory: string,
): ServiceAnswer | null {
  if (!dest || dest.table.type !== "ranges" || dest.table.ranges.length !== 1) return null;
  const perKg = dest.table.ranges[0].perKg;
  if (perKg == null || perKg <= 0) return null;
  const small = dest.table.smallSurcharge;
  const cuoc = (kg: number) => kg * perKg + (small && kg < small.underKg ? small.fee : 0);
  const thoiGian = ROUTE_TRANSIT[routeCategory]?.text ?? "";
  const lich = LICH_BAY[cfg.lichBay];
  const hang = layTuyen(cfg.tuyenHang)?.hang ?? [];
  const khong = hang.filter((h) => h.trangThai === "khong").map((h) => thuong(h.ten));
  const ruiRo = hang
    .filter((h) => h.trangThai === "dieu-kien" && h.nhom === "THỰC PHẨM" && /giữ/.test(h.ghiChu ?? ""))
    .map((h) => thuong(h.ten));
  const phuThu = hang
    .filter((h) => /phụ thu/i.test(h.ghiChu ?? ""))
    .map((h) => {
      const muc = (h.ghiChu ?? "").replace(/^.*?Phụ thu\s*/i, "+").replace(/\.\s*$/, "");
      return `${h.ten} ${muc}${/tháo pin/i.test(h.ghiChu ?? "") ? " (tháo pin trước khi gửi)" : ""}`;
    });
  const smallText = small ? `; kiện dưới ${small.underKg}kg cộng thêm ${dong(small.fee)}/kiện` : "";

  const tomTat =
    `${site.name} (TP.HCM) nhận gửi hàng từ Việt Nam đi ${cfg.country} bằng đường bay, ${thoiGian}. ` +
    `Hàng giao tận nhà ở ${cfg.noiGiao}. ` +
    `Cước đồng giá ${dong(perKg)}/kg${smallText}. Ví dụ thùng 10kg là ${dong(cuoc(10))}, thùng 20kg là ${dong(cuoc(20))}. ` +
    (cfg.soLieu ? `${cfg.soLieu.cau} ` : "") +
    `Nhận gửi ${cfg.hangTieuBieu}. ` +
    (khong.length ? `Không nhận ${khong.join(", ")}. ` : "") +
    (ruiRo.length ? `${hoa(cfg.hangRuiRo ?? ruiRo.join(", "))} vẫn nhận nhưng có rủi ro bị hải quan ${cfg.country} giữ. ` : "") +
    `Lấy hàng tận nơi miễn phí trong nội thành TP.HCM, Hà Nội, Đà Nẵng, Huế, Nha Trang, Cần Thơ. ` +
    `Hotline/Zalo ${site.phoneDisplay}.`;

  const ghiChu = [
    small ? `Kiện dưới ${small.underKg}kg: số kg × ${dong(perKg)}, cộng thêm ${dong(small.fee)}/kiện.` : "",
    lich ? `Lịch bay: ${lich.bay}; chốt hàng ${lich.chot}.` : "",
    `Cân tính cước là số lớn hơn giữa cân thực tế và cân quy đổi (Dài × Rộng × Cao)/${VOLUMETRIC_DIVISOR}, đơn vị cm; cân chốt là cân tại kho TP.HCM.`,
    phuThu.length ? `Phụ thu theo mặt hàng: ${phuThu.join("; ")}.` : "",
    cfg.thue,
    "Đóng gói, thùng carton, chống sốc và hút chân không thực phẩm: miễn phí.",
  ].filter(Boolean);

  const faqs = [
    {
      q: `Gửi hàng đi ${cfg.country} giá bao nhiêu 1kg?`,
      a: `Tại ${site.name}, cước gửi hàng đi ${cfg.country} đồng giá ${dong(perKg)}/kg cho mọi mốc cân${smallText}. Cân tính cước là số lớn hơn giữa cân thực tế và cân quy đổi (Dài × Rộng × Cao)/${VOLUMETRIC_DIVISOR}. ${cfg.thue}`,
    },
    {
      q: `Gửi thùng 10kg đồ ăn đi ${cfg.country} hết bao nhiêu tiền?`,
      a: `Thùng 10kg là ${dong(cuoc(10))} tiền cước (10 × ${dong(perKg)}), thùng 20kg là ${dong(cuoc(20))}. Đóng gói, thùng và hút chân không miễn phí; thời gian: ${thoiGian}.`,
    },
    {
      // AEO 23/11/2026: câu "gửi hàng đi … ở đâu / tại TP.HCM" — AI cần địa chỉ, giờ mở cửa, cách giao.
      q: `Ở TP.HCM gửi hàng đi ${cfg.country} mang tới đâu?`,
      a:
        `Mang tới kho ${site.name} tại ${site.addressFull}, mở cửa ${site.hours.replace(": ", " ")}, ` +
        `hoặc gọi/Zalo ${site.phoneDisplay} để Minh Thiện tới tận nơi lấy hàng. Kho cân, kiểm hàng và đóng gói miễn phí tại chỗ` +
        `${lich ? `; hàng đi ${cfg.country} bay ${lich.bay}, chốt hàng ${lich.chot}` : ""}. ` +
        `Ở ${site.pickupCities.filter((c) => c !== "TP. Hồ Chí Minh").join(", ")} cũng hẹn lấy tận nơi được; ` +
        `nơi khác gọi hotline để Minh Thiện đặt chuyển phát nội địa tới nhà lấy hàng về kho TP.HCM.`,
    },
  ];

  const khoangNgay = thoiGian.match(/\d+\s*–\s*\d+/)?.[0] ?? "";
  return {
    seoTitle: `Gửi hàng đi ${cfg.country} ${dong(perKg)}/kg${khoangNgay ? `, ${khoangNgay} ngày` : ""}`,
    metaDescription:
      `Gửi hàng đi ${cfg.country} đồng giá ${dong(perKg)}/kg (thùng 10kg ${dong(cuoc(10))})` +
      `${khoangNgay ? `, bay ${khoangNgay} ngày làm việc` : ""}, giao tận nhà. Lấy hàng tận nơi, đóng gói miễn phí. Hotline ${site.phoneDisplay}.`,
    soLieuHref: cfg.soLieu?.href,
    cauHoi: `Gửi hàng đi ${cfg.country} giá bao nhiêu, mấy ngày tới?`,
    tomTat,
    tieuDeBang: `Bảng giá gửi hàng đi ${cfg.country} (đồng giá theo kg)`,
    bang: cfg.mocCan.map((kg) => ({ kg, cuoc: cuoc(kg) })),
    ghiChu,
    faqs,
    perKg,
    note: `Đồng giá ${dong(perKg)}/kg${smallText}. Thời gian: ${thoiGian}.`,
    giaNgan: [
      `đồng giá ${dong(perKg)}/kg, thùng 10kg là ${dong(cuoc(10))}` +
        `${small ? ` (kiện dưới ${small.underKg}kg cộng thêm ${dong(small.fee)}/kiện)` : ""}.`,
      cfg.thueNgan ? `${hoa(cfg.thueNgan)}.` : "",
      phuThu.length ? "Một số mặt hàng có phụ thu riêng." : "",
    ]
      .filter(Boolean)
      .join(" "),
    giaCapNhat: cfg.giaCapNhat,
  };
}
