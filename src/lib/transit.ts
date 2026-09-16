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

const r = (x: readonly [number, number]) => `${x[0]}–${x[1]}`;

export const TRANSIT_SHORT = `đi nhanh ${r(TRANSIT.fast)} ngày, đi tiết kiệm ${r(TRANSIT.economy)} ngày làm việc`;

export function transitAnswer(country: string): string {
  return `Gửi hàng đi ${country} bằng đường bay có 2 lựa chọn: đi nhanh ${r(TRANSIT.fast)} ngày làm việc, đi tiết kiệm ${r(TRANSIT.economy)} ngày làm việc. Địa chỉ nhận ở vùng sâu vùng xa (tuỳ postcode) cộng thêm ${r(TRANSIT.remoteExtra)} ngày làm việc. Có mã tracking theo dõi tới khi người nhận ký nhận.`;
}
