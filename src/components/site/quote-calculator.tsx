"use client";

// Tuyến có dịch vụ đi nhanh 3–5 ngày (lib/transit.ts).
const FAST_ROUTES = new Set(["my", "canada", "uc"]);

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bolt, ArrowRight, Calculator, Phone, PhoneCall, MessageCircle, CheckCircle2 } from "lucide-react";
import {
  destinations as fallbackDestinations,
  cargoTypes,
  estimate,
  vnd,
  type Destination,
  type EstimateResult,
} from "@/lib/pricing";
import { CallAction } from "./call-action";
import { ZaloLink } from "./zalo-link";
import { submitQuoteLead, type QuoteLeadState } from "@/app/actions";
import { site } from "@/lib/site";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-medium outline-none focus:border-brand-500";

export function QuoteCalculator({
  defaultDestKey,
  dests,
  phone,
  source,
}: {
  defaultDestKey?: string;
  /** Bảng giá đã nạp từ /admin/bang-gia; bỏ trống thì dùng bảng cứng. */
  dests?: Destination[];
  /** Hotline riêng của trang (bài có số riêng); bỏ trống thì dùng hotline chung. */
  phone?: string | null;
  /** Vị trí công cụ trên trang (vd "giua-bai") — ghi vào thống kê dạng /trang#vi-tri. */
  source?: string;
} = {}) {
  const destinations = dests ?? fallbackDestinations;
  const callPhone = phone || site.phone;
  const callDisplay = phone ? formatPhone(phone) : site.phoneDisplay;
  const zaloHref = phone ? `https://zalo.me/${phone}` : site.zalo;
  // Mỗi lần bấm tính là một lượt mới: khung liên hệ bên dưới dựng lại từ đầu,
  // không giữ thông báo "đã gửi" của lượt trước.
  const [calcCount, setCalcCount] = useState(0);
  const initialDest = destinations.some((d) => d.key === defaultDestKey)
    ? (defaultDestKey as string)
    : destinations[0].key;
  const [destKey, setDestKey] = useState(initialDest);
  // Trước khi tính: tuyến đang chọn có hotline riêng thì hiện số đó.
  const soTuyenDangChon = ROUTE_PHONE[destKey] ?? phone ?? null;
  const [weight, setWeight] = useState("5");
  const [cargoKey, setCargoKey] = useState(cargoTypes[0].key);
  const [showDims, setShowDims] = useState(false);
  const [dims, setDims] = useState({ l: "", w: "", h: "" });
  const [result, setResult] = useState<EstimateResult | null>(null);

  function calc() {
    const r = estimate(
      {
        destKey,
        weightKg: Number(weight),
        cargoKey,
        dims: showDims
          ? { l: Number(dims.l) || 0, w: Number(dims.w) || 0, h: Number(dims.h) || 0 }
          : undefined,
      },
      destinations,
    );
    setResult(r);
    setCalcCount((n) => n + 1);
    if (r) logEstimate(r);
  }

  /** Ghi lượt bấm để xem ở /admin/tinh-cuoc. Không chờ, hỏng thì bỏ qua. */
  function logEstimate(r: EstimateResult) {
    try {
      // Chuỗi ngẫu nhiên trong phiên, chỉ để phân biệt một người bấm nhiều lần
      // với nhiều người bấm — không nhận dạng được ai.
      const sid = getQuoteSid();

      void fetch("/api/quote-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dest: destKey,
          destLabel: r.destLabel,
          weight: Number(weight),
          cargo: cargoKey,
          dims: showDims && dims.l ? `${dims.l}x${dims.w}x${dims.h}` : null,
          page: window.location.pathname + (source ? `#${source}` : ""),
          mode: r.mode,
          priceTotal: r.mode === "price" ? r.total : null,
          sessionId: sid,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Không bao giờ để việc ghi thống kê làm hỏng công cụ tính cước.
    }
  }

  return (
    <div>
      {/* Chèn giữa bài thì khung bao ngoài đã có tiêu đề riêng — bỏ tiêu đề này cho đỡ lặp. */}
      {!source && (
        <>
          <div className="flex items-center gap-2 font-semibold text-brand-600">
            <Bolt className="h-5 w-5" /> Báo giá nhanh
          </div>
          <h2 className="mt-1 text-xl font-bold text-ink">Ước tính chi phí vận chuyển</h2>
        </>
      )}

      <div className={source ? "space-y-4" : "mt-5 space-y-4"}>
        <div>
          <label className="text-sm font-medium text-ink-soft">Tuyến vận chuyển</label>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-brand-50 px-3 py-3">
              <span className="font-medium text-ink">Việt Nam</span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" />
            <select
              value={destKey}
              onChange={(e) => setDestKey(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 font-medium outline-none focus:border-brand-500"
            >
              {destinations.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-soft">Cân nặng (kg)</label>
            <input
              type="number"
              min={0}
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-soft">Loại hàng</label>
            <select
              value={cargoKey}
              onChange={(e) => setCargoKey(e.target.value)}
              className={inputCls}
            >
              {cargoTypes.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDims((v) => !v)}
          className="text-sm font-medium text-brand-600"
        >
          {showDims ? "− Ẩn kích thước" : "+ Thêm kích thước (hàng cồng kềnh)"}
        </button>
        {showDims && (
          <div className="grid grid-cols-3 gap-3">
            {(["l", "w", "h"] as const).map((k, i) => (
              <div key={k}>
                <label className="text-xs font-medium text-ink-muted">
                  {["Dài", "Rộng", "Cao"][i]} (cm)
                </label>
                <input
                  type="number"
                  min={0}
                  value={dims[k]}
                  onChange={(e) => setDims({ ...dims, [k]: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={calc}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
        >
          <Calculator className="h-5 w-5" /> Tính ước tính
        </button>

        {result?.mode === "price" && (
          <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
            <div className="text-sm text-ink-soft">
              Ước tính đi <strong className="text-ink">{result.destLabel}</strong> · {result.chargeable} kg tính cước
            </div>
            <div className="mt-1 text-2xl font-black text-brand-700">{vnd(result.total)}</div>
            <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-ink-soft">
              <span>
                Thời gian: {result.transit[0]}–{result.transit[1]} ngày
                {FAST_ROUTES.has(destKey) && " làm việc · cần gấp đi nhanh 3–5 ngày"}
              </span>
              {result.baoThue && <span className="text-brand-600">· Đã bao thuế nhập khẩu</span>}
            </div>
            {result.surchargeApplied > 0 && (
              <div className="mt-0.5 text-xs text-ink-muted">Đã gồm phụ thu loại hàng: {vnd(result.surchargeApplied)}</div>
            )}
            {result.note && <div className="mt-0.5 text-xs text-ink-muted">{result.note}</div>}
            <p className="mt-2 text-xs text-ink-muted">
              * Giá tham khảo, có thể thay đổi theo thời gian và quy cách hàng. Liên hệ để chốt giá chính xác.
            </p>
            <AfterQuote
              key={calcCount}
              quote={{
                dest: destKey,
                destLabel: result.destLabel,
                weight: Number(weight),
                cargoLabel: cargoTypes.find((c) => c.key === cargoKey)?.label ?? cargoKey,
                priceTotal: result.total,
                chargeable: result.chargeable,
                source,
              }}
              callPhone={callPhone}
              callDisplay={callDisplay}
              zaloHref={zaloHref}
            />
          </div>
        )}

        {result?.mode === "contact" && (
          <div className="rounded-2xl border border-coral-100 bg-coral-50 p-4">
            <div className="font-semibold text-ink">{result.destLabel}</div>
            <p className="mt-1 text-sm text-ink-soft">{result.reason}</p>
            <AfterQuote
              key={calcCount}
              quote={{
                dest: destKey,
                destLabel: result.destLabel,
                weight: Number(weight),
                cargoLabel: cargoTypes.find((c) => c.key === cargoKey)?.label ?? cargoKey,
                priceTotal: null,
                chargeable: Number(weight),
                reason: result.reason,
                source,
              }}
              callPhone={callPhone}
              callDisplay={callDisplay}
              zaloHref={zaloHref}
            />
          </div>
        )}

        {!result && (
          <p className="text-center text-sm text-ink-soft">
            Hoặc gọi ngay{" "}
            <CallAction
              phone={soTuyenDangChon ?? site.phone}
              className="font-bold text-brand-600"
              conversionLabel="VzBiCL7SkdUcEKnr1_49"
            >
              {soTuyenDangChon ? formatPhone(soTuyenDangChon) : site.phoneDisplay}
            </CallAction>
            {!soTuyenDangChon && <> ({site.contactName})</>}
          </p>
        )}
      </div>
    </div>
  );
}

/** Chuỗi ngẫu nhiên theo phiên — nối lượt tính giá với cú bấm liên hệ sau đó. */
function getQuoteSid(): string | null {
  try {
    let sid = sessionStorage.getItem("mt_quote_sid");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("mt_quote_sid", sid);
    }
    return sid;
  } catch {
    return null; // Trình duyệt chặn lưu trữ (ẩn danh) — vẫn ghi, chỉ là không nối được phiên.
  }
}

type QuoteInfo = {
  dest: string;
  destLabel: string;
  weight: number;
  cargoLabel: string;
  priceTotal: number | null;
  /** Cân tính cước (đã quy đổi kích thước) — dùng để chọn mức ưu đãi. */
  chargeable: number;
  reason?: string;
  source?: string;
};

function logQuoteAction(action: "zalo" | "call", q: QuoteInfo) {
  try {
    void fetch("/api/quote-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        sessionId: getQuoteSid(),
        dest: q.dest,
        weight: q.weight,
        page: window.location.pathname + (q.source ? `#${q.source}` : ""),
      }),
      // keepalive: request vẫn đi dù trình duyệt đang chuyển sang Zalo / trình gọi.
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Thống kê hỏng thì bỏ qua.
  }
}

function gioViet() {
  return Number(
    new Date().toLocaleString("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", hour12: false }),
  );
}

/**
 * Số khung liên hệ đang nằm trên màn hình. Trang có thể có 2 công cụ tính (đầu
 * trang + giữa bài), nên đếm chung — còn khung nào hiện thì nút nổi vẫn ẩn.
 */
let khungDangHien = 0;

/** Hotline riêng theo tuyến: khách tính giá tuyến này thì Gọi/Zalo dùng số này. */
const ROUTE_PHONE: Record<string, string> = { canada: "0899391119" };

/** 0899391119 -> 0899.39.11.19 (cùng kiểu với hotline chung 0589.77.89.89). */
function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  return d.length === 10 ? `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}.${d.slice(8)}` : p;
}

/** Tiền tố mã ưu đãi theo tuyến — nhân viên nghe mã là biết khách hỏi tuyến nào. */
const OFFER_PREFIX: Record<string, string> = { my: "US", canada: "CA" };

/** Viền chuyển màu theo logo: coral → amber → teal. */
const LOGO_GRADIENT = "linear-gradient(135deg,#EC5E5E 0%,#F2A93C 50%,#1FB6A2 100%)";

/**
 * Khung liên hệ ngay dưới con số giá — lúc khách đang quan tâm nhất.
 * Thứ tự (ưu tiên điện thoại): vé ưu đãi gọi ngay → Gọi / Zalo → ô để lại số.
 */
function AfterQuote({
  quote,
  callPhone,
  callDisplay,
  zaloHref,
}: {
  quote: QuoteInfo;
  callPhone: string;
  callDisplay: string;
  zaloHref: string;
}) {
  const [state, formAction, pending] = useActionState<QuoteLeadState, FormData>(
    submitQuoteLead,
    null,
  );
  const [sid, setSid] = useState("");
  const [page, setPage] = useState("");
  const [ngoaiGio, setNgoaiGio] = useState(false);

  useEffect(() => {
    setSid(getQuoteSid() ?? "");
    setPage(window.location.pathname + (quote.source ? `#${quote.source}` : ""));
    const h = gioViet();
    setNgoaiGio(h < 8 || h >= 21);
  }, []);

  // Khung này đang trên màn hình thì ẩn 2 nút Gọi/Zalo nổi ở góc: trên điện thoại
  // chúng đè lên nút "Gọi lại cho tôi", mà khung đã có sẵn nút Gọi và Zalo.
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let dangHien = false;
    const dat = (v: boolean) => {
      if (v === dangHien) return;
      dangHien = v;
      khungDangHien += v ? 1 : -1;
      document.documentElement.classList.toggle("hide-floating", khungDangHien > 0);
    };
    const io = new IntersectionObserver(([e]) => dat(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => {
      io.disconnect();
      dat(false);
    };
  }, []);

  const coGia = quote.priceTotal != null;

  // Tuyến có hotline riêng (vd Canada) thì Gọi/Zalo dùng số đó, không theo trang đang xem.
  const soTuyen = ROUTE_PHONE[quote.dest];
  const goiSo = soTuyen ?? callPhone;
  const goiHienThi = soTuyen ? formatPhone(soTuyen) : callDisplay;
  const zaloLink = soTuyen ? `https://zalo.me/${soTuyen}` : zaloHref;

  // Ưu đãi gọi ngay theo cân tính cước: dưới 10kg giảm 100k, từ 10kg trở lên giảm 200k.
  // Mã theo tuyến khách chọn (không theo trang đang xem): Mỹ US…, Canada CA…,
  // tuyến khác tạm dùng WEB… cho tới khi chủ đặt mã riêng.
  const tienTo = OFFER_PREFIX[quote.dest] ?? "WEB";
  const offer =
    quote.chargeable >= 10
      ? { amount: 200000, short: "200K", code: `${tienTo}200`, label: "từ 10kg" }
      : quote.chargeable > 0
        ? { amount: 100000, short: "100K", code: `${tienTo}100`, label: "dưới 10kg" }
        : null;

  return (
    <div ref={boxRef} className="mt-4 space-y-3">
      {offer && (
        <div className="offer-pop relative overflow-hidden rounded-2xl shadow-xl shadow-coral-500/25">
          <div
            className="relative flex items-center gap-3 px-4 pb-3.5 pt-3.5 text-white"
            style={{ background: "linear-gradient(120deg,#EC5E5E 0%,#EE7446 60%,#F2A93C 100%)" }}
          >
            <span
              aria-hidden
              className="offer-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            <div className="relative min-w-0 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/95">
                🎁 Ưu đãi gọi ngay
              </div>
              <div className="mt-1 whitespace-nowrap text-[34px] font-black leading-none tracking-tight [text-shadow:0_1px_2px_rgb(0_0_0/0.15)]">
                Giảm {offer.short}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] font-semibold">
                <span>Cho đơn {offer.label}</span>
                <span className="rounded-lg bg-white px-2 py-0.5 font-black tracking-wider text-coral-600 shadow-sm">
                  Mã {offer.code}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 border-t-2 border-dashed border-coral-200 bg-white px-4 py-2.5">
            {quote.priceTotal != null ? (
              <>
                <span className="shrink-0 whitespace-nowrap text-[13px] font-semibold text-ink-soft">Chỉ còn</span>
                <span className="text-right">
                  <b className="text-[20px] font-black text-coral-600">
                    {vnd(Math.max(0, quote.priceTotal - offer.amount))}
                  </b>{" "}
                  <span className="text-xs text-ink-muted line-through">{vnd(quote.priceTotal)}</span>
                </span>
              </>
            ) : (
              <span className="text-[13px] font-semibold text-ink-soft">
                Gọi ngay để nhận báo giá kèm ưu đãi — đọc mã {offer.code}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-[1.3fr_1fr] gap-2">
        <span className="contents" onClickCapture={() => logQuoteAction("call", quote)}>
          <CallAction
            phone={goiSo}
            conversionLabel="VzBiCL7SkdUcEKnr1_49"
            className="cta-pulse flex min-h-[54px] w-full flex-col items-center justify-center rounded-xl bg-brand-700 px-3 py-2 text-white transition hover:brightness-110 active:scale-[0.98]"
          >
            <span className="flex items-center gap-1.5 text-[16px] font-black leading-tight">
              <Phone className="h-[18px] w-[18px]" /> Gọi ngay
            </span>
            <span className="text-[12px] font-semibold text-white/90">{goiHienThi}</span>
          </CallAction>
        </span>
        <span className="contents" onClickCapture={() => logQuoteAction("zalo", quote)}>
          <ZaloLink
            href={zaloLink}
            conversionLabel="G8fXCJ6D_NQcEKnr1_49"
            className="flex min-h-[54px] w-full flex-col items-center justify-center rounded-xl bg-[#0068FF] px-3 py-2 text-white shadow-lg shadow-[#0068FF]/25 transition hover:bg-[#0057d6] active:scale-[0.98]"
          >
            <span className="flex items-center gap-1.5 text-[16px] font-black leading-tight">
              <MessageCircle className="h-[18px] w-[18px]" /> Zalo
            </span>
            <span className="text-[12px] font-semibold text-white/90">
              {coGia ? "chốt giá" : "báo giá"}
            </span>
          </ZaloLink>
        </span>
      </div>
      {coGia && (
        <p className="-mt-1 text-center text-[12px] leading-snug text-ink-muted">
          Nhắn Zalo kèm mã bưu điện (postal code) người nhận để có giá đúng.
        </p>
      )}

      {state?.ok ? (
        <div className="rounded-2xl p-[2px]" style={{ background: LOGO_GRADIENT }}>
          <div className="flex items-start gap-3 rounded-[14px] bg-white p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[19px] font-black text-ink">Cảm ơn bạn!</div>
              <div className="text-[15px] leading-snug text-ink-soft">{state.message}</div>
            </div>
          </div>
        </div>
      ) : (
        <form
          action={formAction}
          className="rounded-2xl p-[2px] shadow-lg shadow-brand-500/15"
          style={{ background: LOGO_GRADIENT }}
        >
          <div className="rounded-[14px] bg-white p-4">
            <div className="flex items-start gap-3">
              {/* Ẩn trên điện thoại để tiêu đề chữ to được trải hết chiều ngang. */}
              <span
                className="hidden h-12 w-12 shrink-0 place-items-center rounded-full text-white shadow-md sm:grid"
                style={{ background: "linear-gradient(135deg,#F2A93C,#EC5E5E)" }}
              >
                <PhoneCall className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <div className="text-[19px] font-black leading-tight text-ink sm:text-[21px]">
                  Để lại số điện thoại —{" "}
                  <span className="text-coral-600">MINH THIỆN</span>{" "}
                  {ngoaiGio ? "gọi lại lúc 8h sáng" : "gọi trong 5 phút"}
                </div>
                <div className="mt-1 text-[14px] leading-snug text-ink-soft">
                  {soTuyen ? "Tư vấn miễn phí · gọi lại ngay cho bạn" : "Tư vấn miễn phí · Ms Min gọi lại cho bạn"}
                </div>
              </div>
            </div>

            <input type="hidden" name="sessionId" value={sid} />
            <input type="hidden" name="page" value={page} />
            <input type="hidden" name="dest" value={quote.dest} />
            <input type="hidden" name="destLabel" value={quote.destLabel} />
            <input type="hidden" name="weight" value={quote.weight} />
            <input type="hidden" name="cargoLabel" value={quote.cargoLabel} />
            <input type="hidden" name="priceTotal" value={quote.priceTotal ?? ""} />
            <input type="hidden" name="reason" value={quote.reason ?? ""} />
            <input type="hidden" name="offer" value={offer?.code ?? ""} />
            {/* Bẫy bot: người thật không thấy ô này. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              {/* text-base (16px): nhỏ hơn thì iPhone tự phóng to trang khi bấm vào ô. */}
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="Số điện thoại của bạn"
                className="h-[58px] w-full min-w-0 rounded-xl border-2 border-brand-100 bg-brand-50/50 px-4 text-[17px] font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-muted focus:border-brand-500 focus:bg-white sm:flex-1"
              />
              <button
                type="submit"
                disabled={pending}
                className="h-[58px] w-full shrink-0 rounded-xl bg-coral-600 px-5 text-[18px] font-black text-white shadow-lg shadow-coral-500/30 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
              >
                {pending ? "Đang gửi…" : "Gọi lại cho tôi"}
              </button>
            </div>
            {state && !state.ok && (
              <p className="mt-2 text-[13px] font-semibold text-coral-600">{state.message}</p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
