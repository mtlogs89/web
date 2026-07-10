import { Flag, Ship, Mountain, Castle, Globe, Warehouse, type LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  Flag,
  Ship,
  Mountain,
  Castle,
  Globe,
  Warehouse,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Globe;
  return <Icon className={className} />;
}
