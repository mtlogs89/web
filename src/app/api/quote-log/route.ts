import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Ghi lại mỗi lần khách bấm "Tính ước tính".
 *
 * Route công khai (khách chưa đăng nhập vẫn gọi được) nên chỉ nhận đúng các
 * trường cần, chặn giá trị vô lý, và không lưu gì nhận dạng được khách.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body không hợp lệ" }, { status: 400 });
  }

  const dest = String(body.dest ?? "").slice(0, 40);
  const destLabel = String(body.destLabel ?? "").slice(0, 80);
  const cargo = String(body.cargo ?? "").slice(0, 40);
  const weight = Number(body.weight);
  const mode = body.mode === "contact" ? "contact" : "price";

  if (!dest || !destLabel || !cargo) {
    return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
  }
  // Cân nặng ngoài khoảng này chắc chắn là gõ nhầm hoặc bot.
  if (!Number.isFinite(weight) || weight <= 0 || weight > 10000) {
    return NextResponse.json({ error: "Cân nặng không hợp lệ" }, { status: 400 });
  }

  const priceRaw = Number(body.priceTotal);
  const priceTotal =
    Number.isFinite(priceRaw) && priceRaw > 0 ? Math.round(priceRaw) : null;

  try {
    await prisma.quoteLog.create({
      data: {
        dest,
        destLabel,
        weight,
        cargo,
        dims: body.dims ? String(body.dims).slice(0, 40) : null,
        page: String(body.page ?? "").slice(0, 200),
        mode,
        priceTotal,
        sessionId: body.sessionId ? String(body.sessionId).slice(0, 40) : null,
      },
    });
  } catch (e) {
    // Ghi thống kê hỏng thì không được ảnh hưởng gì tới khách đang tính cước.
    console.error("quote-log failed:", e);
  }

  return NextResponse.json({ ok: true });
}
