"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

/** 0899391119 -> 0899.39.11.19 (cùng kiểu hotline chung 0589.77.89.89); số khác giữ nguyên. */
function hienSo(phone: string) {
  return /^\d{10}$/.test(phone)
    ? `${phone.slice(0, 4)}.${phone.slice(4, 6)}.${phone.slice(6, 8)}.${phone.slice(8)}`
    : phone;
}

/**
 * Ghi đè số điện thoại của nút Gọi/Zalo nổi (floating-contact) khi bài viết
 * có hotline riêng. Không render gì — chỉ đổi href lúc mount.
 *
 * Nút nổi đã có sẵn 2 hotline (site.phone, site.phone2). Bài dùng một trong hai số đó
 * thì giữ nguyên cả 2 nút gọi, chỉ đổi Zalo; bài dùng số khác thì thay nút gọi thứ nhất.
 */
export function ContactOverride({ phone }: { phone: string }) {
  useEffect(() => {
    if (!phone) return;
    const daCoSan = phone === site.phone || phone === site.phone2;
    const call = daCoSan ? null : (document.getElementById("floating-call") as HTMLAnchorElement | null);
    // Bản cho máy tính (nút sao chép, không phải link tel:) — xem CallAction.
    const callCopy = daCoSan ? null : (document.getElementById("floating-call-copy") as HTMLButtonElement | null);
    // Nhãn số hiện cạnh nút (có 2 bản: tel và sao chép).
    const labels = daCoSan ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-label-for=floating-call]"));
    // Tên người trực (Ms Min) không còn đúng với số riêng của bài -> chỉ ghi "Hotline".
    const names = daCoSan ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-name-for=floating-call]"));
    const zalo = document.getElementById("floating-zalo") as HTMLAnchorElement | null;
    const prevCall = call?.href;
    const prevCopy = callCopy?.dataset.phone;
    const prevLabels = labels.map((l) => l.textContent);
    const prevNames = names.map((n) => n.textContent);
    const prevZalo = zalo?.href;
    if (call) call.href = `tel:${phone}`;
    if (callCopy) callCopy.dataset.phone = phone;
    labels.forEach((l) => (l.textContent = hienSo(phone)));
    names.forEach((n) => (n.textContent = "Hotline"));
    if (zalo) zalo.href = `https://zalo.me/${phone}`;
    return () => {
      // Rời trang bài viết (client navigation) -> trả lại hotline mặc định
      if (call && prevCall) call.href = prevCall;
      if (callCopy && prevCopy) callCopy.dataset.phone = prevCopy;
      labels.forEach((l, i) => (l.textContent = prevLabels[i]));
      names.forEach((n, i) => (n.textContent = prevNames[i]));
      if (zalo && prevZalo) zalo.href = prevZalo;
    };
  }, [phone]);
  return null;
}
