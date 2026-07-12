import { prisma } from "./prisma";

/** Cấu hình giao diện trang chủ — key/value lưu trong DB, có giá trị mặc định. */
export const HOME_DEFAULTS = {
  home_hero_image: "/images/cargo-port.jpg",
  home_hero_badge: "Vận chuyển tới hơn 200 quốc gia",
  home_hero_title: "Gửi hàng đi quốc tế nhanh, an toàn, giá tốt",
  home_hero_subtitle:
    "Minh Thiện Logistics chuyển phát hàng đi Mỹ, Úc, Canada, Châu Âu, Nhật, Hàn… và nhập hàng Trung Quốc – Thái Lan tận nơi. Tư vấn miễn phí, báo giá trong 5 phút.",
  home_whyus_image: "/images/boxes.jpg",
  home_cta_image: "/images/delivery.jpg",
  /** CSV các slug bài viết nổi bật trên trang chủ. Rỗng = tự lấy 3 bài mới nhất. */
  home_featured_slugs: "",
} as const;

export type HomeSettingKey = keyof typeof HOME_DEFAULTS;

/** Đọc toàn bộ cấu hình trang chủ (đã trộn với mặc định). */
export async function getHomeSettings(): Promise<Record<HomeSettingKey, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const out = { ...HOME_DEFAULTS } as Record<HomeSettingKey, string>;
  for (const k of Object.keys(HOME_DEFAULTS) as HomeSettingKey[]) {
    const v = map.get(k);
    if (v != null && v !== "") out[k] = v;
  }
  return out;
}
