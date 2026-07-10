"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSession, clearSession, getAdminId } from "@/lib/auth";

function slugify(text: string): string {
  const map: Record<string, string> = {
    à: "a", á: "a", ả: "a", ã: "a", ạ: "a", ă: "a", ắ: "a", ằ: "a", ẳ: "a", ẵ: "a", ặ: "a",
    â: "a", ấ: "a", ầ: "a", ẩ: "a", ẫ: "a", ậ: "a", è: "e", é: "e", ẻ: "e", ẽ: "e", ẹ: "e",
    ê: "e", ế: "e", ề: "e", ể: "e", ễ: "e", ệ: "e", ì: "i", í: "i", ỉ: "i", ĩ: "i", ị: "i",
    ò: "o", ó: "o", ỏ: "o", õ: "o", ọ: "o", ô: "o", ố: "o", ồ: "o", ổ: "o", ỗ: "o", ộ: "o",
    ơ: "o", ớ: "o", ờ: "o", ở: "o", ỡ: "o", ợ: "o", ù: "u", ú: "u", ủ: "u", ũ: "u", ụ: "u",
    ư: "u", ứ: "u", ừ: "u", ử: "u", ữ: "u", ự: "u", ỳ: "y", ý: "y", ỷ: "y", ỹ: "y", ỵ: "y", đ: "d",
  };
  return text
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .split("").map((c) => map[c] ?? c).join("")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export type FormState = { ok: boolean; message: string } | null;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { ok: false, message: "Sai tài khoản hoặc mật khẩu." };
  }
  await setSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}

async function ensureAdmin() {
  const id = await getAdminId();
  if (!id) redirect("/admin/login");
  return id;
}

export async function saveArticle(_prev: FormState, formData: FormData): Promise<FormState> {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  if (!title || !content) return { ok: false, message: "Cần tiêu đề và nội dung." };

  const slug = slugify(String(formData.get("slug") || "") || title);
  const faqRaw = String(formData.get("faqJson") || "").trim();
  let faqJson: string | null = null;
  if (faqRaw) {
    try {
      JSON.parse(faqRaw);
      faqJson = faqRaw;
    } catch {
      return { ok: false, message: "FAQ phải là JSON hợp lệ, ví dụ: [{\"q\":\"...\",\"a\":\"...\"}]" };
    }
  }

  const data = {
    slug,
    title,
    excerpt: String(formData.get("excerpt") || "") || null,
    content,
    coverImage: String(formData.get("coverImage") || "") || null,
    category: String(formData.get("category") || "Kiến thức"),
    tags: String(formData.get("tags") || ""),
    metaTitle: String(formData.get("metaTitle") || "") || null,
    metaDescription: String(formData.get("metaDescription") || "") || null,
    faqJson,
    published: formData.get("published") === "on",
  };

  if (id) {
    await prisma.article.update({ where: { id }, data });
  } else {
    const exists = await prisma.article.findUnique({ where: { slug } });
    if (exists) return { ok: false, message: "Đường dẫn (slug) đã tồn tại, đổi tiêu đề hoặc slug." };
    await prisma.article.create({ data });
  }
  revalidatePath("/tin-tuc");
  revalidatePath("/admin/bai-viet");
  redirect("/admin/bai-viet");
}

export async function deleteArticle(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  if (id) await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/bai-viet");
  revalidatePath("/tin-tuc");
}

export async function updateLeadStatus(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "Mới");
  if (id) await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin/lead");
}

export async function saveOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  const trackingCode = String(formData.get("trackingCode") || "").trim().toUpperCase();
  const senderName = String(formData.get("senderName") || "").trim();
  const receiverName = String(formData.get("receiverName") || "").trim();
  const destination = String(formData.get("destination") || "").trim();
  if (!trackingCode || !senderName || !receiverName || !destination) {
    return { ok: false, message: "Cần mã vận đơn, người gửi, người nhận và điểm đến." };
  }
  const data = {
    trackingCode,
    senderName,
    receiverName,
    origin: String(formData.get("origin") || "Việt Nam"),
    destination,
    weight: formData.get("weight") ? Number(formData.get("weight")) : null,
    status: String(formData.get("status") || "Đã tiếp nhận"),
    note: String(formData.get("note") || "") || null,
  };
  if (id) {
    await prisma.order.update({ where: { id }, data });
  } else {
    const exists = await prisma.order.findUnique({ where: { trackingCode } });
    if (exists) return { ok: false, message: "Mã vận đơn đã tồn tại." };
    await prisma.order.create({ data });
  }
  revalidatePath("/admin/don-hang");
  redirect("/admin/don-hang");
}

export async function addOrderEvent(formData: FormData) {
  await ensureAdmin();
  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "").trim();
  if (!orderId || !status) return;
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  await prisma.orderEvent.create({
    data: {
      orderId,
      status,
      location: String(formData.get("location") || "") || null,
      note: String(formData.get("note") || "") || null,
    },
  });
  revalidatePath("/admin/don-hang");
}

export async function deleteOrder(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  if (id) await prisma.order.delete({ where: { id } });
  revalidatePath("/admin/don-hang");
}


// ===== Chuyên mục =====
export async function saveCategory(formData: FormData) {
  await ensureAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return;
  const exists = await prisma.category.findUnique({ where: { name } });
  if (!exists) {
    await prisma.category.create({ data: { name } });
  }
  revalidatePath("/admin/chuyen-muc");
  revalidatePath("/tin-tuc");
}

export async function deleteCategory(formData: FormData) {
  await ensureAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const cat = await prisma.category.findUnique({ where: { id } });
  if (!cat) return;
  const inUse = await prisma.article.count({ where: { category: cat.name } });
  if (inUse > 0) return; // không xoá chuyên mục đang có bài
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/chuyen-muc");
}
