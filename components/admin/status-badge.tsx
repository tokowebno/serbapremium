import { Badge } from "@/components/ui/badge";

const maps: Record<string, { label: string; tone: "neutral" | "accent" | "success" | "warning" | "danger" }> = {
  dibayar: { label: "Dibayar", tone: "success" },
  menunggu: { label: "Menunggu Pembayaran", tone: "warning" },
  gagal: { label: "Gagal", tone: "danger" },
  dibatalkan: { label: "Dibatalkan", tone: "neutral" },
  dikembalikan: { label: "Dikembalikan", tone: "warning" },
  diproses: { label: "Diproses", tone: "accent" },
  selesai: { label: "Selesai", tone: "success" },
  aktif: { label: "Aktif", tone: "success" },
  nonaktif: { label: "Nonaktif", tone: "neutral" },
  terjadwal: { label: "Terjadwal", tone: "accent" },
  suspend: { label: "Disuspend", tone: "danger" },
  berhasil: { label: "Berhasil", tone: "success" },
  "pengingat": { label: "Pengingat", tone: "warning" },
  visible: { label: "Terlihat", tone: "success" },
  hidden: { label: "Tersembunyi", tone: "neutral" },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = maps[status] ?? { label: status, tone: "neutral" as const };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
