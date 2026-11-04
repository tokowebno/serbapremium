"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Select, Textarea } from "@/components/ui/form";
import { useLibrary } from "@/components/storefront/providers";
import { useToast } from "@/components/ui/toast";
import { useTranslation } from "@/components/storefront/i18n-provider";

export default function UlasanPage() {
  const { entries } = useLibrary();
  const toast = useToast();
  const { lang } = useTranslation();
  const L = (en: string, id: string, zh: string) => (lang === "en" ? en : lang === "zh" ? zh : id);
  const [appId, setAppId] = useState("");

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title={L("No reviews yet.", "Belum ada ulasan.", "暂无评价。")}
        description={L(
          "After purchasing an app, share your experience to help other buyers.",
          "Setelah membeli aplikasi, bagikan pengalaman Anda untuk membantu pembeli lain.",
          "购买应用后，分享您的使用体验来帮助其他买家。",
        )}
        action={{ label: L("Explore Apps", "Jelajahi Aplikasi", "浏览应用"), href: "/aplikasi" }}
      />
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!appId) return;
    toast.push({
      title: L("Review submitted", "Ulasan terkirim", "评价已提交"),
      description: L(
        "Thank you for reviewing Texas AI.",
        "Terima kasih atas ulasan Anda di Texas AI.",
        "感谢您对 Texas AI 的评价。",
      ),
    });
  };

  const owned = entries
    .map((entry) => api.apps.getBySlug(entry.appId))
    .filter((a) => a !== undefined);

  return (
    <div className="space-y-4">
      <form
        onSubmit={onSubmit}
        className="glass-card space-y-4 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md"
      >
        <h2 className="text-base font-bold text-fg">{L("Write a Buyer Review", "Tulis Ulasan Pembeli", "撰写买家评价")}</h2>
        <Field label={L("App to Review", "Aplikasi yang Diulas", "评价的应用")}>
          <Select value={appId} onChange={(e) => setAppId(e.target.value)}>
            <option value="">{L("Choose an app from your collection…", "Pilih aplikasi dari koleksi…", "从收藏中选择应用…")}</option>
            {owned.map((a) => (
              <option key={a!.id} value={a!.id}>
                {a!.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={L("Your Review", "Isi Ulasan", "评价内容")}>
          <Textarea
            rows={4}
            placeholder={L(
              "How was your experience with this app/license?",
              "Bagaimana pengalaman Anda dengan aplikasi/lisensi ini?",
              "您对该应用/授权的体验如何？",
            )}
            required
          />
        </Field>
        <Button type="submit" className="rounded-full">{L("Submit Review", "Kirim Ulasan", "提交评价")}</Button>
      </form>

      <div className="glass-card rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
        <p className="text-xs text-fg-muted leading-relaxed">
          {L(
            "All reviews are automatically verified based on your Texas AI account transactions.",
            "Semua ulasan diverifikasi secara otomatis berdasarkan transaksi akun Anda di Texas AI.",
            "所有评价均根据您在 Texas AI 的账户交易自动验证。",
          )}
        </p>
      </div>
    </div>
  );
}
