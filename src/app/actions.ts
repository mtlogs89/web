"use server";

import { prisma } from "@/lib/prisma";

export type LeadState = { ok: boolean; message: string } | null;

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!name || !phone) {
    return { ok: false, message: "Vui lòng nhập họ tên và số điện thoại." };
  }
  if (!/^[0-9+\s.]{8,15}$/.test(phone)) {
    return { ok: false, message: "Số điện thoại không hợp lệ." };
  }

  await prisma.lead.create({
    data: {
      name,
      phone,
      route: String(formData.get("route") || "") || null,
      weight: String(formData.get("weight") || "") || null,
      cargoType: String(formData.get("cargoType") || "") || null,
      message: String(formData.get("message") || "") || null,
    },
  });

  return {
    ok: true,
    message: "Đã gửi yêu cầu! Minh Thiện sẽ liên hệ báo giá trong ít phút.",
  };
}
