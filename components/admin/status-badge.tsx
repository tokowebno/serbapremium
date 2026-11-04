"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/components/storefront/i18n-provider";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const maps: Record<string, { label: { id: string; en: string; zh: string }; tone: Tone }> = {
  dibayar: { label: { id: "Dibayar", en: "Paid", zh: "已付款" }, tone: "success" },
  menunggu: { label: { id: "Menunggu Pembayaran", en: "Awaiting Payment", zh: "等待付款" }, tone: "warning" },
  gagal: { label: { id: "Gagal", en: "Failed", zh: "失败" }, tone: "danger" },
  dibatalkan: { label: { id: "Dibatalkan", en: "Cancelled", zh: "已取消" }, tone: "neutral" },
  dikembalikan: { label: { id: "Dikembalikan", en: "Refunded", zh: "已退款" }, tone: "warning" },
  diproses: { label: { id: "Diproses", en: "Processing", zh: "处理中" }, tone: "accent" },
  selesai: { label: { id: "Selesai", en: "Completed", zh: "已完成" }, tone: "success" },
  aktif: { label: { id: "Aktif", en: "Active", zh: "有效" }, tone: "success" },
  nonaktif: { label: { id: "Nonaktif", en: "Inactive", zh: "未启用" }, tone: "neutral" },
  terjadwal: { label: { id: "Terjadwal", en: "Scheduled", zh: "已排期" }, tone: "accent" },
  suspend: { label: { id: "Disuspend", en: "Suspended", zh: "已暂停" }, tone: "danger" },
  berhasil: { label: { id: "Berhasil", en: "Successful", zh: "成功" }, tone: "success" },
  "pengingat": { label: { id: "Pengingat", en: "Reminder", zh: "提醒" }, tone: "warning" },
  visible: { label: { id: "Terlihat", en: "Visible", zh: "可见" }, tone: "success" },
  hidden: { label: { id: "Tersembunyi", en: "Hidden", zh: "隐藏" }, tone: "neutral" },
};

export function StatusBadge({ status }: { status: string }) {
  const { lang } = useTranslation();
  const key = (lang === "en" || lang === "zh" ? lang : "id") as "id" | "en" | "zh";
  const meta = maps[status];
  if (!meta) return <Badge tone="neutral">{status}</Badge>;
  return <Badge tone={meta.tone}>{meta.label[key]}</Badge>;
}
