import { prisma } from "./prisma";
import { services } from "./site";

/** Phần admin có thể chỉnh cho mỗi thẻ dịch vụ HỆ THỐNG (lưu SiteSetting dạng JSON). */
export type ServiceOverride = {
  title?: string;
  short?: string;
  order?: number;
  hidden?: boolean;
};

/** Thẻ nước do admin TỰ THÊM (có trang chi tiết tự sinh). */
export type CustomCard = {
  slug: string;
  country: string; // "Đài Loan"
  short: string; // mô tả trên thẻ
  emoji: string; // 🇹🇼 (thay cờ)
  intro: string; // mô tả đầu trang chi tiết
  articleSlug: string; // bài nhúng vào trang chi tiết (tùy chọn)
  destKey: string; // nước cho công cụ tính cước
  order: number;
  hidden: boolean;
};

/** Kiểu thẻ dùng để render (trang chủ, /gui-hang). */
export type ServiceCardView = {
  slug: string;
  title: string;
  short: string;
  group: "gui-hang" | "nhap-hang";
  flag?: string;
  icon?: string;
  emoji?: string;
  custom?: boolean;
};

const OVERRIDE_KEY = "service_cards";
const CUSTOM_KEY = "custom_service_cards";

async function readOverrides(): Promise<Record<string, ServiceOverride>> {
  const row = await prisma.siteSetting.findUnique({ where: { key: OVERRIDE_KEY } });
  if (!row?.value) return {};
  try {
    return JSON.parse(row.value) as Record<string, ServiceOverride>;
  } catch {
    return {};
  }
}

export async function getCustomCards(): Promise<CustomCard[]> {
  const row = await prisma.siteSetting.findUnique({ where: { key: CUSTOM_KEY } });
  if (!row?.value) return [];
  try {
    const arr = JSON.parse(row.value) as CustomCard[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function getCustomCard(slug: string): Promise<CustomCard | null> {
  const cards = await getCustomCards();
  return cards.find((c) => c.slug === slug) ?? null;
}

/**
 * Thẻ dịch vụ hiển thị công khai (trang chủ, /gui-hang) — gộp thẻ hệ thống
 * (đã áp cấu hình admin) + thẻ nước tự thêm; đã ẩn/hiện và sắp thứ tự.
 */
export async function getServiceCards(): Promise<ServiceCardView[]> {
  const [ov, custom] = await Promise.all([readOverrides(), getCustomCards()]);

  const systemCards = services.map((s, i) => {
    const o = ov[s.slug] ?? {};
    const view: ServiceCardView = {
      slug: s.slug,
      title: o.title?.trim() || s.title,
      short: o.short?.trim() || s.short,
      group: s.group,
      flag: s.flag,
      icon: s.icon,
    };
    return { view, order: typeof o.order === "number" ? o.order : i, hidden: !!o.hidden };
  });

  const customCards = custom.map((c) => {
    const view: ServiceCardView = {
      slug: c.slug,
      title: `Gửi hàng đi ${c.country}`,
      short: c.short,
      group: "gui-hang",
      emoji: c.emoji,
      custom: true,
    };
    return { view, order: c.order, hidden: c.hidden };
  });

  return [...systemCards, ...customCards]
    .filter((x) => !x.hidden)
    .sort((a, b) => a.order - b.order)
    .map((x) => x.view);
}

// ---- Cho trang admin ----

export type SystemCardAdmin = {
  slug: string;
  flag?: string;
  defaultTitle: string;
  defaultShort: string;
  title: string;
  short: string;
  order: number;
  hidden: boolean;
};

export async function getSystemCardsForAdmin(): Promise<SystemCardAdmin[]> {
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
