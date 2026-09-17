"use client";

import { useState } from "react";

/** Một lượt bấm "Tính ước tính": thời điểm (ms) + mã phiên để đếm số người. */
export type QuoteHit = { t: number; s: string };

const TZ = "Asia/Ho_Chi_Minh";
const THU = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/** Ngày (YYYY-MM-DD) và giờ theo giờ Việt Nam, không phụ thuộc múi giờ máy xem. */
function vn(t: number) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(t))
      .map((x) => [x.type, x.value]),
  );
  return { day: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}

const nhan = (day: string) => `${day.slice(8)}/${day.slice(5, 7)}`;
const thu = (day: string) => THU[new Date(`${day}T12:00:00Z`).getUTCDay()];

type Hit = QuoteHit & { day: string; hour: number };

function dem(hits: Hit[], key: (h: Hit) => string | number, keys: (string | number)[]) {
  const luot = keys.map(() => 0);
  const nguoi = keys.map(() => new Set<string>());
  for (const h of hits) {
    const i = keys.indexOf(key(h));
    if (i < 0) continue;
    luot[i]++;
    nguoi[i].add(h.s);
  }
  return { luot, nguoi: nguoi.map((x) => x.size) };
}

function tranCot(m: number) {
  return [5, 10, 15, 20, 30, 40, 50, 60, 80, 100].find((s) => s >= m) ?? Math.ceil(m / 50) * 50;
}

function CotChart({
  labels,
  sub,
  values,
  other,
  units,
  every = 1,
  width = 720,
  height = 220,
}: {
  labels: string[];
  sub?: string[];
  values: number[];
  other: number[];
  units: [string, string];
  every?: number;
  width?: number;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = width;
  const H = height;
  const padL = 30;
  const padR = 6;
  const padT = 20;
  const padB = sub ? 38 : 24;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const slot = iw / values.length;
  const bw = Math.max(4, Math.min(34, slot * 0.66));
  const max = tranCot(Math.max(1, ...values));
  const top = Math.max(...values);
  const y = (v: number) => padT + ih - (v / max) * ih;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" onMouseLeave={() => setHover(null)}>
        {[0, 1, 2, 3, 4].map((i) => {
          const v = (max * i) / 4;
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#E9F0EF" />
              <text x={padL - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#7D9390">
                {Math.round(v)}
              </text>
            </g>
          );
        })}
        {values.map((v, i) => {
          const cx = padL + slot * i + slot / 2;
          const x = cx - bw / 2;
          const yy = y(v);
          const r = Math.min(4, bw / 2, padT + ih - yy);
          return (
            <g key={i}>
              {v > 0 && (
                <path
                  d={`M${x},${padT + ih}V${yy + r}Q${x},${yy} ${x + r},${yy}H${x + bw - r}Q${x + bw},${yy} ${x + bw},${yy + r}V${padT + ih}Z`}
                  fill={v === top ? "#0A6B5F" : hover === i ? "#12A08E" : "#1FB6A2"}
                />
              )}
              {v > 0 && (slot >= 14 || v === top) && (
                <text x={cx} y={yy - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#4A6461">
                  {v}
                </text>
              )}
              {i % every === 0 && (
                <text x={cx} y={padT + ih + 15} textAnchor="middle" fontSize={11} fill="#7D9390">
                  {labels[i]}
                </text>
              )}
              {sub && i % every === 0 && (
                <text x={cx} y={padT + ih + 29} textAnchor="middle" fontSize={11} fill="#7D9390">
                  {sub[i]}
                </text>
              )}
              <rect
                x={padL + slot * i}
                y={padT}
                width={slot}
                height={ih + padB}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onClick={() => setHover(i)}
              />
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs text-white"
          style={{
            left: `${Math.min(Math.max(((padL + slot * hover + slot / 2) / W) * 100, 12), 88)}%`,
            top: `${(Math.min(y(values[hover]), padT + ih - 4) / H) * 100}%`,
            marginTop: -6,
          }}
        >
          <b>
            {labels[hover]}
            {sub ? ` · ${sub[hover]}` : ""}
          </b>
          <br />
          {values[hover]} {units[0]} · {other[hover]} {units[1]}
        </div>
      )}
    </div>
  );
}

function Chon({ value, onChange }: { value: "luot" | "nguoi"; onChange: (v: "luot" | "nguoi") => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-brand-100 text-sm">
      {(["luot", "nguoi"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          aria-pressed={value === k}
          className={`px-3 py-1.5 ${value === k ? "bg-brand-50 font-bold text-ink" : "text-ink-soft"}`}
        >
          {k === "luot" ? "Lượt bấm" : "Số người"}
        </button>
      ))}
    </div>
  );
}

const Khung = ({ children }: { children: React.ReactNode }) => (
  <section className="rounded-3xl border border-brand-50 bg-white p-5 shadow-sm">{children}</section>
);

export function QuoteCharts({ hits, now, soNgay }: { hits: QuoteHit[]; now: number; soNgay: number }) {
  const [modeNgay, setModeNgay] = useState<"luot" | "nguoi">("luot");
  const [modeGio, setModeGio] = useState<"luot" | "nguoi">("luot");

  const ds: Hit[] = hits.map((h) => ({ ...h, ...vn(h.t) }));
  const homNay = vn(now).day;
  const ngayTruoc = (n: number) => vn(now - n * 86400000).day;
  const ngays = Array.from({ length: soNgay }, (_, i) => ngayTruoc(soNgay - 1 - i));
  const gios = Array.from({ length: 24 }, (_, i) => i);
  const nhanGio = gios.map((h) => `${h}h`);

  const tongNgay = (day: string) => {
    const x = ds.filter((h) => h.day === day);
    return { luot: x.length, nguoi: new Set(x.map((h) => h.s)).size };
  };

  const theoNgay = dem(ds, (h) => h.day, ngays);
  const theoGio = dem(ds.filter((h) => ngays.includes(h.day)), (h) => h.hour, gios);
  const gioCua = (day: string) =>
    dem(
      ds.filter((h) => h.day === day),
      (h) => h.hour,
      gios,
    );

  const homQua = ngayTruoc(1);
  const homKia = ngayTruoc(2);
  const o = [
    { ten: "Hôm qua", day: homQua },
    { ten: "Hôm kia", day: homKia },
    { ten: "Hôm nay", day: homNay },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {o.map(({ ten, day }) => {
          const t = tongNgay(day);
          return (
            <div key={ten} className="rounded-2xl border border-brand-50 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-ink-soft">
                {ten} · {thu(day)} {nhan(day)}
              </div>
              <div className="mt-1 text-3xl font-black text-ink">
                {t.luot}
                <span className="ml-1.5 text-sm font-semibold text-ink-muted">lượt</span>
              </div>
              <div className="text-xs text-ink-muted">{t.nguoi} người khác nhau</div>
            </div>
          );
        })}
      </div>

      <Khung>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-ink">Theo ngày ({soNgay} ngày gần nhất)</h2>
            <p className="text-xs text-ink-muted">Cột cao nhất tô đậm. Rê chuột / chạm vào cột để xem chi tiết.</p>
          </div>
          <Chon value={modeNgay} onChange={setModeNgay} />
        </div>
        <CotChart
          labels={ngays.map(nhan)}
          sub={ngays.map(thu)}
          values={modeNgay === "luot" ? theoNgay.luot : theoNgay.nguoi}
          other={modeNgay === "luot" ? theoNgay.nguoi : theoNgay.luot}
          units={modeNgay === "luot" ? ["lượt", "người"] : ["người", "lượt"]}
        />
        <p className="mt-1 text-xs text-ink-muted">
          Một người bấm nhiều lần liền (đổi cân nặng thử) vẫn là 1 người — xem &ldquo;Số người&rdquo; sát thực tế hơn.
        </p>
      </Khung>

      <Khung>
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-ink">Theo giờ trong ngày — gộp {soNgay} ngày</h2>
            <p className="text-xs text-ink-muted">
              Từ {nhan(ngays[0])} đến {nhan(homNay)}, giờ Việt Nam.
            </p>
          </div>
          <Chon value={modeGio} onChange={setModeGio} />
        </div>
        <CotChart
          labels={nhanGio}
          values={modeGio === "luot" ? theoGio.luot : theoGio.nguoi}
          other={modeGio === "luot" ? theoGio.nguoi : theoGio.luot}
          units={modeGio === "luot" ? ["lượt", "người"] : ["người", "lượt"]}
          every={2}
        />
      </Khung>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          { ten: "Hôm kia", day: homKia },
          { ten: "Hôm qua", day: homQua },
        ].map(({ ten, day }) => {
          const g = gioCua(day);
          return (
            <Khung key={ten}>
              <h2 className="mb-2 text-lg font-black text-ink">
                {ten} {nhan(day)} theo giờ
              </h2>
              <CotChart labels={nhanGio} values={g.luot} other={g.nguoi} units={["lượt", "người"]} every={3} width={420} height={210} />
            </Khung>
          );
        })}
      </div>
    </div>
  );
}
