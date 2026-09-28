/**
 * Lịch bay và giờ chốt hàng từng tuyến — nguồn: file training của chủ
 * (~/Documents/MinhThien/Training NV sales.xlsx, sheet Tổng hợp, dòng "Lịch bay" và "Lịch cut off").
 *
 * Đây là dữ liệu vận hành thật, KHÁC NHAU theo tuyến và gần như không đối thủ nào công bố —
 * nên vừa hữu ích cho khách vừa là nội dung AI chịu trích. Chủ đổi lịch thì sửa ở đây.
 */
export type LichBay = { bay: string; chot: string };

export const LICH_BAY: Record<string, LichBay> = {
  "Mỹ": { bay: "cả tuần", chot: "10 giờ sáng ngày hôm trước" },
  "Canada": { bay: "cả tuần", chot: "10 giờ sáng ngày hôm trước" },
  "Úc": { bay: "cả tuần", chot: "10 giờ sáng ngày hôm trước" },
  "Châu Âu": { bay: "thứ Ba và thứ Năm hằng tuần", chot: "từ thứ Bảy đến thứ Tư" },
  "Nhật": { bay: "cả tuần", chot: "4 giờ chiều ngày hôm trước" },
  "Hàn": { bay: "cả tuần", chot: "4 giờ chiều ngày hôm trước" },
  "Singapore": { bay: "cả tuần", chot: "9 giờ sáng mỗi ngày" },
  "Malaysia": { bay: "thứ Ba đến thứ Sáu", chot: "4 giờ chiều ngày hôm trước" },
  "Thái Lan": { bay: "cả tuần", chot: "4 giờ chiều ngày hôm trước" },
  "Đài Loan": { bay: "cả tuần", chot: "10 giờ sáng ngày hôm trước" },
};
