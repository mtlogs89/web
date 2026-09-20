/**
 * Bảng "mặt hàng nào gửi đi được" theo từng tuyến — nguồn là file training của chủ
 * (~/Documents/MinhThien/Training NV sales.xlsx), rút ra JSON bằng
 * scripts/tao-du-lieu-hang-tuyen.py. Chủ sửa file training thì chạy lại script rồi deploy.
 *
 * Dùng cho trang công khai /hang-gui-duoc/<tuyến>: trả lời thẳng câu
 * "gửi <mặt hàng> đi <nước> được không" — nhóm câu hỏi khách hỏi AI nhiều nhất.
 */
import duLieu from "@/data/hang-tuyen.json";

export type TrangThai = "nhan" | "dieu-kien" | "khong" | "chua-ro";

export type MatHang = {
  ten: string;
  nhom: string;
  viDu: string;
  trangThai: TrangThai;
  ghiChu: string;
};

export type TuyenHang = { ten: string; slug: string; hang: MatHang[] };

export const TUYEN_HANG = duLieu as TuyenHang[];

/** Tuyến → chuyên mục bài viết, để lấy thời gian vận chuyển và link về trang tuyến. */
export const TUYEN_CHUYEN_MUC: Record<string, string> = {
  "Mỹ": "Gửi hàng đi Mỹ",
  "Canada": "Gửi hàng đi Canada",
  "Úc": "Gửi hàng đi Úc",
  "Châu Âu": "Gửi hàng đi Châu Âu",
  "Nhật": "Gửi hàng đi Nhật Bản",
  "Hàn": "Gửi hàng đi Hàn Quốc",
  "Singapore": "Gửi hàng đi Singapore",
  "Malaysia": "Gửi hàng đi Malaysia",
  "Thái Lan": "Gửi hàng đi Thái Lan",
  "Đài Loan": "Gửi hàng đi Đài Loan",
};

/** Tên đầy đủ khi đứng trong câu: "gửi hàng đi Nhật Bản" nghe đủ hơn "đi Nhật". */
export const TEN_DAY_DU: Record<string, string> = {
  "Nhật": "Nhật Bản",
  "Hàn": "Hàn Quốc",
};

export const tenTuyen = (t: string) => TEN_DAY_DU[t] ?? t;

export const NHAN: Record<TrangThai, { nhan: string; mo: string }> = {
  nhan: { nhan: "Nhận gửi", mo: "Minh Thiện nhận gửi bình thường." },
  "dieu-kien": { nhan: "Nhận, có điều kiện", mo: "Minh Thiện vẫn nhận nhưng có điều kiện hoặc phụ thu." },
  khong: { nhan: "Không nhận", mo: "Minh Thiện không nhận gửi mặt hàng này." },
  "chua-ro": { nhan: "Gọi hỏi", mo: "Tuỳ lô hàng — gọi hotline để được trả lời chính xác." },
};

export function layTuyen(slug: string): TuyenHang | undefined {
  return TUYEN_HANG.find((t) => t.slug === slug);
}

export function demTheoTrangThai(t: TuyenHang) {
  const d: Record<TrangThai, number> = { nhan: 0, "dieu-kien": 0, khong: 0, "chua-ro": 0 };
  for (const h of t.hang) d[h.trangThai]++;
  return d;
}

/** Câu trả lời một dòng cho "gửi <mặt hàng> đi <nước> được không?" — dùng cho FAQ schema. */
export function cauTraLoi(h: MatHang, tuyen: string): string {
  const ten = tenTuyen(tuyen);
  const dau =
    h.trangThai === "nhan"
      ? `Được. Minh Thiện Logistics nhận gửi ${h.ten.toLowerCase()} đi ${ten}.`
      : h.trangThai === "dieu-kien"
        ? `Được, nhưng có điều kiện. Minh Thiện Logistics vẫn nhận gửi ${h.ten.toLowerCase()} đi ${ten}.`
        : h.trangThai === "khong"
          ? `Không. Minh Thiện Logistics không nhận gửi ${h.ten.toLowerCase()} đi ${ten}.`
          : `Tuỳ lô hàng. Mặt hàng ${h.ten.toLowerCase()} đi ${ten} cần xem hàng thật mới trả lời chính xác được.`;
  return [dau, h.ghiChu].filter(Boolean).join(" ");
}
