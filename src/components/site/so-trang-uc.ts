"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

// 31/10/2026 chủ chốt: trang liên quan tới Úc chỉ hiện số Ms Vy, ẩn số Ms Min.
// 26/11/2026 chủ đổi lại: trang Úc dùng hotline chung Ms Min (0589.77.89.89) như mọi trang
// -> tắt bằng TRANG_UC_DUNG_SO_VY. Muốn bật lại số Ms Vy thì để true, và đổi lại số trong bài Úc
// (scripts/xoa-so-min-bai-uc-20261031.py; bản đổi về Min là scripts/doi-so-bai-uc-ve-ms-min-20261126.py).
// Trang Úc = đường dẫn khớp chủ đề Úc (trang dịch vụ + bài có slug Úc), hoặc bài có ô Điện thoại
// = số Ms Vy (ContactOverride bật qua setHienSoVy).
const TRANG_UC_DUNG_SO_VY = false;
const UC_PATH = /(^|-|\/)(di|o|sang)-uc($|-|\/)|australia|sydney|melbourne|brisbane|perth|adelaide/;

let baiSoVy = false;
const listeners = new Set<() => void>();
export function setHienSoVy(v: boolean) {
  baiSoVy = v;
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useTrangUc() {
  const pathname = usePathname();
  const bai = useSyncExternalStore(subscribe, () => baiSoVy, () => false);
  return TRANG_UC_DUNG_SO_VY && (UC_PATH.test(pathname) || bai);
}

/** Hotline chính của trang đang xem: trang Úc -> Ms Vy (khi TRANG_UC_DUNG_SO_VY bật), còn lại -> Ms Min. */
export function useHotline() {
  return useTrangUc()
    ? { phone: site.phone2, display: site.phone2Display, name: site.contactName2, zalo: `https://zalo.me/${site.phone2}` }
    : { phone: site.phone, display: site.phoneDisplay, name: site.contactName, zalo: site.zalo };
}
