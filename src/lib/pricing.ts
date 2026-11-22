// Bảng giá tham khảo theo bảng giá THẬT của Minh Thiện (user cấp 2026).
// Giá theo từng mốc 0.5kg (tổng tiền cho kiện ở mốc đó), trên 20kg tùy tuyến.
// ⚠️ Giá thay đổi theo thời gian — luôn kèm ghi chú "giá tham khảo, liên hệ để chốt".

export const VOLUMETRIC_DIVISOR = 5000; // cân quy đổi = D×R×C(cm)/5000

// 40 mốc cân: 0.5, 1.0, ... 20.0 kg
export const STEP_KG = Array.from({ length: 40 }, (_, i) => (i + 1) * 0.5);

type StepTable = {
  type: "steps";
  prices: number[]; // 40 phần tử, tổng tiền theo mốc cân
  over20PerKg: number | null; // đơn giá/kg khi >20kg, null = liên hệ
};
type RangeTable = {
  type: "ranges";
  ranges: { min: number; max: number; flat?: number; perKg?: number }[];
  smallSurcharge?: { underKg: number; fee: number }; // phụ thu giao hàng cho kiện nhẹ
};

export type Destination = {
  key: string;
  label: string;
  transit: [number, number];
  baoThue: boolean; // bao thuế nhập khẩu?
  note?: string;
  table: StepTable | RangeTable;
  // phụ thu theo loại hàng (VNĐ/kg)
  surcharge: Record<string, number>;
  /**
   * Tuyến chia vùng giá (Mỹ: California rẻ hơn các bang khác — bảng giá của Min 11/2026).
   * parent: tuyến cha — công cụ tính cước không liệt kê riêng mà cho chọn "Người nhận ở" dưới tuyến cha.
   * regionLabel: tên vùng của bảng giá này ("các bang khác", "California").
   */
  parent?: string;
  regionLabel?: string;
};

/** Tên đầy đủ khi tuyến chia vùng: "Mỹ – các bang khác", "Mỹ – California"; tuyến thường giữ nguyên tên. */
export function tenTuyenDayDu(d: Destination, all: Destination[] = destinations): string {
  if (!d.regionLabel) return d.label;
  const goc = (d.parent ? all.find((x) => x.key === d.parent)?.label : d.label) ?? d.label;
  return `${goc.replace(/\s*\(.*\)$/, "")} – ${d.regionLabel}`;
}

const SUR = (thuoc: number, myPham: number, yen: number, sach: number) => ({
  thuong: 0,
  thuoc_tpcn: thuoc,
  my_pham: myPham,
  yen,
  sach,
});

export const destinations: Destination[] = [
  {
    key: "my",
    label: "Mỹ (USA)",
    regionLabel: "các bang khác",
    transit: [8, 12], // tiết kiệm; đi nhanh 3–5 ngày (xem lib/transit.ts)
    baoThue: true,
    // Bảng giá Mỹ của Min (dịch vụ 8–12 ngày, hàng thường, cột "các bang còn lại"), 18/11/2026.
    // Lưu ý: mốc 15kg rẻ hơn 14,5kg — đúng như bảng gốc (từ 15kg tính mức rẻ hơn).
    table: {
      type: "steps",
      over20PerKg: null,
      prices: [
        1068000, 1116000, 1325000, 1535000, 1737000, 1941000, 2009000, 2197000, 2383000, 2569000,
        2712000, 2855000, 3034000, 3213000, 3397000, 3579000, 3761000, 3941000, 4125000, 4160000,
        4368000, 4535000, 4710000, 4886000, 5064000, 5241000, 5425000, 5610000, 5788000, 5753000,
        5926000, 6099000, 6268000, 6437000, 6615000, 6791000, 6963000, 7136000, 7309000, 7480000,
      ],
    },
    surcharge: SUR(150000, 50000, 300000, 30000),
  },
  {
    key: "my_cali",
    label: "Mỹ – California",
    parent: "my",
    regionLabel: "California",
    transit: [8, 12],
    baoThue: true,
    // Cùng bảng của Min, cột "California" (rẻ hơn các bang khác).
    table: {
      type: "steps",
      over20PerKg: null,
      prices: [
        1041000, 1089000, 1272000, 1457000, 1641000, 1824000, 1886000, 2060000, 2233000, 2407000,
        2565000, 2725000, 2895000, 3066000, 3237000, 3409000, 3579000, 3748000, 3919000, 3950000,
        4150000, 4312000, 4476000, 4640000, 4804000, 4968000, 5134000, 5300000, 5465000, 5429000,
        5590000, 5751000, 5911000, 6071000, 6230000, 6390000, 6555000, 6719000, 6876000, 7033000,
      ],
    },
    surcharge: SUR(150000, 50000, 300000, 30000),
  },
  {
    key: "anh",
    label: "Anh (UK)",
    transit: [8, 10],
    baoThue: true,
    table: {
      type: "steps",
      over20PerKg: 265000,
      prices: [
        856000, 1001000, 1134000, 1257000, 1385000, 1538000, 1550000, 1692000, 1808000, 1975000,
        2101000, 2178000, 2239000, 2356000, 2487000, 2629000, 2755000, 2877000, 3018000, 3160000,
        3241000, 3308000, 3419000, 3546000, 3687000, 3809000, 3940000, 4067000, 4193000, 4320000,
        4446000, 4528000, 4539000, 4661000, 4782000, 4899000, 5020000, 5137000, 5258000, 5410000,
      ],
    },
    surcharge: SUR(150000, 50000, 300000, 30000),
  },
  {
    key: "canada",
    label: "Canada",
    transit: [8, 12], // tiết kiệm; đi nhanh 3–5 ngày (xem lib/transit.ts)
    baoThue: false,
    table: {
      type: "steps",
      over20PerKg: null,
      prices: [
        1000000, 1250000, 1500000, 1750000, 1800000, 2000000, 2200000, 2350000, 2550000, 2750000,
        2950000, 3120000, 3330000, 3520000, 3650000, 3830000, 4085000, 4280000, 4470000, 4540000,
        4630000, 4820000, 5100000, 5280000, 5480000, 5660000, 5850000, 6030000, 6220000, 6350000,
        6420000, 6580000, 6760000, 6950000, 7090000, 7195000, 7300000, 7405000, 7515000, 7620000,
      ],
    },
    surcharge: SUR(100000, 50000, 300000, 30000),
  },
  {
    key: "uc",
    label: "Úc (Australia)",
    transit: [8, 12], // tiết kiệm; đi nhanh 3–5 ngày (xem lib/transit.ts)
    baoThue: false,
    table: {
      type: "steps",
      over20PerKg: null,
      prices: [
        700000, 800000, 900000, 950000, 1030000, 1130000, 1230000, 1330000, 1360000, 1530000,
        1600000, 1670000, 1730000, 1830000, 1920000, 2015000, 2110000, 2205000, 2235000, 2325000,
        2347500, 2450000, 2547500, 2650000, 2752500, 2855000, 2957500, 3060000, 3152500, 3225000,
        3297500, 3370000, 3422500, 3510000, 3602500, 3700000, 3797500, 3845000, 3897500, 3950000,
      ],
    },
    surcharge: SUR(100000, 50000, 350000, 20000),
  },
  {
    key: "singapore",
    label: "Singapore",
    transit: [1, 2],
    baoThue: false,
    note: "Bay hàng tuần T3–5–7.",
    table: {
      type: "ranges",
      ranges: [
        { min: 1, max: 2, flat: 450000 },
        { min: 2, max: 5, perKg: 155000 },
        { min: 5, max: 10, perKg: 135000 },
        { min: 10, max: 20, perKg: 102000 },
        { min: 20, max: 50, perKg: 91000 },
        { min: 50, max: 99, perKg: 81000 },
        { min: 99, max: 100000, perKg: 61000 },
      ],
      smallSurcharge: { underKg: 11, fee: 200000 },
    },
    surcharge: SUR(30000, 0, 0, 0),
  },
  {
    key: "han",
    label: "Hàn Quốc",
    transit: [3, 5],
    baoThue: false,
    // Chủ chốt giá 22/11/2026: đồng giá 95.000đ/kg mọi mốc cân, kiện dưới 3kg cộng
    // thêm 100.000đ/kiện. Không có bảng mốc 0,5kg như tuyến Mỹ nên dùng kiểu "ranges".
    note: "Đồng giá 95.000đ/kg. Kiện dưới 3kg phụ thu 100.000đ/kiện.",
    table: {
      type: "ranges",
      ranges: [{ min: 0, max: 100000, perKg: 95000 }],
      smallSurcharge: { underKg: 3, fee: 100000 },
    },
    // CHƯA có số phụ thu theo mặt hàng cho tuyến Hàn — để 0 thay vì đoán. Mặt hàng
    // đặc biệt (thuốc, mỹ phẩm, yến) báo khách gọi hotline, xem ghi chú ở công cụ.
    surcharge: SUR(0, 0, 0, 0),
  },
  {
    key: "dai_loan",
    label: "Đài Loan",
    transit: [3, 5],
    baoThue: false,
    // Chủ chốt giá 22/11/2026: đồng giá 105.000đ/kg, kiện dưới 3kg cộng 100.000đ/kiện.
    note: "Đồng giá 105.000đ/kg. Kiện dưới 3kg phụ thu 100.000đ/kiện.",
    table: {
      type: "ranges",
      ranges: [{ min: 0, max: 100000, perKg: 105000 }],
      smallSurcharge: { underKg: 3, fee: 100000 },
    },
    // CHƯA có phụ thu theo mặt hàng cho tuyến này — để 0 thay vì đoán.
    surcharge: SUR(0, 0, 0, 0),
  },
  {
    key: "thai_lan",
    label: "Thái Lan",
    transit: [5, 7],
    baoThue: false,
    // Chủ 22/11/2026: "Thái thì tuỳ giá" — không có biểu giá cố định. Vẫn tách thành
    // lựa chọn riêng để khách tìm thấy tuyến và để đo được nhu cầu, nhưng không hiện
    // số; bảng rỗng → công cụ tự chuyển sang chế độ báo giá riêng.
    note: "Tuyến này báo giá theo từng lô — gọi hotline để có giá đúng.",
    table: { type: "steps", over20PerKg: null, prices: [] },
    surcharge: SUR(0, 0, 0, 0),
  },
  {
    key: "khac",
    label: "Nước khác (Nhật, Châu Âu…)",
    transit: [3, 12],
    baoThue: false,
    table: { type: "steps", over20PerKg: null, prices: [] }, // không có bảng → liên hệ
    surcharge: SUR(0, 0, 0, 0),
  },
];

export type CargoType = { key: string; label: string };
export const cargoTypes: CargoType[] = [
  { key: "thuong", label: "Hàng thường" },
  { key: "thuoc_tpcn", label: "Thuốc / TPCN" },
  { key: "my_pham", label: "Mỹ phẩm" },
  { key: "yen", label: "Yến, đông trùng" },
  { key: "sach", label: "Sách" },
];

export type EstimateInput = {
  destKey: string;
  weightKg: number;
  cargoKey: string;
  dims?: { l?: number; w?: number; h?: number };
};

export type EstimateResult =
  | {
      mode: "price";
      destLabel: string;
      chargeable: number;
      total: number;
      transit: [number, number];
      baoThue: boolean;
      note?: string;
      surchargeApplied: number;
    }
  | { mode: "contact"; destLabel: string; reason: string };

function ceilHalf(n: number) {
  return Math.ceil(n / 0.5) * 0.5;
}

/**
 * @param destList bảng giá dùng để tính. Bỏ trống thì dùng bảng cứng bên dưới;
 *   trang web truyền vào bảng đã nạp từ file ở /admin/bang-gia.
 */
export function estimate(
  input: EstimateInput,
  destList: Destination[] = destinations,
): EstimateResult | null {
  const dest = destList.find((d) => d.key === input.destKey);
  if (!dest) return null;

  const actual = Math.max(0, Number(input.weightKg) || 0);
  const { l, w, h } = input.dims ?? {};
  const volumetric = l && w && h ? (Number(l) * Number(w) * Number(h)) / VOLUMETRIC_DIVISOR : 0;
  const chargeableRaw = Math.max(actual, volumetric);
  if (chargeableRaw <= 0) return null;

  // Bảng giá rỗng = tuyến chưa có biểu giá cố định (Thái Lan: báo theo từng lô).
  const chuaCoBangGia = dest.table.type === "steps" && dest.table.prices.length === 0;
  if (dest.key === "khac" || chuaCoBangGia) {
    return {
      mode: "contact",
      destLabel: tenTuyenDayDu(dest, destList),
      reason: dest.note ?? "Tuyến này cần liên hệ để được báo giá.",
    };
  }

  const surKg = dest.surcharge[input.cargoKey] ?? 0;

  if (dest.table.type === "steps") {
    const t = dest.table;
    let base: number;
    let chargeable: number;
    if (chargeableRaw > 20) {
      if (t.over20PerKg == null) {
        return { mode: "contact", destLabel: tenTuyenDayDu(dest, destList), reason: "Hàng trên 20kg — liên hệ để có giá tốt." };
      }
      chargeable = Math.ceil(chargeableRaw);
      base = t.over20PerKg * chargeable;
    } else {
      chargeable = ceilHalf(chargeableRaw);
      const idx = Math.round(chargeable / 0.5) - 1;
      base = t.prices[Math.min(idx, t.prices.length - 1)];
    }
    const surcharge = surKg * chargeable;
    return {
      mode: "price",
      destLabel: tenTuyenDayDu(dest, destList),
      chargeable,
      total: base + surcharge,
      transit: dest.transit,
      baoThue: dest.baoThue,
      note: dest.note,
      surchargeApplied: surcharge,
    };
  }

  // ranges (Singapore)
  const t = dest.table;
  const kg = chargeableRaw;
  const r = t.ranges.find((x) => kg > x.min && kg <= x.max) ?? t.ranges[0];
  let base = r.flat != null ? r.flat : (r.perKg ?? 0) * kg;
  if (t.smallSurcharge && kg < t.smallSurcharge.underKg) base += t.smallSurcharge.fee;
  const surcharge = surKg * kg;
  return {
    mode: "price",
    destLabel: tenTuyenDayDu(dest, destList),
    chargeable: Math.round(kg * 10) / 10,
    total: base + surcharge,
    transit: dest.transit,
    baoThue: dest.baoThue,
    note: dest.note,
    surchargeApplied: surcharge,
  };
}

export const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "₫";
