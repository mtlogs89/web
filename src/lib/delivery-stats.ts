import "server-only";
import { prisma } from "./prisma";

/**
 * Số liệu thời gian giao hàng đo từ hệ thống theo dõi của app MT LOGS.
 * scripts/do-thoi-gian-giao.py tính rồi ghi vào SiteSetting.delivery_stats.
 * Trang gốc: /thoi-gian-giao-thuc-te — mọi chỗ khác chỉ nêu số rồi dẫn về đó.
 */
export type DongGiao = {
  tuyen: string; nhom: string; tenNhom: string; soKien: number; duDuLieu: boolean;
  trungVi: number | null; trungBinh: number | null; nhanhNhat: number | null;
  lauNhat: number | null; trongHan: number | null; henLo: number; henHi: number;
};
export type SoGiao = {
  capNhat: string; kyTu: string | null; kyDen: string | null; tongKien: number;
  loaiThieuHanhTrinh?: number; toiThieu: number; dong: DongGiao[];
};

export async function laySoGiao(): Promise<SoGiao | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: "delivery_stats" } });
    return row ? (JSON.parse(row.value) as SoGiao) : null;
  } catch {
    return null;
  }
}

/** Các dòng đủ dữ liệu của một tuyến, ví dụ "Mỹ". Không có thì trả mảng rỗng. */
export function dongTheoTuyen(so: SoGiao | null, tuyen: string): DongGiao[] {
  if (!so) return [];
  return so.dong.filter((d) => d.duDuLieu && d.tuyen === tuyen);
}

/** Một câu gọn để nhúng vào trang khác — viết sẵn cho máy trích, không chỉ cho người đọc. */
export function cauTomTat(dong: DongGiao[], tuyen: string): string {
  if (dong.length === 0) return "";
  const tong = dong.reduce((s, d) => s + d.soKien, 0);
  const ve = dong.map((d) => `${d.tenNhom.toLowerCase()} trung vị ${d.trungVi} ngày làm việc`).join(", ");
  return `Đo ${tong} kiện đã giao đi ${tuyen}: ${ve}.`;
}

/** Kỳ đo dạng "27/07–30/10/2026" (khác năm thì ghi đủ năm hai đầu). */
export function kyDoNgan(so: SoGiao): string | null {
  if (!so.kyTu || !so.kyDen) return null;
  const [y1, m1, d1] = so.kyTu.split("-");
  const [y2, m2, d2] = so.kyDen.split("-");
  return y1 === y2 ? `${d1}/${m1}–${d2}/${m2}/${y2}` : `${d1}/${m1}/${y1}–${d2}/${m2}/${y2}`;
}

const MA_TUYEN: Record<string, string> = { "Mỹ": "my", "Úc": "uc", "Canada": "canada" };
const MA_NHOM: Record<string, string> = { "tiet-kiem": "tk", "nhanh": "nhanh" };

function giaTriMa(ma: string, so: SoGiao): string | null {
  if (ma === "tong_kien") return String(so.tongKien);
  if (ma === "ky") return kyDoNgan(so);
  const m = ma.match(/^([a-z]+)_(tk|nhanh)_(ngay|kien|dung_hen)$/);
  if (!m) return null;
  const d = so.dong.find((x) => x.duDuLieu && MA_TUYEN[x.tuyen] === m[1] && MA_NHOM[x.nhom] === m[2]);
  if (!d) return null;
  const v = m[3] === "ngay" ? d.trungVi : m[3] === "kien" ? d.soKien : d.trongHan;
  return v == null ? null : String(v);
}

/**
 * Điền số đo vào chữ nhập ở admin (chữ đầu trang chủ…). Số trong delivery_stats tự đổi mỗi
 * đầu tháng (cron chạy scripts/do-thoi-gian-giao.py), chữ gõ cứng thì không: 21/11/2026 đầu
 * trang chủ còn ghi "9 ngày · 91 kiện" (số tháng 7–9) trong khi khối số ngay dưới đã là
 * "10 ngày · 187 kiện" — audit SEO/AI chỉ ra là số tự mâu thuẫn.
 *
 * Mã điền được:
 *   {my_tk_ngay} {my_tk_kien} {my_tk_dung_hen}  Mỹ đi tiết kiệm: trung vị (ngày làm việc), số kiện,
 *                                               % về trong khoảng hẹn
 *   đổi "my" → "uc" / "canada", "tk" → "nhanh" cho tuyến, nhóm khác (vd {my_nhanh_ngay})
 *   {tong_kien}  tổng số kiện cả kỳ đo        {ky}  kỳ đo, vd "27/07–30/10/2026"
 *
 * Trả null khi chữ có mã mà không điền được (chưa có số, hoặc tuyến chưa đủ kiện) — nơi gọi
 * dùng chữ mặc định, không để lộ "{…}" ra trang.
 */
export function dienSoGiao(text: string, so: SoGiao | null): string | null {
  let thieu = false;
  const out = text.replace(/\{([a-z_]+)\}/g, (nguyen: string, ma: string) => {
    const v = so ? giaTriMa(ma, so) : null;
    if (v == null) thieu = true;
    return v ?? nguyen;
  });
  return thieu ? null : out;
}
