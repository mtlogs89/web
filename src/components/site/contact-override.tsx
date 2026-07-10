"use client";

import { useEffect } from "react";

/**
 * Ghi đè số điện thoại của nút Gọi/Zalo nổi (floating-contact) khi bài viết
 * có hotline riêng. Không render gì — chỉ đổi href lúc mount.
 */
export function ContactOverride({ phone }: { phone: string }) {
  useEffect(() => {
    if (!phone) return;
    const call = document.getElementById("floating-call") as HTMLAnchorElement | null;
    const zalo = document.getElementById("floating-zalo") as HTMLAnchorElement | null;
    const prevCall = call?.href;
    const prevZalo = zalo?.href;
    if (call) call.href = `tel:${phone}`;
    if (zalo) zalo.href = `https://zalo.me/${phone}`;
    return () => {
      // Rời trang bài viết (client navigation) -> trả lại hotline mặc định
      if (call && prevCall) call.href = prevCall;
      if (zalo && prevZalo) zalo.href = prevZalo;
    };
  }, [phone]);
  return null;
}
