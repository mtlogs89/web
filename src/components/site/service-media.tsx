import { ServiceIcon } from "./service-icon";

/** Icon thẻ dịch vụ: emoji (thẻ tự thêm) → cờ quốc gia → icon gradient. */
export function ServiceMedia({
  service,
  size = "lg",
}: {
  service: { title: string; flag?: string; icon?: string; emoji?: string };
  size?: "lg" | "sm";
}) {
  const dim = size === "lg" ? "h-14 w-14" : "h-10 w-10";

  if (service.emoji) {
    const textSize = size === "lg" ? "text-3xl" : "text-xl";
    return (
      <div
        className={`${dim} ${textSize} flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-brand-50 shadow-md`}
      >
        {service.emoji}
      </div>
    );
  }

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
      <ServiceIcon name={service.icon || "Globe"} className={iconSize} />
    </div>
  );
}
