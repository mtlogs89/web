import { prisma } from "@/lib/prisma";
import { Calculator, Users, Phone, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

function vnd(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function ngayGio(d: Date) {
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Gom cân nặng thành nhóm để thấy khách hay gửi cỡ nào. */
function nhomCan(kg: number) {
  if (kg <= 1) return "≤ 1kg";
  if (kg <= 5) return "1–5kg";
  if (kg <= 10) return "5–10kg";
  if (kg <= 20) return "10–20kg";
  return "> 20kg";
}

const CAN_ORDER = ["≤ 1kg", "1–5kg", "5–10kg", "10–20kg", "> 20kg"];

function Thanh({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 truncate text-sm font-medium text-ink-soft">{label}</span>
      <div className="h-6 flex-1 overflow-hidden rounded-lg bg-brand-50">
        <div
          className="h-full rounded-lg bg-brand-500 transition-all"
          style={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

function The({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Calculator;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
        <Icon className="h-4 w-4 text-brand-500" /> {label}
      </div>
      <div className="mt-2 text-3xl font-black text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
}

export default async function TinhCuocPage() {
  const now = new Date();
  const homNay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const bayNgay = new Date(homNay.getTime() - 6 * 86400000);

  const [tong, soHomNay, so7Ngay, rows, moiNhat] = await Promise.all([
    prisma.quoteLog.count(),
    prisma.quoteLog.count({ where: { createdAt: { gte: homNay } } }),
    prisma.quoteLog.count({ where: { createdAt: { gte: bayNgay } } }),
    prisma.quoteLog.findMany({
      where: { createdAt: { gte: bayNgay } },
      select: { destLabel: true, weight: true, cargo: true, mode: true, sessionId: true },
    }),
    prisma.quoteLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  // Số người khác nhau trong 7 ngày (lượt không có sessionId tính là một người riêng).
  const soNguoi = new Set(rows.map((r, i) => r.sessionId ?? `khach-${i}`)).size;
  const soPhaiGoi = rows.filter((r) => r.mode === "contact").length;

  const theoTuyen = new Map<string, number>();
  const theoCan = new Map<string, number>();
  const theoHang = new Map<string, number>();
  for (const r of rows) {
    theoTuyen.set(r.destLabel, (theoTuyen.get(r.destLabel) ?? 0) + 1);
    const n = nhomCan(r.weight);
    theoCan.set(n, (theoCan.get(n) ?? 0) + 1);
    theoHang.set(r.cargo, (theoHang.get(r.cargo) ?? 0) + 1);
  }
  const sapXep = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]);
  const maxTuyen = Math.max(1, ...theoTuyen.values());
  const maxCan = Math.max(1, ...theoCan.values());
  const maxHang = Math.max(1, ...theoHang.values());

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Lượt tính cước</h1>
        <p className="mt-1 text-ink-muted">
          Mỗi lần khách bấm nút <span className="font-semibold">&ldquo;Tính ước tính&rdquo;</span> trên
          công cụ báo giá đều được ghi lại ở đây — biết khách quan tâm tuyến nào, cân nặng bao nhiêu.
        </p>
      </div>

      {tong === 0 ? (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/40 p-10 text-center">
          <Calculator className="mx-auto h-10 w-10 text-brand-400" />
          <p className="mt-3 font-bold text-ink">Chưa có lượt nào</p>
          <p className="mt-1 text-sm text-ink-muted">
            Số liệu chỉ tính từ lúc bật tính năng này trở đi, không có dữ liệu cũ.
            Thử tự bấm nút tính cước ngoài web rồi tải lại trang này để kiểm tra.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <The icon={Calculator} label="Tổng từ trước tới nay" value={tong} />
            <The icon={TrendingUp} label="Hôm nay" value={soHomNay} />
            <The icon={Calculator} label="7 ngày qua" value={so7Ngay} />
            <The
              icon={Users}
              label="Số người (7 ngày)"
              value={soNguoi}
              hint={so7Ngay > 0 ? `trung bình ${(so7Ngay / Math.max(soNguoi, 1)).toFixed(1)} lượt/người` : undefined}
            />
          </div>

          {soPhaiGoi > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-sun-200 bg-sun-50/60 p-4">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-sun-500" />
              <p className="text-sm text-ink-soft">
                <span className="font-bold text-ink">{soPhaiGoi} lượt</span> trong 7 ngày rơi vào
                trường hợp máy tính không ra giá (tuyến hoặc cân nặng ngoài bảng giá) nên khách được
                mời gọi điện. Nếu con số này cao, nên bổ sung bảng giá cho các tuyến đó.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-ink">Tuyến khách hỏi (7 ngày)</h2>
              <div className="space-y-2.5">
                {sapXep(theoTuyen).map(([k, v]) => (
                  <Thanh key={k} label={k} value={v} max={maxTuyen} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-ink">Cân nặng khách nhập (7 ngày)</h2>
              <div className="space-y-2.5">
                {CAN_ORDER.filter((k) => theoCan.has(k)).map((k) => (
                  <Thanh key={k} label={k} value={theoCan.get(k) ?? 0} max={maxCan} />
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-lg font-black text-ink">Loại hàng (7 ngày)</h2>
              <div className="space-y-2.5">
                {sapXep(theoHang).map(([k, v]) => (
                  <Thanh key={k} label={k} value={v} max={maxHang} />
                ))}
              </div>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-3xl border border-brand-50 bg-white shadow-sm">
            <h2 className="border-b border-brand-50 px-6 py-4 text-lg font-black text-ink">
              50 lượt gần nhất
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-brand-50/50 text-left text-xs font-bold uppercase text-ink-soft">
                  <tr>
                    <th className="px-6 py-3">Lúc</th>
                    <th className="px-4 py-3">Tuyến</th>
                    <th className="px-4 py-3">Cân</th>
                    <th className="px-4 py-3">Loại hàng</th>
                    <th className="px-4 py-3">Ước tính</th>
                    <th className="px-4 py-3">Từ trang</th>
                  </tr>
                </thead>
                <tbody>
                  {moiNhat.map((r) => (
                    <tr key={r.id} className="border-t border-brand-50/70">
                      <td className="whitespace-nowrap px-6 py-3 text-ink-muted">
                        {ngayGio(r.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{r.destLabel}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {r.weight}kg
                        {r.dims && <span className="text-ink-muted"> · {r.dims}</span>}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{r.cargo}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {r.mode === "price" && r.priceTotal ? (
                          <span className="font-bold text-brand-600">{vnd(r.priceTotal)}</span>
                        ) : (
                          <span className="text-sun-500">phải gọi hỏi</span>
                        )}
                      </td>
                      <td className="max-w-48 truncate px-4 py-3 text-xs text-ink-muted">
                        {r.page}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
