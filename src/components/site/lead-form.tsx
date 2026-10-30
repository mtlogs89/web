"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { submitLead, type LeadState } from "@/app/actions";
import { trackLeadCreated } from "@/lib/openai-pixel";
import { CallAction } from "./call-action";
import { ZaloLink } from "./zalo-link";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-medium outline-none focus:border-brand-500";

const compactInputCls =
  "mt-1.5 w-full min-h-12 rounded-2xl border border-slate-200 bg-white px-3.5 py-3.5 text-base font-medium text-ink outline-none focus:border-[#0E7568] focus:ring-2 focus:ring-[#4DC3B5]/50";

type LeadFormProps = {
  /** Form ngắn: tên, số điện thoại, hàng gửi. Tuyến điền sẵn. */
  compact?: boolean;
  defaultRoute?: string;
  /** Ghi vào lead để biết yêu cầu đến từ trang nào. */
  source?: string;
  notePlaceholder?: string;
  /** Hiện nút gọi / Zalo sau khi gửi thành công. */
  phone?: string;
  contactName?: string;
  zaloHref?: string;
};

export function LeadForm({
  compact = false,
  defaultRoute,
  source,
  notePlaceholder,
  phone,
  contactName,
  zaloHref,
}: LeadFormProps = {}) {
  const [state, formAction, pending] = useActionState<LeadState, FormData>(submitLead, null);
  const reported = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!state?.ok || reported.current) return;
    reported.current = true;
    trackLeadCreated();
    successRef.current?.focus();
  }, [state]);

  if (state?.ok) {
    if (compact) {
      return (
        <div role="status" className="scroll-mb-28 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#4DC3B5]/25">
            <CheckCircle2 className="h-10 w-10 text-[#0E7568]" aria-hidden />
          </div>
          <h2
            ref={successRef}
            tabIndex={-1}
            className="mt-4 text-2xl font-black text-ink outline-none"
          >
            Đã nhận yêu cầu báo giá
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{state.message}</p>
          {contactName ? (
            <p className="mt-2 text-lg font-semibold text-ink">{contactName} sẽ gọi lại số bạn vừa gửi.</p>
          ) : null}
          {phone && zaloHref ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <CallAction
                id="lp-call-success"
                phone={phone}
                ariaLabel={`Gọi ${contactName ?? ""} ${phone}`.trim()}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#C4474F] px-5 text-base font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a]"
              >
                <Phone className="h-5 w-5" aria-hidden />
                Gọi {phone}
              </CallAction>
              <ZaloLink
                id="lp-zalo-success"
                href={zaloHref}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0068FF] px-5 text-base font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                Nhắn Zalo
              </ZaloLink>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div role="status" className="flex flex-col items-center rounded-3xl bg-brand-50 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-500" />
        <h3 ref={successRef} tabIndex={-1} className="mt-4 text-xl font-black text-ink outline-none">
          Cảm ơn bạn!
        </h3>
        <p className="mt-2 text-ink-soft">{state.message}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <form action={formAction} aria-labelledby="bao-gia-title" aria-busy={pending || undefined}>
        <h2 id="bao-gia-title" className="text-2xl font-black text-ink">
          Nhận báo giá
        </h2>
        <p className="mt-2 text-lg leading-relaxed text-ink-soft">
          Để lại tên và số điện thoại{contactName ? `. ${contactName} gọi lại cho bạn` : ""}.
        </p>
        {defaultRoute ? <input type="hidden" name="route" value={defaultRoute} /> : null}
        {source ? <input type="hidden" name="source" value={source} /> : null}

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="lead-name" className="text-base font-semibold text-ink">
              Họ và tên <span className="text-[#DC5A62]" aria-hidden>*</span>
              <span className="sr-only"> (bắt buộc)</span>
            </label>
            <input
              id="lead-name"
              name="name"
              required
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              className={compactInputCls}
            />
          </div>
          <div>
            <label htmlFor="lead-phone" className="text-base font-semibold text-ink">
              Số điện thoại <span className="text-[#DC5A62]" aria-hidden>*</span>
              <span className="sr-only"> (bắt buộc)</span>
            </label>
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="09xx xxx xxx"
              className={compactInputCls}
            />
          </div>
          <div>
            <label htmlFor="lead-message" className="text-base font-semibold text-ink">
              Hàng gửi
            </label>
            <input
              id="lead-message"
              name="message"
              autoComplete="off"
              placeholder={notePlaceholder ?? "Thuốc tây, thịt, trứng, sữa, hàng Amazon"}
              className={compactInputCls}
            />
          </div>
        </div>

        {state && !state.ok && (
          <p role="alert" className="mt-3 text-base font-semibold text-[#C4474F]">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#C4474F] px-5 text-lg font-bold text-white shadow-lg shadow-[#C4474F]/25 transition hover:bg-[#B23A44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14323a] disabled:opacity-60"
        >
          <Send className="h-5 w-5" aria-hidden />
          {pending ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
        </button>
      </form>
    );
  }

  return (
    <form action={formAction} className="rounded-3xl border border-brand-50 bg-white p-7 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink-soft">Họ và tên *</label>
          <input name="name" required placeholder="Nguyễn Văn A" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-soft">Số điện thoại *</label>
          <input name="phone" required placeholder="09xx xxx xxx" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-soft">Tuyến gửi</label>
          <select name="route" defaultValue={defaultRoute ?? ""} className={inputCls}>
            <option value="">— Chọn điểm đến —</option>
            <option>Gửi đi Mỹ</option>
            <option>Gửi đi Úc</option>
            <option>Gửi đi Canada</option>
            <option>Gửi đi Châu Âu</option>
            <option>Gửi đi Nhật / Hàn</option>
            <option>Nhập hàng Trung Quốc / Thái Lan</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink-soft">Cân nặng ước tính</label>
          <input name="weight" placeholder="VD: 5 kg" className={inputCls} />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium text-ink-soft">Loại hàng / ghi chú</label>
        <textarea
          name="message"
          rows={3}
          placeholder="VD: thực phẩm khô, mỹ phẩm, hàng dễ vỡ…"
          className={inputCls}
        />
      </div>

      {state && !state.ok && (
        <p className="mt-3 text-sm font-medium text-coral-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-coral-500 py-3.5 font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-600 disabled:opacity-60"
      >
        <Send className="h-5 w-5" /> {pending ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
      </button>
    </form>
  );
}
