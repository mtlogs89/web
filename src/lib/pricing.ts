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
};

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
    transit: [8, 12],
    baoThue: true,
    table: {
      type: "steps",
      over20PerKg: null,
      prices: [
        1490000, 1490000, 1820000, 2085000, 2268000, 2515000, 2659000, 2928000, 3211000, 3283000,
        3348000, 3632000, 3877000, 4134000, 4347000, 4634000, 4894000, 5143000, 5391000, 5642000,
        5773000, 6017000, 6275000, 6492000, 6762000, 7006000, 7254000, 7508000, 7731000, 7980000,
        8113000, 8237000, 8450000, 8684000, 8917000, 9115000, 9379000, 9588000, 9836000, 10055000,
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
    transit: [10, 12],
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
    transit: [7, 9],
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
    key: "khac",
    label: "Nước khác (Nhật, Hàn, Châu Âu…)",
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

export function estimate(input: EstimateInput): EstimateResult | null {
  const dest = destinations.find((d) => d.key === input.destKey);
  if (!dest) return null;

  const actual = Math.max(0, Number(input.weightKg) || 0);
  const { l, w, h } = input.dims ?? {};
  const volumetric = l && w && h ? (Number(l) * Number(w) * Number(h)) / VOLUMETRIC_DIVISOR : 0;
  const chargeableRaw = Math.max(actual, volumetric);
  if (chargeableRaw <= 0) return null;

  if (dest.key === "khac") {
    return { mode: "contact", destLabel: dest.label, reason: "Tuyến này cần liên hệ để được báo giá." };
  }

  const surKg = dest.surcharge[input.cargoKey] ?? 0;

  if (dest.table.type === "steps") {
    const t = dest.table;
    let base: number;
    let chargeable: number;
    if (chargeableRaw > 20) {
      if (t.over20PerKg == null) {
        return { mode: "contact", destLabel: dest.label, reason: "Hàng trên 20kg — liên hệ để có giá tốt." };
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
      destLabel: dest.label,
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
    destLabel: dest.label,
    chargeable: Math.round(kg * 10) / 10,
    total: base + surcharge,
    transit: dest.transit,
    baoThue: dest.baoThue,
    note: dest.note,
    surchargeApplied: surcharge,
  };
}

export const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "₫";
