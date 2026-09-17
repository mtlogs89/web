/**
 * Thời gian vận chuyển đường bay đi Mỹ / Canada / Úc — MỘT nguồn duy nhất cho cả web
 * (trang chủ, trang dịch vụ, ô trong bài, công cụ tính, llms.txt, schema).
 * Chủ chốt ngày 16/09/2026. Đổi ở đây là đổi hết; bài viết trong DB phải sửa riêng.
 */
export const TRANSIT = {
  fast: [3, 5] as const,
  economy: [8, 12] as const,
  remoteExtra: [2, 3] as const,
};

export const TRANSIT_ROUTES: Record<string, string> = {
  "Gửi hàng đi Mỹ": "Mỹ",
  "Gửi hàng đi Canada": "Canada",
  "Gửi hàng đi Úc": "Úc",
};

/**
 * Thời gian theo từng chuyên mục (tuyến) — chủ điền trong bảng xác nhận 16–17/09/2026.
 * Nhật, Hàn, Malaysia, Thái Lan: KHÔNG có dịch vụ đi tiết kiệm. Đài Loan chưa có số.
 */
export const ROUTE_TRANSIT: Record<string, { name: string; text: string }> = {
  "Gửi hàng đi Mỹ": { name: "Mỹ", text: "đi nhanh 3–5 ngày làm việc · đi tiết kiệm 8–12 ngày làm việc. Vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày" },
  "Gửi hàng đi Canada": { name: "Canada", text: "đi nhanh 3–5 ngày làm việc · đi tiết kiệm 8–12 ngày làm việc. Vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày" },
  "Gửi hàng đi Úc": { name: "Úc", text: "đi nhanh 3–5 ngày làm việc · đi tiết kiệm 8–12 ngày làm việc. Vùng sâu vùng xa (tuỳ postcode) cộng thêm 2–3 ngày" },
  "Gửi hàng đi Châu Âu": { name: "Châu Âu", text: "đi nhanh 5–7 ngày làm việc · đi tiết kiệm 8–15 ngày làm việc, tuỳ quốc gia" },
  "Gửi hàng đi Đức": { name: "Đức", text: "đi nhanh 5–7 ngày làm việc · đi tiết kiệm 8–15 ngày làm việc" },
  "Gửi hàng đi Nhật Bản": { name: "Nhật Bản", text: "chỉ có dịch vụ đi nhanh, 5–7 ngày làm việc" },
  "Gửi hàng đi Hàn Quốc": { name: "Hàn Quốc", text: "chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc" },
  "Gửi hàng đi Singapore": { name: "Singapore", text: "đi nhanh 1 ngày làm việc · đi tiết kiệm 4 ngày làm việc" },
  "Gửi hàng đi Malaysia": { name: "Malaysia", text: "chỉ có dịch vụ đi nhanh, 3–5 ngày làm việc" },
  "Gửi hàng đi Thái Lan": { name: "Thái Lan", text: "chỉ có dịch vụ đi nhanh, 5–7 ngày làm việc" },
};

/** Trang dịch vụ → chuyên mục, để schema giá lấy đúng thời gian của tuyến. */
export const SERVICE_ROUTE: Record<string, string> = {
  "gui-hang-di-my": "Gửi hàng đi Mỹ",
  "gui-hang-di-canada": "Gửi hàng đi Canada",
  "gui-hang-di-uc": "Gửi hàng đi Úc",
  "gui-hang-di-chau-au": "Gửi hàng đi Châu Âu",
  "gui-hang-di-nhat": "Gửi hàng đi Nhật Bản",
  "gui-hang-di-han": "Gửi hàng đi Hàn Quốc",
};

/** Lưu ý mặt hàng theo tuyến — chủ xác nhận 17/09/2026. */
export const ROUTE_GOODS_NOTE: Record<string, string> = {
  "Gửi hàng đi Úc":
    "Thịt khô, giò chả, sữa, trứng: Minh Thiện vẫn nhận gửi (phụ thu theo kg), nhưng Úc kiểm dịch nhóm này rất chặt nên có rủi ro hàng bị giữ hoặc tiêu huỷ ở đầu Úc. Hạt giống, cây cảnh, đồ dính đất: không nhận.",
};

const r = (x: readonly [number, number]) => `${x[0]}–${x[1]}`;

export const TRANSIT_SHORT = `đi nhanh ${r(TRANSIT.fast)} ngày, đi tiết kiệm ${r(TRANSIT.economy)} ngày làm việc`;

export function transitAnswer(country: string): string {
  return `Gửi hàng đi ${country} bằng đường bay có 2 lựa chọn: đi nhanh ${r(TRANSIT.fast)} ngày làm việc, đi tiết kiệm ${r(TRANSIT.economy)} ngày làm việc. Địa chỉ nhận ở vùng sâu vùng xa (tuỳ postcode) cộng thêm ${r(TRANSIT.remoteExtra)} ngày làm việc. Có mã tracking theo dõi tới khi người nhận ký nhận.`;
}
