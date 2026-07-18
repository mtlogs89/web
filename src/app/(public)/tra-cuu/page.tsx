import type { Metadata } from "next";
import { Search, PackageCheck, MapPin, CircleDot, ExternalLink, Truck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu hành trình đơn hàng vận chuyển quốc tế tại Minh Thiện Logistics bằng mã đơn.",
};

export const dynamic = "force-dynamic";

const TRACK_API = process.env.TRACK_API_URL || "https://app.minhthienlogs.com/api/public/track";

function isInternalCode(code: string): boolean {
  return /^MT/i.test(code.trim());
}

function detectCarrier(code: string): { name: string; url: string } | null {
  const c = code.trim().toUpperCase();
  if (/^1Z[0-9A-Z]{16}$/.test(c)) {
    return { name: "UPS", url: `https://www.ups.com/track?tracknum=${encodeURIComponent(c)}` };
  }
  return null;
}

type TrackResult = {
  ok: boolean;
  error?: string;
  order?: {
    code: string;
    receiver: string;
    destination: string;
    weight: number;
    status: string;
    createdAt: string;
  };
  events?: Array<{ date: string; status: string; location: string; note: string }>;
};

async function lookup(code: string): Promise<TrackResult | null> {
  try {
    const res = await fetch(`${TRACK_API}?code=${encodeURIComponent(code)}`, {
      cache: "no-store",
    });
    return (await res.json()) as TrackResult;
  } catch {
    return { ok: false, error: "Hệ thống tra cứu đang bận, vui lòng thử lại sau ít phút." };
  }
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; phone1?: string; phone2?: string }>;
}) {
  const { code, phone1, phone2 } = await searchParams;
  const trimmed = (code || "").trim();
  const internal = trimmed ? isInternalCode(trimmed) : false;
  const external = trimmed && !internal ? trimmed : null;
  
  // Để hiện tracking detail (mã MT), cần xác minh 2 chữ số cuối sdt người nhận
  const phoneProvided = phone1 && phone2;
  const phoneDigits = phoneProvided ? (phone1 + phone2).slice(-2) : "";
  const phoneVerified = /^\d{2}$/.test(phoneDigits);

  // Chỉ gọi API khi: (mã MT + xác minh sdt) HOẶC (mã hãng ngoài)
  const result = trimmed && ((internal && phoneVerified) || external) ? await lookup(trimmed) : null;
  const order = result?.ok ? result.order : undefined;
  const events = result?.ok ? (result.events ?? []) : [];

  const carrier = external ? detectCarrier(external) : null;
  const universalUrl = external
    ? `https://t.17track.net/en#nums=${encodeURIComponent(external)}`
    : "";

  return (
    <>
      <PageHero
        title="Tra cứu đơn hàng"
        subtitle="Nhập mã đơn Minh Thiện gửi bạn để xem hành trình và trạng thái đơn hàng."
        crumbs={[{ name: "Tra cứu đơn", href: "/tra-cuu" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <form action="/tra-cuu" method="get" className="space-y-3">
          <input
            name="code"
            defaultValue={code || ""}
            placeholder="Nhập mã đơn Minh Thiện (MT-…) hoặc mã vận đơn hãng (1Z…)"
            className="w-full rounded-xl border border-slate-200 px-4 py-3.5 font-medium uppercase outline-none focus:border-brand-500"
          />
          
          {/* Phone verification cho mã MT */}
          {trimmed && internal && (
            <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
              <label className="block text-sm font-semibold text-ink mb-3">Nhập 2 chữ số cuối số điện thoại người nhận để tra cứu</label>
              <div className="flex gap-2">
                <input
                  name="phone1"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="X"
                  defaultValue={phone1 || ""}
                  className="w-12 rounded-lg border border-slate-200 px-2 py-2 text-center font-bold text-lg outline-none focus:border-brand-500"
                />
                <input
                  name="phone2"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="X"
                  defaultValue={phone2 || ""}
                  className="w-12 rounded-lg border border-slate-200 px-2 py-2 text-center font-bold text-lg outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-50"
              disabled={internal && !phoneVerified}
            >
              <Search className="h-5 w-5" /> Tra cứu
            </button>
          </div>
        </form>

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
              <p className="text-sm text-ink-soft mb-4">
                Đây là mã vận đơn của hãng vận chuyển. Bạn có thể:
              </p>
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

        {code && result && !result.ok && (
          <div className="mt-8 rounded-2xl border border-coral-100 bg-coral-50 p-6 text-center text-coral-700">
            {result.error || (
              <>Không tìm thấy đơn hàng với mã <strong>{code}</strong>. Vui lòng kiểm tra lại hoặc gọi hotline.</>
            )}
          </div>
        )}

        {code && trimmed && internal && !phoneVerified && (
          <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center text-amber-700">
            Vui lòng nhập 2 chữ số cuối số điện thoại người nhận để xem tracking.
          </div>
        )}

        {order && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-brand-50 px-6 py-5">
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
              <Info label="Điểm đến" value={order.destination} />
              <Info
                label="Ngày tiếp nhận"
                value={new Date(order.createdAt).toLocaleDateString("vi-VN")}
              />
            </div>

            <div className="border-t border-brand-50 px-6 py-6">
              <h3 className="mb-4 font-black text-ink">Hành trình đơn hàng</h3>
              {events.length === 0 ? (
                <p className="text-ink-soft">
                  Đơn đang ở trạng thái: <strong className="text-ink">{order.status}</strong>.
                  Hành trình chi tiết sẽ hiển thị khi kiện hàng bắt đầu di chuyển.
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
                        <span>{e.date}</span>
                      </div>
                      {e.note && <p className="mt-1 text-sm text-ink-soft">{e.note}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-ink-muted">{label}</div>
      <div className="font-semibold text-ink">{value}</div>
    </div>
  );
}
