import { prisma } from "./prisma";

/**
 * Cấu hình 6 trang dịch vụ dùng bố cục "nhúng bài đầy đủ + công cụ tính".
 *
 * Bài nhúng và 3 bài liên quan trước đây nằm cứng trong
 * src/app/(public)/dich-vu/[slug]/page.tsx nên mỗi lần đổi phải sửa code rồi
 * deploy. Giờ lưu ở bảng SiteSetting để sửa được trong /admin/trang-dich-vu;
 * giá trị dưới đây là mặc định, dùng khi DB chưa có gì.
 */
export const SERVICE_PAGES = [
  { slug: "gui-hang-di-my", country: "Mỹ", destKey: "my", label: "Gửi hàng đi Mỹ" },
  { slug: "gui-hang-di-uc", country: "Úc", destKey: "uc", label: "Gửi hàng đi Úc" },
  { slug: "gui-hang-di-canada", country: "Canada", destKey: "canada", label: "Gửi hàng đi Canada" },
  { slug: "gui-hang-di-chau-au", country: "Châu Âu", destKey: "khac", label: "Gửi hàng đi Châu Âu" },
  { slug: "gui-hang-di-nhat", country: "Nhật", destKey: "khac", label: "Gửi hàng đi Nhật Bản" },
  { slug: "gui-hang-di-han", country: "Hàn", destKey: "khac", label: "Gửi hàng đi Hàn Quốc" },
] as const;

export type ServicePageSlug = (typeof SERVICE_PAGES)[number]["slug"];

export type ServicePageConfig = {
  /** Slug bài viết nhúng vào thân trang. */
  article: string;
  /** Slug các bài hiện ở mục "Bài viết liên quan" cuối trang. */
  related: string[];
};

/** Cấu hình đang chạy trước khi có trang quản trị — dùng làm mặc định. */
export const SERVICE_PAGE_DEFAULTS: Record<string, ServicePageConfig> = {
  "gui-hang-di-my": {
    article: "gui-hang-di-my-huong-dan-toan-tap",
    related: [
      "gui-hang-di-my-tong-quan",
      "gui-hang-di-my-nhan-tat-ca-hang-kho",
      "gui-hang-cong-kenh-di-my-tinh-cuoc",
    ],
  },
  "gui-hang-di-uc": {
    article: "gui-hang-di-uc-tong-quan",
    related: [
      "gui-hang-di-uc-tong-quan",
      "gui-thuc-pham-kho-di-uc-kiem-dich",
      "gui-hang-cam-di-uc-danh-sach",
    ],
  },
  "gui-hang-di-canada": {
    article: "gui-hang-di-canada-tong-quan",
    related: [
      "gui-hang-di-canada-tong-quan",
      "gui-thuc-pham-kho-di-canada",
      "gui-hang-di-canada-mat-bao-lau",
    ],
  },
  "gui-hang-di-chau-au": {
    article: "gui-hang-di-chau-au-tong-quan",
    related: ["gui-hang-di-chau-au-tong-quan", "gui-hang-di-germany", "gui-hang-di-france"],
  },
  "gui-hang-di-nhat": {
    article: "gui-hang-di-nhat-tong-quan",
    related: [
      "gui-hang-di-nhat-tong-quan",
      "gui-do-an-cho-thuc-tap-sinh-nhat",
      "gui-hang-cam-di-nhat-danh-sach",
    ],
  },
  "gui-hang-di-han": {
    article: "gui-hang-di-han-tong-quan",
    related: [
      "gui-hang-di-han-tong-quan",
      "gui-do-an-cho-lao-dong-han-quoc",
      "gui-qua-cho-co-dau-viet-o-han",
    ],
  },
};

const articleKey = (slug: string) => `svc_${slug}_article`;
const relatedKey = (slug: string) => `svc_${slug}_related`;

/** Các khoá SiteSetting mà trang quản trị được phép ghi. */
export function serviceSettingKeys(): string[] {
  return SERVICE_PAGES.flatMap((p) => [articleKey(p.slug), relatedKey(p.slug)]);
}

/** Đọc cấu hình cả 6 trang, đã trộn với mặc định. */
export async function getServicePageConfigs(): Promise<Record<string, ServicePageConfig>> {
  const rows = await prisma.siteSetting.findMany({ where: { key: { startsWith: "svc_" } } });
  const map = new Map(rows.map((r) => [r.key, r.value]));

  const out: Record<string, ServicePageConfig> = {};
  for (const p of SERVICE_PAGES) {
    const fallback = SERVICE_PAGE_DEFAULTS[p.slug];
    const article = map.get(articleKey(p.slug))?.trim();
    const related = map.get(relatedKey(p.slug));
    out[p.slug] = {
      article: article || fallback.article,
      related:
        related != null
          ? related.split(",").map((s) => s.trim()).filter(Boolean)
          : fallback.related,
    };
  }
  return out;
}

/** Đọc cấu hình một trang. Trả về null nếu slug không phải trang dịch vụ rich. */
export async function getServicePageConfig(slug: string): Promise<ServicePageConfig | null> {
  if (!SERVICE_PAGE_DEFAULTS[slug]) return null;
  const all = await getServicePageConfigs();
  return all[slug] ?? null;
}
