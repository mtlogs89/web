"use client";

import { useActionState, useState } from "react";
import {
  Upload,
  Check,
  AlertTriangle,
  RotateCcw,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import {
  previewPriceFile,
  savePriceTable,
  resetPriceTable,
  type PricePreviewState,
  type FormState,
} from "../../actions";
import { STEP_KG } from "@/lib/pricing";
import type { PriceOverride } from "@/lib/price-tables";

type DestLite = {
  key: string;
  label: string;
  basePrices: number[];
  baseOver20: number | null;
  override: PriceOverride | null;
};

const vnd = (n: number) => n.toLocaleString("vi-VN") + "đ";

function ngay(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function PriceTableForm({ dests }: { dests: DestLite[] }) {
  const [destKey, setDestKey] = useState(dests[0]?.key ?? "");
  const [preview, previewAction, previewing] = useActionState<PricePreviewState, FormData>(
    previewPriceFile,
    null,
  );
  const [saveState, saveAction, saving] = useActionState<FormState, FormData>(
    savePriceTable,
    null,
  );

  const dest = dests.find((d) => d.key === destKey);
  // Giá web đang dùng: bảng đã up nếu có, không thì bảng gốc trong code.
  const dangDung = dest?.override?.prices ?? dest?.basePrices ?? [];
  const over20DangDung = dest?.override ? dest.override.over20PerKg : (dest?.baseOver20 ?? null);

  // Chỉ hiện bảng so sánh khi file vừa đọc đúng là của tuyến đang chọn.
  const p = preview?.ok && preview.destKey === destKey ? preview : null;
  const steps = p?.result.steps ?? null;
  const duLieuDu = steps != null && steps.every((v) => v != null);

  return (
    <div className="space-y-6">
      {/* Chọn tuyến */}
      <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <label className="text-sm font-semibold text-ink-soft">Tuyến cần cập nhật giá</label>
        <select
          value={destKey}
          onChange={(e) => setDestKey(e.target.value)}
          className="mt-1.5 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-medium outline-none focus:border-brand-500"
        >
          {dests.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
              {d.override ? "  — đã up file" : "  — đang dùng giá gốc"}
            </option>
          ))}
        </select>

        {dest?.override && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50/60 px-4 py-3">
            <p className="text-sm text-ink-soft">
              Đang dùng file <span className="font-bold text-ink">{dest.override.fileName}</span>, up
              ngày {ngay(dest.override.updatedAt)}.
            </p>
            <form action={resetPriceTable}>
              <input type="hidden" name="destKey" value={dest.key} />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-coral-300 hover:text-coral-600"
              >
                <RotateCcw className="h-4 w-4" /> Quay lại giá gốc
              </button>
            </form>
          </div>
        )}
      </section>

      {/* Chọn file */}
      <section className="rounded-3xl border border-brand-50 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-ink">Chọn file bảng giá</h2>
        <p className="mt-1 text-sm text-ink-muted">
          File Excel (.xlsx) hoặc CSV. Cần một cột số ký (0,5 · 1 · 1,5 … 20) và một cột giá tiền.
          Có cột thừa cũng không sao, máy tự tìm. Nếu file có nhiều cột giá, máy lấy{" "}
          <span className="font-semibold">cột giá đầu tiên</span>.
        </p>

        <form action={previewAction} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="destKey" value={destKey} />
          <input
            type="file"
            name="file"
            accept=".xlsx,.xls,.csv"
            required
            className="max-w-sm text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          <button
            type="submit"
            disabled={previewing}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-bold text-white transition hover:bg-ink/90 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {previewing ? "Đang đọc…" : "Đọc file"}
          </button>
        </form>

        {preview && !preview.ok && (
          <p className="mt-3 flex items-center gap-2 font-semibold text-coral-500">
            <AlertTriangle className="h-4 w-4" /> {preview.message}
          </p>
        )}
      </section>

      {/* Xem trước */}
      {p && steps && (
        <section className="rounded-3xl border-2 border-sun-300 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-sun-500" />
            <h2 className="text-lg font-black text-ink">
              Xem trước — {dest?.label}
            </h2>
            <span className="rounded-full bg-sun-100 px-3 py-1 text-xs font-bold text-sun-700">
              chưa lưu
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Đọc từ <span className="font-semibold">{p.fileName}</span> — {p.result.rows.length} mốc giá.
            Đối chiếu xong thì bấm lưu bên dưới.
          </p>

          {p.result.warnings.length > 0 && (
            <div className="mt-4 space-y-1.5 rounded-2xl border border-sun-200 bg-sun-50/70 p-4">
              {p.result.warnings.map((w, i) => (
                <p key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" /> {w}
                </p>
              ))}
            </div>
          )}

          <div className="mt-5 max-h-96 overflow-y-auto rounded-2xl border border-brand-50">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-brand-50/90 text-left text-xs font-bold uppercase text-ink-soft backdrop-blur">
                <tr>
                  <th className="px-4 py-2.5">Ký</th>
                  <th className="px-4 py-2.5">Giá đang dùng</th>
                  <th className="px-4 py-2.5">Giá trong file</th>
                  <th className="px-4 py-2.5">Chênh</th>
                </tr>
              </thead>
              <tbody>
                {STEP_KG.map((kg, i) => {
                  const cu = dangDung[i];
                  const moi = steps[i];
                  const doi = moi != null && cu != null && moi !== cu;
                  return (
                    <tr
                      key={kg}
                      className={`border-t border-brand-50/70 ${moi == null ? "bg-coral-50/50" : doi ? "bg-sun-50/40" : ""}`}
                    >
                      <td className="px-4 py-2 font-medium text-ink">{kg}kg</td>
                      <td className="px-4 py-2 text-ink-muted">{cu != null ? vnd(cu) : "—"}</td>
                      <td className="px-4 py-2 font-bold text-ink">
                        {moi != null ? vnd(moi) : <span className="text-coral-500">thiếu trong file</span>}
                      </td>
                      <td className="px-4 py-2">
                        {moi != null && cu != null && (
                          <span className={moi > cu ? "text-brand-600" : moi < cu ? "text-coral-500" : "text-ink-muted"}>
                            {moi === cu ? "giữ nguyên" : (moi > cu ? "+" : "") + vnd(moi - cu)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <form action={saveAction} className="mt-5 space-y-4">
            <input type="hidden" name="destKey" value={destKey} />
            <input type="hidden" name="fileName" value={p.fileName} />
            <input type="hidden" name="prices" value={JSON.stringify(steps)} />

            <div>
              <label className="text-sm font-semibold text-ink-soft">
                Giá hàng trên 20kg (đồng mỗi ký)
              </label>
              <p className="text-xs text-ink-muted">
                Để trống thì khách gửi trên 20kg sẽ được mời gọi hỏi thay vì thấy giá.
              </p>
              <input
                name="over20PerKg"
                defaultValue={p.result.suggestedOver20PerKg ?? over20DangDung ?? ""}
                placeholder="ví dụ 238000"
                className="mt-1.5 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2.5 font-medium outline-none focus:border-brand-500"
              />
            </div>

            {!duLieuDu && (
              <p className="flex items-center gap-2 font-semibold text-coral-500">
                <AlertTriangle className="h-4 w-4" /> File thiếu mốc cân nên chưa lưu được. Bổ sung
                đủ 40 mốc từ 0,5kg đến 20kg rồi up lại.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving || !duLieuDu}
                className="flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-bold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-50"
              >
                <ArrowRight className="h-5 w-5" />
                {saving ? "Đang lưu…" : "Áp bảng giá này cho web"}
              </button>
              {saveState?.ok && (
                <span className="flex items-center gap-1.5 font-semibold text-brand-600">
                  <Check className="h-5 w-5" /> {saveState.message}
                </span>
              )}
              {saveState && !saveState.ok && (
                <span className="font-semibold text-coral-500">{saveState.message}</span>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
