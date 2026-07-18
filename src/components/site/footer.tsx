import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { Logo } from "./logo";
import { CallAction } from "./call-action";
import { services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm">
            Vận chuyển xuất nhập khẩu quốc tế tới hơn 200 quốc gia. Uy tín – nhanh chóng – tận tâm.
          </p>
        </div>

        <div>
          <div className="mb-4 font-semibold text-white">Dịch vụ</div>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/dich-vu/${s.slug}`} className="hover:text-brand-400">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 font-semibold text-white">Hỗ trợ</div>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/tin-tuc" className="hover:text-brand-400">Tin tức & kinh nghiệm</Link></li>
            <li><Link href="/tra-cuu" className="hover:text-brand-400">Tra cứu đơn hàng</Link></li>
            <li><Link href="/lien-he" className="hover:text-brand-400">Báo giá</Link></li>
            <li><Link href="/nhap-hang" className="hover:text-brand-400">Mua hộ Taobao / Amazon</Link></li>
          </ul>
        </div>

        <div>
          <div className="mb-4 font-semibold text-white">Chi nhánh</div>
          <ul className="space-y-4 text-sm">
            {site.branches.map((b) => (
              <li key={b.name}>
                <div className="font-semibold text-white">{b.name}</div>
                <div className="mt-1 flex gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" /> {b.address}
                </div>
                {b.phones.length > 0 && (
                  <div className="mt-1 flex gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" />
                    <span>
                      {b.phones.map((p, i) => (
                        <span key={p}>
                          {i > 0 && " · "}
                          <CallAction phone={p.replace(/\./g, "")} className="font-semibold hover:text-brand-400">{p}</CallAction>
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-sm text-white/50">
          © {new Date().getFullYear()} {site.name}. Vận chuyển quốc tế uy tín.
        </div>
      </div>
    </footer>
  );
}
