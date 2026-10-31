"use client";

import { site } from "@/lib/site";
import { CallAction } from "./call-action";
import { useTrangUc } from "./so-trang-uc";

/** Số của một chi nhánh ở chân trang. Trang Úc: số Ms Min đổi thành số Ms Vy (xem so-trang-uc). */
export function SoChiNhanh({ phones }: { phones: readonly string[] }) {
  const uc = useTrangUc();
  const ds = uc ? phones.map((p) => (p === site.phoneDisplay ? site.phone2Display : p)) : phones;
  return (
    <span>
      {ds.map((p, i) => (
        <span key={p}>
          {i > 0 && " · "}
          <CallAction phone={p.replace(/\./g, "")} className="font-semibold hover:text-brand-400" conversionLabel="VzBiCL7SkdUcEKnr1_49">{p}</CallAction>
        </span>
      ))}
    </span>
  );
}
