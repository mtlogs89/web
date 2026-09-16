/**
 * Bản đồ chủ đề (tuyến) → trang trụ cột. Dùng chung cho:
 *  - khối "Bài viết liên quan" + link về trang dịch vụ cuối mỗi bài (internal link)
 *  - breadcrumb JSON-LD
 *  - chuyển hướng 301 link cũ của web CMS cũ (proxy.ts)
 *
 * File này KHÔNG import Prisma để proxy.ts dùng được.
 */

import { EU_COUNTRIES } from "./eu-countries";

export type Topic = {
  category: string;
  label: string;
  /** Trang dịch vụ nếu có, không thì trang lọc chuyên mục ở /tin-tuc. */
  hub: string;
  /** Từ khoá đã bỏ dấu, so trên đoạn chữ ĐÃ CẮT "gửi hàng". */
  keywords: RegExp;
};

// Tên 27 nước EU (tiếng Việt đã bỏ dấu + tiếng Anh trong slug) lấy từ lưới Châu Âu.
const EU_NAMES = EU_COUNTRIES.map((c) => toSlugWords(c.nameVi)).join("|");
const EU_EN = EU_COUNTRIES.map((c) => c.slug.replace(/^gui-hang-di-/, "")).join("|");

const catHub = (category: string) => `/tin-tuc?cat=${encodeURIComponent(category)}`;

// Thứ tự quan trọng: nước cụ thể trước, khối chung (Châu Âu) sau.
export const TOPICS: Topic[] = [
  { category: "Gửi hàng đi Singapore", label: "Singapore", hub: catHub("Gửi hàng đi Singapore"), keywords: /singapore/ },
  { category: "Gửi hàng đi Malaysia", label: "Malaysia", hub: catHub("Gửi hàng đi Malaysia"), keywords: /malaysia|kuala-lumpur|penang|johor/ },
  { category: "Gửi hàng đi Thái Lan", label: "Thái Lan", hub: catHub("Gửi hàng đi Thái Lan"), keywords: /thai-lan|bangkok|chiang-mai|pattaya/ },
  { category: "Gửi hàng đi Canada", label: "Canada", hub: "/dich-vu/gui-hang-di-canada", keywords: /canada|toronto|vancouver|montreal|calgary|ottawa|edmonton/ },
  { category: "Gửi hàng đi Úc", label: "Úc", hub: "/dich-vu/gui-hang-di-uc", keywords: /(^|-)(di|o|sang)-uc($|-)|australia|sydney|melbourne|brisbane|perth|adelaide/ },
  { category: "Gửi hàng đi Nhật Bản", label: "Nhật Bản", hub: "/dich-vu/gui-hang-di-nhat", keywords: /nhat-ban|(^|-)(di|o|sang)-nhat($|-)|japan|tokyo|osaka|nagoya/ },
  { category: "Gửi hàng đi Hàn Quốc", label: "Hàn Quốc", hub: "/dich-vu/gui-hang-di-han", keywords: /han-quoc|(^|-)(di|o|sang)-han($|-)|korea|seoul|incheon|busan|daegu/ },
  { category: "Gửi hàng đi Mỹ", label: "Mỹ", hub: "/dich-vu/gui-hang-di-my", keywords: /(^|-)(di|o|sang|tu|quan)-my($|-)|hoa-ky|usa|amazon|ensure/ },
  { category: "Gửi hàng đi Châu Âu", label: "Châu Âu", hub: "/dich-vu/gui-hang-di-chau-au", keywords: new RegExp(`chau-au|(^|-)(di|o|sang)-(duc|phap|anh|y|${EU_NAMES})($|-)|${EU_EN}`) },
  // Chuyên mục riêng có sẵn trong DB, không dùng để đoán (Đức đã nằm trong Châu Âu).
  { category: "Gửi hàng đi Đức", label: "Đức", hub: "/dich-vu/gui-hang-di-chau-au", keywords: /(?!)/ },
  { category: "Nhập hàng Trung Quốc", label: "Nhập hàng Trung Quốc", hub: "/nhap-hang", keywords: /trung-quoc|taobao|1688|wechat|quang-chau|nhap-hang/ },
];

const BY_CATEGORY = new Map(TOPICS.map((t) => [t.category, t]));

export function topicOfCategory(category: string): Topic | undefined {
  return BY_CATEGORY.get(category);
}

/** Đổi chữ tiếng Việt / slug về dạng "gui-hang-di-my" để so từ khoá. */
export function toSlugWords(text: string): string {
  return text
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/%[0-9a-f]{2}/gi, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Đoán tuyến từ tiêu đề hoặc slug. Không dò "hàn" trên cả câu vì "gửi HÀNg"
 * chứa sẵn chữ "hàn", và "mỹ phẩm" không phải nước Mỹ — đây chính là lỗi đã
 * làm hàng chục bài Singapore/Thái/Malaysia rơi vào chuyên mục Hàn Quốc.
 */
export function detectTopic(text: string): Topic | undefined {
  const s = toSlugWords(text).replace(/(^|-)my-pham($|-)/g, "$1mypham$2");
  return TOPICS.find((t) => t.keywords.test(s));
}
