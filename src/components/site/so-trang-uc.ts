"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

// Trang liên quan tới Úc chỉ hiện số Ms Vy, ẩn số Ms Min — chủ chốt 31/10/2026.
// Trang còn lại chỉ hiện số Ms Min (hotline chung).
// Trang Úc = đường dẫn khớp chủ đề Úc (trang dịch vụ + bài có slug Úc), hoặc bài có ô Điện thoại
// = số Ms Vy (ContactOverride bật qua setHienSoVy).
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
  return UC_PATH.test(pathname) || bai;
}

/** Hotline chính của trang đang xem: trang Úc -> Ms Vy, còn lại -> Ms Min. */
export function useHotline() {
  return useTrangUc()
    ? { phone: site.phone2, display: site.phone2Display, name: site.contactName2, zalo: `https://zalo.me/${site.phone2}` }
    : { phone: site.phone, display: site.phoneDisplay, name: site.contactName, zalo: site.zalo };
}
