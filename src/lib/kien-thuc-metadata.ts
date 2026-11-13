import type { Metadata } from "next";
import { site } from "@/lib/site";
import { KT_PATH, categoryHref, categoryLabel } from "@/lib/kien-thuc";

/** Mỗi trang con là trụ cột riêng: tiêu đề + canonical riêng, trang 2+ tự trỏ về chính nó. */
export function kienThucMetadata(cat: string | undefined, pageParam?: string): Metadata {
  const p = Math.max(1, Number(pageParam) || 1);
  const suffix = p > 1 ? ` – trang ${p}` : "";
  const base = cat ? categoryHref(cat) : KT_PATH;
  const canonical = `${site.url}${base}${p > 1 ? `?page=${p}` : ""}`;
  if (!cat) {
    return {
      title: `Kiến thức gửi hàng quốc tế: kinh nghiệm từng nước${suffix}`,
      description:
        "Kiến thức, kinh nghiệm và hướng dẫn gửi hàng đi Mỹ, Úc, Canada, Châu Âu, Nhật, Hàn, Singapore, Malaysia, Thái Lan và nhập hàng Trung Quốc từ Minh Thiện Logistics.",
      alternates: { canonical },
    };
  }
  return {
    title: `${categoryLabel(cat)}: thủ tục hải quan, hàng cấm, thời gian${suffix}`,
    description: `Tổng hợp bài hướng dẫn ${cat.toLowerCase()}: thời gian, cách đóng gói, hàng được và không được gửi, thủ tục hải quan — Minh Thiện Logistics, hotline ${site.phoneDisplay}.`,
    alternates: { canonical },
  };
}
