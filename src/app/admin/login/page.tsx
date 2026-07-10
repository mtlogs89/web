import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { getAdminId } from "@/lib/auth";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false } };

export default async function AdminLoginPage() {
  if (await getAdminId()) redirect("/admin");
  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-brand-50 bg-white p-8 shadow-xl shadow-brand-500/10">
        <div className="text-center">
          <span className="mx-auto flex w-fit items-center -space-x-1.5">
            <span className="h-4 w-4 rounded-full bg-coral-500" />
            <span className="h-4 w-4 rounded-full bg-sun-400" />
            <span className="h-4 w-4 rounded-full bg-brand-500" />
          </span>
          <h1 className="mt-4 text-xl font-black text-ink">Quản trị Minh Thiện</h1>
          <p className="mt-1 text-sm text-ink-soft">Đăng nhập để quản lý nội dung</p>
        </div>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
