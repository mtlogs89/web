import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Newspaper, FolderOpen, Inbox, Package, LogOut, ExternalLink, Palette, Images, Globe } from "lucide-react";
import { getAdminId } from "@/lib/auth";
import { logout } from "../actions";

const menu = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/giao-dien", label: "Giao diện trang chủ", icon: Palette },
  { href: "/admin/dich-vu", label: "Thẻ dịch vụ", icon: Globe },
  { href: "/admin/thu-vien", label: "Thư viện ảnh", icon: Images },
  { href: "/admin/bai-viet", label: "Bài viết", icon: Newspaper },
  { href: "/admin/chuyen-muc", label: "Chuyên mục", icon: FolderOpen },
  { href: "/admin/lead", label: "Yêu cầu báo giá", icon: Inbox },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: Package },
];

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await getAdminId())) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-brand-50/40">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-brand-50 bg-white p-5 md:flex">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex items-center -space-x-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-coral-500" />
            <span className="h-3.5 w-3.5 rounded-full bg-sun-400" />
            <span className="h-3.5 w-3.5 rounded-full bg-brand-500" />
          </span>
          <span className="font-black text-brand-600">Quản trị</span>
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
            >
              <m.icon className="h-5 w-5" /> {m.label}
            </Link>
          ))}
        </nav>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:text-brand-600"
        >
          <ExternalLink className="h-4 w-4" /> Xem website
        </a>
        <form action={logout}>
          <button className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-coral-600 hover:bg-coral-50">
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-brand-50 bg-white px-6 py-3 md:hidden">
          <span className="font-black text-brand-600">Quản trị Minh Thiện</span>
          <form action={logout}>
            <button className="text-sm font-medium text-coral-600">Đăng xuất</button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-brand-50 bg-white px-4 py-2 md:hidden">
          {menu.map((m) => (
            <Link key={m.href} href={m.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink-soft">
              {m.label}
            </Link>
          ))}
        </nav>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
