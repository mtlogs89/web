// Gửi tin Telegram cho chủ khi có lead mới. Chỉ gọi sendMessage — không polling,
// không đụng tới webhook/bot xử lý "Quản lý chi tiêu" bên app logistics.
const ADMIN_LEAD_URL = "https://minhthienlogs.com/admin/lead";

export async function notifyNewLead(lead: {
  name: string;
  phone: string;
  route?: string | null;
  weight?: string | null;
  cargoType?: string | null;
  message?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_LEAD_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[telegram] chưa cấu hình TELEGRAM_BOT_TOKEN / TELEGRAM_LEAD_CHAT_ID — bỏ qua báo lead");
    return;
  }

  const gio = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const lines = [
    "📩 Yêu cầu báo giá mới",
    `👤 ${lead.name}`,
    `📞 ${lead.phone}`,
    lead.route && `🚚 Tuyến: ${lead.route}`,
    lead.weight && `⚖️ Cân nặng: ${lead.weight}`,
    lead.cargoType && `📦 Loại hàng: ${lead.cargoType}`,
    lead.message && `💬 ${lead.message}`,
    `🕒 ${gio}`,
    `👉 ${ADMIN_LEAD_URL}`,
  ].filter(Boolean);

  // Mạng máy chủ → Telegram thỉnh thoảng chập (ETIMEDOUT) vài chục giây, và lần fetch đầu ngay sau
  // PM2 restart hay chết vì DNS chưa sẵn sàng. Nên thử lại dãn dần trong ~2 phút rồi mới bỏ.
  // Hàm này chạy sau khi đã trả lời khách (gọi qua after()), khách không phải chờ.
  const choTruoc = [0, 3, 10, 30, 60]; // giây chờ trước mỗi lần thử
  for (let lan = 1; lan <= choTruoc.length; lan++) {
    if (choTruoc[lan - 1]) await new Promise((r) => setTimeout(r, choTruoc[lan - 1] * 1000));
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        if (lan > 1) console.warn(`[telegram] báo lead gửi được ở lần ${lan}`);
        return;
      }
      console.error(`[telegram] notifyNewLead lỗi ${res.status} (lần ${lan}): ${(await res.text()).slice(0, 300)}`);
      // 4xx (sai token/chat id) thì thử lại cũng vô ích, trừ 429 (bị giới hạn tốc độ).
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
    } catch (e) {
      const err = e as Error & { cause?: { code?: string } };
      console.error(`[telegram] notifyNewLead exception (lần ${lan}):`, err.cause?.code || err.message);
    }
  }
  console.error("[telegram] KHÔNG gửi được báo lead sau nhiều lần — kiểm tra /admin/lead thủ công");
}
