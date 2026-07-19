import { prisma } from "./prisma";
import { services, type Service } from "./site";

/** Phần admin có thể chỉnh cho mỗi thẻ dịch vụ (lưu trong SiteSetting dạng JSON). */
export type ServiceOverride = {
  title?: string;
  short?: string;
  order?: number;
  hidden?: boolean;
};

const KEY = "service_cards";

async function readOverrides(): Promise<Record<string, ServiceOverride>> {
  const row = await prisma.siteSetting.findUnique({ where: { key: KEY } });
  if (!row?.value) return {};
  try {
    return JSON.parse(row.value) as Record<string, ServiceOverride>;
  } catch {
    return {};
  }
}

/**
 * Danh sách thẻ dịch vụ hiển thị công khai (trang chủ, /gui-hang) —
 * đã áp cấu hình admin: đổi tên/mô tả, ẩn/hiện, sắp thứ tự.
 * Slug/cờ/icon vẫn lấy từ code (gắn với route, không cho sửa).
 */
export async function getServiceCards(): Promise<Service[]> {
  const ov = await readOverrides();
  return services
    .map((s, i) => {
      const o = ov[s.slug] ?? {};
      const card: Service = {
        ...s,
        title: o.title?.trim() || s.title,
        short: o.short?.trim() || s.short,
      };
      return { card, order: typeof o.order === "number" ? o.order : i, hidden: !!o.hidden };
    })
    .filter((x) => !x.hidden)
    .sort((a, b) => a.order - b.order)
    .map((x) => x.card);
}

export type ServiceCardAdmin = {
  slug: string;
  flag?: string;
  defaultTitle: string;
  defaultShort: string;
  title: string;
  short: string;
  order: number;
  hidden: boolean;
};

/** Toàn bộ thẻ (kể cả đang ẩn) kèm giá trị mặc định — cho trang admin chỉnh. */
export async function getServiceCardsForAdmin(): Promise<ServiceCardAdmin[]> {
  const ov = await readOverrides();
  return services
    .map((s, i) => {
      const o = ov[s.slug] ?? {};
      return {
        slug: s.slug,
        flag: s.flag,
        defaultTitle: s.title,
        defaultShort: s.short,
        title: o.title ?? s.title,
        short: o.short ?? s.short,
        order: typeof o.order === "number" ? o.order : i,
        hidden: !!o.hidden,
      };
    })
    .sort((a, b) => a.order - b.order);
}
