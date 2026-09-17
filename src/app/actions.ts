"use server";

import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewLead } from "@/lib/telegram";

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

  const route = String(formData.get("route") || "") || null;
  const weight = String(formData.get("weight") || "") || null;
  const cargoType = String(formData.get("cargoType") || "") || null;
  const message = String(formData.get("message") || "") || null;

  await prisma.lead.create({
    data: { name, phone, route, weight, cargoType, message },
  });

  // Báo Telegram chạy nền sau khi trả lời khách — có thử lại tới ~2 phút khi mạng chập.
  after(() => notifyNewLead({ name, phone, route, weight, cargoType, message }));

  return {
    ok: true,
    message: "Đã gửi yêu cầu! Minh Thiện sẽ liên hệ báo giá trong ít phút.",
  };
}

export type QuoteLeadState = { ok: boolean; message: string } | null;

function gioViet() {
  return Number(
    new Date().toLocaleString("en-GB", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", hour12: false }),
  );
}

/**
 * Khách để lại SĐT ngay trong khung kết quả của công cụ tính cước. Tuyến, cân,
 * loại hàng và giá vừa tính được điền sẵn vào lead — khách chỉ gõ mỗi số điện thoại.
 */
export async function submitQuoteLead(
  _prev: QuoteLeadState,
  formData: FormData,
): Promise<QuoteLeadState> {
  // Ô ẩn "website" người thật không thấy — có chữ là bot.
  if (String(formData.get("website") || "").trim()) {
    return { ok: true, message: "Đã nhận số của bạn!" };
  }

  const phone = String(formData.get("phone") || "").trim();
  if (!/^[0-9+\s.]{8,15}$/.test(phone)) {
    return { ok: false, message: "Số điện thoại chưa đúng, kiểm tra lại giúp mình nhé." };
  }

  const name = "Khách tính cước trên web";
  const route = String(formData.get("destLabel") || "").slice(0, 80) || null;
  const weightNum = Number(formData.get("weight"));
  const hasWeight = Number.isFinite(weightNum) && weightNum > 0 && weightNum <= 10000;
  const weight = hasWeight ? `${weightNum}kg` : null;
  const cargoType = String(formData.get("cargoLabel") || "").slice(0, 60) || null;
  const page = String(formData.get("page") || "").slice(0, 200);
  const reason = String(formData.get("reason") || "").slice(0, 200);
  const priceTotal = Number(formData.get("priceTotal"));
  const offer = String(formData.get("offer") || "").slice(0, 20);

  const message = [
    Number.isFinite(priceTotal) && priceTotal > 0
      ? `Web tính ra ${Math.round(priceTotal).toLocaleString("vi-VN")}đ`
      : `Web không ra giá${reason ? ` (${reason})` : ""}`,
    page && `trang ${page}`,
    offer && `web đang hiện ưu đãi ${offer}`,
  ]
    .filter(Boolean)
    .join(" · ");

  await prisma.lead.create({ data: { name, phone, route, weight, cargoType, message } });

  try {
    await prisma.quoteAction.create({
      data: {
        action: "lead",
        sessionId: String(formData.get("sessionId") || "").slice(0, 40) || null,
        dest: String(formData.get("dest") || "").slice(0, 40) || null,
        weight: hasWeight ? weightNum : null,
        page,
      },
    });
  } catch (e) {
    console.error("quoteAction lead failed:", e);
  }

  // Báo Telegram chạy nền sau khi trả lời khách — có thử lại tới ~2 phút khi mạng chập.
  after(() => notifyNewLead({ name, phone, route, weight, cargoType, message }));

  const h = gioViet();
  return {
    ok: true,
    message:
      h < 8 || h >= 21
        ? "Đã nhận số của bạn! Sáng mai 8h Minh Thiện gọi lại ngay."
        : "Đã nhận số của bạn! Minh Thiện gọi lại trong ít phút.",
  };
}
