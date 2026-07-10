import type { Metadata } from "next";
import { Search, PackageCheck, MapPin, CircleDot } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Tra cứu hành trình đơn hàng vận chuyển quốc tế tại Minh Thiện Logistics bằng mã vận đơn.",
};

export const dynamic = "force-dynamic";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const order = code
    ? await prisma.order.findUnique({
        where: { trackingCode: code.trim().toUpperCase() },
        include: { events: { orderBy: { at: "desc" } } },
      })
    : null;

  return (
    <>
      <PageHero
        title="Tra cứu đơn hàng"
        subtitle="Nhập mã vận đơn để xem hành trình và trạng thái đơn hàng của bạn."
        crumbs={[{ name: "Tra cứu đơn", href: "/tra-cuu" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <form action="/tra-cuu" method="get" className="flex flex-col gap-3 sm:flex-row">
          <input
            name="code"
            defaultValue={code || ""}
            placeholder="Nhập mã vận đơn (VD: MT2026DEMO01)"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3.5 font-medium uppercase outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
          >
            <Search className="h-5 w-5" /> Tra cứu
          </button>
        </form>

        {code && !order && (
          <div className="mt-8 rounded-2xl border border-coral-100 bg-coral-50 p-6 text-center text-coral-700">
            Không tìm thấy đơn hàng với mã <strong>{code}</strong>. Vui lòng kiểm tra lại hoặc gọi hotline.
          </div>
        )}

        {order && (
          <div className="mt-8 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-brand-50 px-6 py-5">
              <div>
                <div className="text-sm text-ink-muted">Mã vận đơn</div>
                <div className="text-xl font-black text-brand-700">{order.trackingCode}</div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                <PackageCheck className="h-4 w-4" /> {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
              <Info label="Người gửi" value={order.senderName} />
              <Info label="Người nhận" value={order.receiverName} />
              <Info label="Tuyến" value={`${order.origin} → ${order.destination}`} />
              <Info label="Khối lượng" value={order.weight ? `${order.weight} kg` : "—"} />
            </div>

            <div className="border-t border-brand-50 px-6 py-6">
              <h3 className="mb-4 font-black text-ink">Hành trình đơn hàng</h3>
              <ol className="relative ml-3 border-l-2 border-brand-100">
                {order.events.map((e, i) => (
                  <li key={e.id} className="mb-6 ml-6 last:mb-0">
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
                      <span>{new Date(e.at).toLocaleString("vi-VN")}</span>
                    </div>
                    {e.note && <p className="mt-1 text-sm text-ink-soft">{e.note}</p>}
                  </li>
                ))}
              </ol>
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
