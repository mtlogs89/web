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
