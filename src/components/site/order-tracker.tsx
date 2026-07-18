"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Search,
  PackageCheck,
  MapPin,
  CircleDot,
  ExternalLink,
  Truck,
  Loader2,
} from "lucide-react";

const TRACK_API =
  process.env.NEXT_PUBLIC_TRACK_API_URL ||
  "https://app.minhthienlogs.com/api/public/track";

type TrackOrder = {
  code: string;
  receiver: string;
  destination: string;
  status: string;
  createdAt: string;
};
type TrackEvent = { date: string; status: string; location: string; note: string };
type TrackResult = {
  ok: boolean;
  error?: string;
  needPhone?: boolean;
  order?: TrackOrder;
  events?: TrackEvent[];
};

/** Mã đơn nội bộ Minh Thiện: bắt đầu bằng MT */
function isInternalCode(code: string): boolean {
  return /^MT/i.test(code.trim());
}

/** Nhận diện hãng để hiện nút tra cứu trực tiếp (hiện chỉ cần UPS). */
function detectCarrier(code: string): { name: string; url: string } | null {
  const c = code.trim().toUpperCase();
  if (/^1Z[0-9A-Z]{16}$/.test(c)) {
    return { name: "UPS", url: `https://www.ups.com/track?tracknum=${encodeURIComponent(c)}` };
  }
  return null;
}

/** Tên nước cho đẹp (API trả raw như "usa"). */
const COUNTRY_VI: Record<string, string> = {
  usa: "Mỹ",
  us: "Mỹ",
  "united states": "Mỹ",
  australia: "Úc",
  au: "Úc",
  canada: "Canada",
  ca: "Canada",
  japan: "Nhật Bản",
  jp: "Nhật Bản",
  korea: "Hàn Quốc",
  "south korea": "Hàn Quốc",
  kr: "Hàn Quốc",
  germany: "Đức",
  france: "Pháp",
  uk: "Anh",
  "united kingdom": "Anh",
};
function prettyCountry(raw: string): string {
  if (!raw) return "—";
  const key = raw.trim().toLowerCase();
  return COUNTRY_VI[key] || raw.charAt(0).toUpperCase() + raw.slice(1);
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-ink-muted">{label}</div>
      <div className="font-semibold text-ink">{value}</div>
    </div>
  );
}

export function OrderTracker({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [digits, setDigits] = useState<[string, string]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [external, setExternal] = useState<string | null>(null);

  const d0Ref = useRef<HTMLInputElement>(null);
  const d1Ref = useRef<HTMLInputElement>(null);

  const trimmed = code.trim();
  const internal = trimmed ? isInternalCode(trimmed) : false;
  const phone = (digits[0] + digits[1]).replace(/\D/g, "");
  const canSubmit = trimmed.length > 0 && (!internal || phone.length === 2);

  function setDigit(i: 0 | 1, v: string) {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next: [string, string] = [prev[0], prev[1]];
      next[i] = clean;
      return next;
    });
    if (clean && i === 0) d1Ref.current?.focus();
  }

  function onDigitKeyDown(i: 0 | 1, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i === 1) {
      d0Ref.current?.focus();
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!trimmed) return;

    // Mã hãng ngoài → không gọi API nội bộ, chỉ hiện link tra cứu hãng.
    if (!internal) {
      setResult(null);
      setExternal(trimmed);
      return;
    }

    setExternal(null);
    if (phone.length !== 2) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `${TRACK_API}?code=${encodeURIComponent(trimmed)}&phone=${encodeURIComponent(phone)}`,
        { cache: "no-store" }
      );
      const data = (await res.json()) as TrackResult;
      setResult(data);
    } catch {
      setResult({
        ok: false,
        error: "Hệ thống tra cứu đang bận, vui lòng thử lại sau ít phút.",
      });
    } finally {
      setLoading(false);
    }
  }

  const order = result?.ok ? result.order : undefined;
  const events = result?.ok ? result.events ?? [] : [];
  const carrier = external ? detectCarrier(external) : null;
  const universalUrl = external
    ? `https://t.17track.net/en#nums=${encodeURIComponent(external)}`
    : "";

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Mã đơn hàng</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Nhập mã đơn Minh Thiện (VD: MT-0000276)"
            className="w-full rounded-xl border border-slate-200 px-4 py-3.5 font-medium uppercase outline-none focus:border-brand-500"
            autoComplete="off"
          />
        </div>

        {/* Xác minh 2 số cuối SĐT — chỉ cho mã Minh Thiện */}
        {internal && (
          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 sm:p-5">
            <label className="block text-sm font-semibold text-ink">
              2 số cuối số điện thoại người nhận
            </label>
            <p className="mt-0.5 text-xs text-ink-muted">
              Để bảo mật thông tin đơn hàng, vui lòng nhập 2 số cuối SĐT người nhận.
            </p>
            <div className="mt-3 flex gap-2.5">
              <input
                ref={d0Ref}
                value={digits[0]}
                onChange={(e) => setDigit(0, e.target.value)}
                onKeyDown={(e) => onDigitKeyDown(0, e)}
                inputMode="numeric"
                maxLength={1}
                aria-label="Số thứ nhất"
                className="h-14 w-14 rounded-xl border border-slate-200 bg-white text-center text-2xl font-black text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <input
                ref={d1Ref}
                value={digits[1]}
                onChange={(e) => setDigit(1, e.target.value)}
                onKeyDown={(e) => onDigitKeyDown(1, e)}
                inputMode="numeric"
                maxLength={1}
                aria-label="Số thứ hai"
                className="h-14 w-14 rounded-xl border border-slate-200 bg-white text-center text-2xl font-black text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Đang tra cứu…
            </>
          ) : (
            <>
              <Search className="h-5 w-5" /> Tra cứu
            </>
          )}
        </button>
      </form>

      {/* Mã hãng ngoài */}
      {external && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
          <div className="flex items-center gap-3 bg-brand-50 px-6 py-5">
            <Truck className="h-6 w-6 shrink-0 text-brand-600" />
            <div>
              <div className="text-sm text-ink-muted">Mã vận đơn hãng ngoài</div>
              <div className="font-bold text-ink">{external}</div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="mb-4 text-sm text-ink-soft">Đây là mã vận đơn của hãng vận chuyển. Bạn có thể:</p>
            <div className="flex flex-col gap-2">
              {carrier && (
                <a
                  href={carrier.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
                >
                  <ExternalLink className="h-5 w-5" /> Xem trên {carrier.name}
                </a>
              )}
              <a
                href={universalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition ${
                  carrier
                    ? "border border-brand-100 bg-white text-ink hover:bg-brand-50"
                    : "bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
                }`}
              >
                <ExternalLink className="h-5 w-5" /> Xem hành trình (mọi hãng)
              </a>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              Mẹo: nếu là đơn Minh Thiện, hãy nhập mã bắt đầu bằng <strong>MT-</strong> để xem ngay trên trang này.
            </p>
          </div>
        </div>
      )}

      {/* Lỗi tra cứu mã MT */}
      {result && !result.ok && (
        <div className="mt-8 rounded-2xl border border-coral-100 bg-coral-50 p-6 text-center font-medium text-coral-700">
          {result.error || "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại."}
        </div>
      )}

      {/* Kết quả đơn MT */}
      {order && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 bg-brand-50 px-6 py-5">
            <div>
              <div className="text-sm text-ink-muted">Mã đơn</div>
              <div className="text-xl font-black text-brand-700">{order.code}</div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              <PackageCheck className="h-4 w-4" /> {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
            <Info label="Người nhận" value={order.receiver} />
            <Info label="Điểm đến" value={prettyCountry(order.destination)} />
            <Info label="Ngày tiếp nhận" value={new Date(order.createdAt).toLocaleDateString("vi-VN")} />
          </div>

          <div className="border-t border-brand-50 px-6 py-6">
            <h3 className="mb-4 font-black text-ink">Hành trình đơn hàng</h3>
            {events.length === 0 ? (
              <p className="text-ink-soft">
                Đơn đang ở trạng thái: <strong className="text-ink">{order.status}</strong>. Hành
                trình chi tiết sẽ hiển thị khi kiện hàng bắt đầu di chuyển.
              </p>
            ) : (
              <ol className="relative ml-3 border-l-2 border-brand-100">
                {events.map((e, i) => (
                  <li key={i} className="mb-6 ml-6 last:mb-0">
                    <span
                      className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full ${
                        i === 0 ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-600"
                      }`}
                    >
                      {i === 0 ? <CircleDot className="h-3 w-3" /> : null}
                    </span>
                    <div className="font-bold text-ink">{e.status}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                      {e.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {e.location}
                        </span>
                      )}
                      {e.date && <span>{e.date}</span>}
                    </div>
                    {e.note && <p className="mt-1 text-sm text-ink-soft">{e.note}</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  );
}
