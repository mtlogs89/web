import { toSlugWords } from "./topics";

/**
 * Mục "Kiến thức" (trước đây là "Tin tức"): trang cha /kien-thuc, mỗi tuyến/chủ đề là một
 * trang con /kien-thuc/<slug>. Tên chuyên mục trong DB giữ nguyên ("Gửi hàng đi Mỹ"…) để
 * API đăng bài, robot và TOPICS không phải đổi — chỉ ĐỔI CÁCH HIỂN THỊ và URL trang mục.
 * URL từng bài vẫn là /tin-tuc/<slug> (không đổi, khỏi mất thứ hạng hàng trăm bài đã index).
 * File này KHÔNG import Prisma để dùng được ở mọi nơi.
 */
export const KT_PATH = "/kien-thuc";

export const categorySlug = (name: string) => toSlugWords(name);

export function categoryHref(name: string, page = 1): string {
  return `${KT_PATH}/${categorySlug(name)}${page > 1 ? `?page=${page}` : ""}`;
}

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Tên hiển thị: "Gửi hàng đi Mỹ" → "Kiến thức gửi hàng đi Mỹ". */
export function categoryLabel(name: string): string {
  if (name === "Kiến thức") return "Kiến thức chung";
  if (/^kiến thức/i.test(name)) return name;
  if (/^(gửi hàng|nhập hàng)/i.test(name)) return `Kiến thức ${lowerFirst(name)}`;
  return name;
}

export function findCategoryBySlug(slug: string, names: string[]): string | undefined {
  return names.find((n) => categorySlug(n) === slug);
}
