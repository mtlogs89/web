"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  /** Số để gọi/sao chép, dạng liền: 0589778989 */
  phone: string;
  className?: string;
  children: React.ReactNode;
  /** id gắn cho link tel: (vd "floating-call"). Nút sao chép nhận id + "-copy". */
  id?: string;
  ariaLabel?: string;
};

/**
 * Nút gọi hai chế độ theo thiết bị:
 *
 * - Thiết bị cảm ứng (pointer: coarse) -> link `tel:` như bình thường.
 * - Máy tính có chuột (pointer: fine)  -> KHÔNG render `tel:`, thay bằng nút sao chép số.
 *
 * Lý do: trên máy tính, bấm `tel:` gần như không bao giờ thành cuộc gọi, nhưng cú click
 * vẫn khiến GTM bắn sự kiện và Google Ads tính 1 chuyển đổi -> báo cáo nhiều cuộc gọi
 * hơn số cuộc thực nhận. Chặn `preventDefault` không giải quyết được vì GTM bắt sự kiện
 * click chứ không quan tâm điều hướng có xảy ra hay không — nên href phải thật sự không
 * phải `tel:` trên máy tính.
 *
 * Render cả hai rồi ẩn một bằng CSS (không dùng JS phát hiện thiết bị) để tránh nháy
 * giao diện và hoạt động ngay cả trước khi hydrate.
 */
export function CallAction({ phone, className, children, id, ariaLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Đọc số từ data-phone để ContactOverride (bài viết có hotline riêng) đổi được.
      const num = e.currentTarget.dataset.phone || phone;
      try {
        await navigator.clipboard.writeText(num);
      } catch {
        return; // Không sao chép được thì thôi — số vẫn hiện dạng chữ để đọc.
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    },
    [phone],
  );

  return (
    <>
      <span className="contents pointer-fine:hidden">
        <a href={`tel:${phone}`} id={id} aria-label={ariaLabel} className={className}>
          {children}
        </a>
      </span>

      <span className="hidden pointer-fine:contents">
        <button
          type="button"
          id={id ? `${id}-copy` : undefined}
          data-phone={phone}
          onClick={copy}
          aria-label={ariaLabel ? `${ariaLabel} — bấm để sao chép số` : "Bấm để sao chép số điện thoại"}
          title="Bấm để sao chép số"
          className={`${className ?? ""} relative cursor-pointer`}
        >
          {children}
          {copied && (
            <span
              role="status"
              className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white shadow-lg"
            >
              Đã sao chép
            </span>
          )}
        </button>
      </span>
    </>
  );
}
