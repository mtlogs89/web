import { Fragment } from "react";
import { QuoteCalculator } from "./quote-calculator";
import type { Destination } from "@/lib/pricing";

/**
 * Nội dung bài viết (HTML từ trình soạn thảo) có hỗ trợ mã chèn.
 *
 * Gõ `[[tinh-cuoc]]` vào một dòng riêng trong bài là công cụ tính cước hiện
 * đúng chỗ đó — chủ web tự đặt được vào bất kỳ bài nào, không cần sửa code.
 */
export const QUOTE_TOKEN = "[[tinh-cuoc]]";

// TipTap bọc dòng riêng thành <p>…</p>; bắt cả trường hợp mã nằm lẫn trong đoạn.
const TOKEN_RE = /<p>\s*\[\[tinh-cuoc\]\]\s*<\/p>|\[\[tinh-cuoc\]\]/g;

/** Ảnh trong bài chỉ tải khi khách cuộn tới. */
const lazyImg = (html: string) => html.replace(/<img /g, '<img loading="lazy" decoding="async" ');

/** Chuyên mục bài → tuyến mặc định cho công cụ tính chèn giữa bài. */
export function destFromCategory(category: string): { destKey?: string; country: string } {
  const map: Record<string, string> = {
    "Gửi hàng đi Mỹ": "my",
    "Gửi hàng đi Canada": "canada",
    "Gửi hàng đi Úc": "uc",
  };
  const country = category.replace(/^Gửi hàng đi\s+/i, "").trim();
  return { destKey: map[category], country: country && country !== category ? country : "nước ngoài" };
}

export function ArticleContent({
  html,
  proseClassName = "prose-mt",
  country,
  destKey,
  dests,
  phone,
}: {
  html: string;
  proseClassName?: string;
  country: string;
  destKey?: string;
  dests?: Destination[];
  phone?: string | null;
}) {
  // Regex không có nhóm bắt nên split trả về đúng các đoạn nằm giữa các mã.
  const parts = html.split(TOKEN_RE);

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part.trim() && (
            <div className={proseClassName} dangerouslySetInnerHTML={{ __html: lazyImg(part) }} />
          )}
          {i < parts.length - 1 && (
            <div
              className="-mx-2 my-8 rounded-[24px] p-[2px] shadow-xl shadow-brand-500/10 sm:mx-0"
              style={{ background: "linear-gradient(135deg,#EC5E5E 0%,#F2A93C 50%,#1FB6A2 100%)" }}
            >
              <div className="rounded-[22px] bg-white p-3.5 sm:p-6">
                <div className="mb-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-coral-500">
                    Tự tính trước chi phí
                  </p>
                  <p className="mt-1 text-xl font-black leading-snug text-ink sm:text-2xl">
                    Gửi hàng đi {country} hết bao nhiêu tiền?
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Nhập cân nặng — xem giá ngay, gọi liền được giảm thêm.
                  </p>
                </div>
                <QuoteCalculator defaultDestKey={destKey} dests={dests} phone={phone} source="giua-bai" />
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </>
  );
}
