"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Station = { title: string; text: string; pose: string };

const STATIONS: Station[] = [
  { title: "Bạn mang hàng tới", text: "Minh Thiện nhận TẤT CẢ loại hàng từ dễ tới khó: thuốc tây, thịt – trứng – sữa, hàng pin, đông lạnh, yến sào… Mất hàng đền 100%.", pose: "/images/mascot/pose-1-cam-hang.png" },
  { title: "Liệt kê & kiểm hàng", text: "Kiểm đếm, phân loại từng món. Yến sào nếu mất đền 30 triệu/kg; thuốc tây tỷ lệ thông quan 99.99%.", pose: "/images/mascot/pose-2-liet-ke.png" },
  { title: "Đóng gói chuẩn quốc tế", text: "Hàng được bọc lót, đóng thùng chắc chắn, chống va đập và đúng quy cách hải quan Mỹ.", pose: "/images/mascot/pose-3-dong-goi.png" },
  { title: "Tư vấn bảo hiểm", text: "Tư vấn mua bảo hiểm theo giá trị hàng hóa — an tâm tuyệt đối, đền bù nếu có sự cố.", pose: "/images/mascot/pose-7.png" },
  { title: "Hàng bay đi Mỹ", text: "Làm thủ tục thông quan lô hàng đi Mỹ. Bay nhanh 3 ngày, bay chậm 8 ngày. Theo dõi đơn 24/7, đội ngũ chăm sóc tận tâm.", pose: "/images/mascot/pose-5-van-chuyen.png" },
  { title: "Giao tận tay 🎉", text: "Giao đến tận địa chỉ người nhận trên toàn nước Mỹ. Hành trình hoàn tất!", pose: "/images/mascot/pose-6-giao-hang.png" },
];

const VBW = 1000;
const TOP = 200;
const STEP = 420;
const TOTAL = TOP + STATIONS.length * STEP + 60;

function buildNodes(mobile: boolean) {
  // luôn đi cong (so le trái/phải); mobile biên độ rộng hơn để chừa làn cho mascot
  return STATIONS.map((_, i) => ({
    x: i % 2 === 0 ? (mobile ? 110 : 280) : mobile ? 890 : 720,
    y: TOP + i * STEP + STEP / 2,
  }));
}
function buildPath(nodes: { x: number; y: number }[]) {
  let d = `M ${nodes[0].x} 20 L ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1], b = nodes[i];
    const my = (a.y + b.y) / 2;
    d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  d += ` L ${nodes[nodes.length - 1].x} ${TOTAL - 20}`;
  return d;
}

export function ServiceJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [mobile, setMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [mascot, setMascot] = useState({ x: 15, y: TOP + STEP / 2 });
  const reduce = useRef(false);

  const nodes = useMemo(() => buildNodes(mobile), [mobile]);
  const pathD = useMemo(() => buildPath(nodes), [nodes]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.5 - rect.top) / (el.offsetHeight - vh * 0.4)));
      setProgress(p);
      setActive(Math.min(STATIONS.length - 1, Math.floor(p * STATIONS.length + 0.001)));
      const path = pathRef.current;
      if (path) {
        const len = path.getTotalLength();
        const pt = path.getPointAtLength((reduce.current ? 0 : p) * len);
        setMascot({ x: (pt.x / VBW) * 100, y: pt.y });
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathD]);

  return (
    <section className="bg-brand-50/40 py-12">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-coral-500">Hành trình kiện hàng của bạn</span>
        <h2 className="mt-2 text-3xl font-black text-ink md:text-4xl">Từ tay bạn đến nước Mỹ</h2>
        <p className="mt-3 text-ink-soft">Cuộn xuống để đi cùng kiện hàng qua từng bước của Minh Thiện 👇</p>
      </div>

      <div ref={wrapRef} className="relative mx-auto mt-8 max-w-5xl px-4" style={{ height: TOTAL }}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${VBW} ${TOTAL}`} preserveAspectRatio="none" aria-hidden>
          <path d={pathD} fill="none" stroke="#c9f0ea" strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeDasharray="2 14" />
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#1FB6A2"
            strokeWidth={4}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress }}
          />
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={9} vectorEffect="non-scaling-stroke"
              fill={i <= active ? "#1FB6A2" : "#fff"} stroke="#1FB6A2" strokeWidth={3} />
          ))}
        </svg>

        {STATIONS.map((s, i) => {
          const onLeft = i % 2 !== 0;
          const shown = i <= active;
          const w = mobile ? "47%" : "44%";
          const pos: React.CSSProperties = onLeft
            ? { left: "3%", width: w, top: nodes[i].y - (mobile ? 64 : 70) }
            : { right: "3%", width: w, top: nodes[i].y - (mobile ? 64 : 70) };
          return (
            <div
              key={i}
              className="absolute"
              style={{
                ...pos,
                opacity: shown ? 1 : 0.35,
                transform: shown ? "translateY(0)" : "translateY(16px)",
                transition: "opacity .5s, transform .5s",
              }}
            >
              <div className="rounded-3xl border border-brand-50 bg-white p-5 shadow-lg shadow-brand-500/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="font-bold text-ink">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
              </div>
            </div>
          );
        })}

        <img
          src={STATIONS[active].pose}
          alt="Mascot Minh Thiện"
          className="pointer-events-none absolute z-20 w-14 drop-shadow-xl transition-[top] duration-150 ease-linear sm:w-24"
          style={{ top: mascot.y, left: `${mascot.x}%`, transform: "translate(-50%, -62%)" }}
        />
      </div>
    </section>
  );
}
