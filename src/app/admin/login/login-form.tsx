"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login, type FormState } from "../actions";

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 font-medium outline-none focus:border-brand-500";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(login, null);
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-ink-soft">Tài khoản</label>
        <input name="username" required autoFocus className={inputCls} />
      </div>
      <div>
        <label className="text-sm font-medium text-ink-soft">Mật khẩu</label>
        <input name="password" type="password" required className={inputCls} />
      </div>
      {state && !state.ok && (
        <p className="text-sm font-medium text-coral-600">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:opacity-60"
      >
        <LogIn className="h-5 w-5" /> {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
