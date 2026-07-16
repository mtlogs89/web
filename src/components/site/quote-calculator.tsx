"use client";

import { useState } from "react";
import Link from "next/link";
import { Bolt, ArrowRight, Calculator, Phone } from "lucide-react";
import { destinations, cargoTypes, estimate, vnd, type EstimateResult } from "@/lib/pricing";
import { site } from "@/lib/site";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-medium outline-none focus:border-brand-500";

export function QuoteCalculator({ defaultDestKey }: { defaultDestKey?: string } = {}) {
  const initialDest = destinations.some((d) => d.key === defaultDestKey)
    ? (defaultDestKey as string)
    : destinations[0].key;
  const [destKey, setDestKey] = useState(initialDest);
  const [weight, setWeight] = useState("5");
  const [cargoKey, setCargoKey] = useState(cargoTypes[0].key);
  const [showDims, setShowDims] = useState(false);
  const [dims, setDims] = useState({ l: "", w: "", h: "" });
  const [result, setResult] = useState<EstimateResult | null>(null);

  function calc() {
    setResult(
      estimate({
        destKey,
        weightKg: Number(weight),
        cargoKey,
        dims: showDims
          ? { l: Number(dims.l) || 0, w: Number(dims.w) || 0, h: Number(dims.h) || 0 }
          : undefined,
      })
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 font-semibold text-brand-600">
        <Bolt className="h-5 w-5" /> Báo giá nhanh
      </div>
      <h2 className="mt-1 text-xl font-bold text-ink">Ước tính chi phí vận chuyển</h2>

      <div className="mt-5 space-y-4">
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
              <span>Thời gian: {result.transit[0]}–{result.transit[1]} ngày</span>
              {result.baoThue && <span className="text-brand-600">· Đã bao thuế nhập khẩu</span>}
            </div>
            {result.surchargeApplied > 0 && (
              <div className="mt-0.5 text-xs text-ink-muted">Đã gồm phụ thu loại hàng: {vnd(result.surchargeApplied)}</div>
            )}
            {result.note && <div className="mt-0.5 text-xs text-ink-muted">{result.note}</div>}
            <p className="mt-2 text-xs text-ink-muted">
              * Giá tham khảo, có thể thay đổi theo thời gian và quy cách hàng. Liên hệ để chốt giá chính xác.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`tel:${site.phone}`}
                className="flex items-center gap-1.5 rounded-xl bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
              >
                <Phone className="h-4 w-4" /> Gọi chốt giá
              </a>
              <Link
                href="/lien-he"
                className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-white"
              >
                Gửi yêu cầu
              </Link>
            </div>
          </div>
        )}

        {result?.mode === "contact" && (
          <div className="rounded-2xl border border-coral-100 bg-coral-50 p-4">
            <div className="font-semibold text-ink">{result.destLabel}</div>
            <p className="mt-1 text-sm text-ink-soft">{result.reason}</p>
            <a
              href={`tel:${site.phone}`}
              className="mt-3 flex w-fit items-center gap-1.5 rounded-xl bg-coral-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-coral-600"
            >
              <Phone className="h-4 w-4" /> Gọi {site.phoneDisplay}
            </a>
          </div>
        )}

        {!result && (
          <p className="text-center text-sm text-ink-soft">
            Hoặc gọi ngay{" "}
            <a href={`tel:${site.phone}`} className="font-bold text-brand-600">
              {site.phoneDisplay}
            </a>{" "}
            ({site.contactName})
          </p>
        )}
      </div>
    </div>
  );
}
