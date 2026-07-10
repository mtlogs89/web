import { ServiceIcon } from "./service-icon";
import type { Service } from "@/lib/site";

/** Icon thẻ dịch vụ: tuyến nước → cờ quốc gia (ảnh tròn); còn lại → icon gradient. */
export function ServiceMedia({
  service,
  size = "lg",
}: {
  service: Service;
  size?: "lg" | "sm";
}) {
  const dim = size === "lg" ? "h-14 w-14" : "h-10 w-10";

  if (service.flag) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/images/flags/${service.flag}.png`}
        alt={service.title}
        className={`${dim} shrink-0 rounded-full border-2 border-white object-cover shadow-md`}
      />
    );
  }

  const iconSize = size === "lg" ? "h-7 w-7" : "h-5 w-5";
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-2xl text-white`}
      style={{ background: "linear-gradient(135deg,#EC5E5E,#F2A93C 50%,#1FB6A2)" }}
    >
      <ServiceIcon name={service.icon} className={iconSize} />
    </div>
  );
}
