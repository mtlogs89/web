import ExcelJS from "exceljs";
import { prisma } from "./prisma";
import { destinations, STEP_KG, type Destination } from "./pricing";

/**
 * Bảng giá tự nạp từ file Excel (trang /admin/bang-gia).
 *
 * Giá gốc nằm cứng trong lib/pricing.ts. Bảng nào user đã up file thì lấy theo
 * file, còn lại vẫn dùng giá cứng — nên chưa up gì thì web chạy y như cũ.
 */

const KEY = (destKey: string) => `price_${destKey}`;

export type PriceOverride = {
  /** 40 mốc 0,5 → 20kg, tổng tiền mỗi mốc. */
  prices: number[];
  /** Đơn giá mỗi kg khi trên 20kg. null = báo khách liên hệ. */
  over20PerKg: number | null;
  fileName: string;
  updatedAt: string;
};

export type ParsedRow = { kg: number; price: number };

export type ParseResult = {
  rows: ParsedRow[];
  /** 40 phần tử khớp STEP_KG; null = file không có mốc đó. */
  steps: (number | null)[];
  missing: number[];
  /** Dòng có cân > 20kg — dùng để đoán đơn giá trên 20kg. */
  over20Rows: ParsedRow[];
  suggestedOver20PerKg: number | null;
  warnings: string[];
};

/** Bỏ dấu chấm/phẩy phân cách rồi đổi sang số. "1.490.000" -> 1490000 */
function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const s = v.trim().replace(/[.,\s]/g, "");
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Dòng giá cho hàng nặng thường ghi khoảng cân: "21-44", "21+", ">20", "trên 20kg".
 * Trả về mốc bắt đầu để biết đây là đơn giá mỗi ký, không phải tổng tiền.
 */
function toRangeStart(v: unknown): number | null {
  if (typeof v !== "string") return null;
  const s = v.trim().toLowerCase().replace(/kgs?/g, "").trim();
  const m = s.match(/^(?:tu\s+|từ\s+|>|>=|trên\s+)?(\d+(?:[.,]\d+)?)\s*(?:[-–—+]|tro len|trở lên|$)/);
  if (!m) return null;
  const n = Number(m[1].replace(",", "."));
  return Number.isFinite(n) && n > 20 ? n : null;
}

/** Cân nặng có thể ghi "0.5" hoặc "0,5" — giữ phần thập phân. */
function toWeight(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) && v > 0 ? v : null;
  if (typeof v !== "string") return null;
  const s = v.trim().replace(/kgs?$/i, "").trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Đọc file Excel/CSV, tự dò cột cân và cột giá.
 *
 * Không đòi file đúng khuôn: quét từng dòng, dòng nào có một số nhỏ (cân, dưới
 * 1000) đi kèm một số lớn (giá, từ 1000 trở lên) thì nhận. Nhờ vậy file có
 * dòng tiêu đề, cột thừa hay nhiều bảng phụ vẫn đọc được.
 */
export async function parsePriceFile(buffer: Buffer, fileName: string): Promise<ParseResult> {
  const wb = new ExcelJS.Workbook();
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".csv")) {
    const { Readable } = await import("stream");
    await wb.csv.read(Readable.from(buffer.toString("utf-8")));
  } else {
    await wb.xlsx.load(buffer as unknown as ArrayBuffer);
  }

  const ws = wb.worksheets[0];
  const warnings: string[] = [];
  if (!ws) {
    return {
      rows: [], steps: STEP_KG.map(() => null), missing: [...STEP_KG],
      over20Rows: [], suggestedOver20PerKg: null,
      warnings: ["File không có trang tính nào."],
    };
  }
  if (wb.worksheets.length > 1) {
    warnings.push(`File có ${wb.worksheets.length} trang tính, chỉ đọc trang đầu ("${ws.name}").`);
  }

  const seen = new Map<number, number>();
  const over20: ParsedRow[] = [];

  ws.eachRow((row) => {
    const cells: unknown[] = [];
    row.eachCell({ includeEmpty: true }, (cell) => {
      const v = cell.value;
      cells.push(typeof v === "object" && v !== null && "result" in v ? v.result : v);
    });

    // Dòng dạng "21-44 | 238000" là đơn giá mỗi ký cho hàng trên 20kg.
    for (let i = 0; i < cells.length - 1; i++) {
      const start = toRangeStart(cells[i]);
      if (start == null) continue;
      for (let j = i + 1; j < cells.length; j++) {
        const price = toNumber(cells[j]);
        if (price != null && price >= 1000) {
          over20.push({ kg: start, price });
          return;
        }
      }
    }

    // Tìm cặp (cân, giá) đầu tiên trên dòng.
    for (let i = 0; i < cells.length - 1; i++) {
      const kg = toWeight(cells[i]);
      if (kg == null || kg > 1000) continue;
      for (let j = i + 1; j < cells.length; j++) {
        const price = toNumber(cells[j]);
        if (price == null) continue;
        if (price < 1000) continue; // số nhỏ không phải tiền
        if (kg > 20) over20.push({ kg, price });
        else if (!seen.has(kg)) seen.set(kg, price);
        return;
      }
    }
  });

  const rows = [...seen.entries()]
    .map(([kg, price]) => ({ kg, price }))
    .sort((a, b) => a.kg - b.kg);

  const steps = STEP_KG.map((kg) => seen.get(kg) ?? null);
  const missing = STEP_KG.filter((kg) => !seen.has(kg));

  // Giá trên 20kg: nếu file có dòng dạng "21-44 | 238000" thì số đó là đơn giá/kg.
  let suggestedOver20PerKg: number | null = null;
  if (over20.length > 0) {
    const perKg = over20.filter((r) => r.price < 1_000_000);
    if (perKg.length > 0) suggestedOver20PerKg = perKg[0].price;
  }

  if (rows.length === 0) {
    warnings.push("Không đọc được dòng giá nào. File cần có cột số ký và cột giá tiền.");
  }
  if (missing.length > 0 && rows.length > 0) {
    warnings.push(`Thiếu ${missing.length} mốc cân: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? "…" : ""}`);
  }

  // Giá phải tăng dần theo cân — lệch là dấu hiệu đọc nhầm cột.
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].price < rows[i - 1].price) {
      warnings.push(
        `Giá ở mốc ${rows[i].kg}kg (${rows[i].price.toLocaleString("vi-VN")}đ) thấp hơn mốc ${rows[i - 1].kg}kg — kiểm tra lại file.`,
      );
      break;
    }
  }

  return { rows, steps, missing, over20Rows: over20, suggestedOver20PerKg, warnings };
}

/** Đọc bảng giá đã up của tất cả tuyến. */
export async function getPriceOverrides(): Promise<Record<string, PriceOverride>> {
  const rows = await prisma.siteSetting.findMany({ where: { key: { startsWith: "price_" } } });
  const out: Record<string, PriceOverride> = {};
  for (const r of rows) {
    if (!r.value) continue;
    try {
      const parsed = JSON.parse(r.value) as PriceOverride;
      if (Array.isArray(parsed.prices) && parsed.prices.length === STEP_KG.length) {
        out[r.key.replace(/^price_/, "")] = parsed;
      }
    } catch {
      // Giá hỏng thì bỏ qua, dùng bảng cứng — không để web sập vì một dòng JSON lỗi.
    }
  }
  return out;
}

/** Danh sách tuyến đã áp bảng giá tự nạp; tuyến chưa up vẫn giữ giá cứng. */
export async function getDestinations(): Promise<Destination[]> {
  const overrides = await getPriceOverrides();
  return destinations.map((d) => {
    const o = overrides[d.key];
    if (!o || d.table.type !== "steps") return d;
    return {
      ...d,
      table: { ...d.table, prices: o.prices, over20PerKg: o.over20PerKg },
    };
  });
}

export async function savePriceOverride(destKey: string, data: PriceOverride) {
  const value = JSON.stringify(data);
  await prisma.siteSetting.upsert({
    where: { key: KEY(destKey) },
    update: { value },
    create: { key: KEY(destKey), value },
  });
}

/** Xoá bảng đã up để quay lại giá gốc trong code. */
export async function clearPriceOverride(destKey: string) {
  await prisma.siteSetting.deleteMany({ where: { key: KEY(destKey) } });
}
