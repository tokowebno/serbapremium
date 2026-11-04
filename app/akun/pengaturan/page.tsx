"use client";

import { useState } from "react";
import { LogOut, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Field, Input, Switch } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";

export default function PengaturanPage() {
  const toast = useToast();
  const router = useRouter();
  const { user, isTelegramMiniApp, login, logout } = useAuth();
  const { lang } = useTranslation();
  const L = (en: string, id: string, zh: string) => (lang === "en" ? en : lang === "zh" ? zh : id);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [notif, setNotif] = useState({ promo: true, update: true, pesanan: true });

  const handleLogout = () => {
    logout();
    toast.push({
      title: L("Signed out", "Berhasil keluar", "已退出登录"),
      description: L("See you again at Texas AI.", "Sampai jumpa lagi di Texas AI.", "期待您再次光临 Texas AI。"),
    });
    router.push("/");
  };

  const notifPromo = L("Promos & offers", "Promo dan penawaran", "促销与优惠");
  const notifUpdate = L("License updates", "Pembaruan lisensi", "授权更新");
  const notifOrder = L("Order status", "Status pesanan", "订单状态");

  return (
    <div className="max-w-xl space-y-6">
      {user?.telegramId && (
        <div className="glass-card flex items-center gap-3.5 rounded-2xl border border-sky-500/25 bg-sky-500/10 p-4 shadow-xs backdrop-blur-md">
          <CheckCircle2 size={20} className="shrink-0 text-sky-500" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-fg">
              {L("Automatically Connected to Telegram", "Terhubung Otomatis ke Telegram", "已自动连接 Telegram")}
            </p>
            <p className="text-xs text-fg-muted truncate">
              {user.telegramUsername ? `@${user.telegramUsername} · ` : ""}Telegram ID: {user.telegramId}
            </p>
          </div>
        </div>
      )}

      <form
        className="glass-card space-y-4 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (user) {
            login({
              ...user,
              name: name.trim() || user.name,
              email: email.trim() || user.email,
            });
          }
          toast.push({ title: L("Profile updated", "Profil diperbarui", "资料已更新") });
        }}
      >
        <h2 className="text-base font-bold text-fg">{L("Personal Information", "Informasi Pribadi", "个人信息")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={L("Full Name", "Nama Lengkap", "姓名")} htmlFor="nama">
            <Input
              id="nama"
              value={name || user?.name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label={L("License Delivery Email (Optional)", "Email Pengiriman Lisensi (Opsional)", "授权接收邮箱（可选）")} htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email || user?.email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        </div>
        {!isTelegramMiniApp && (
          <Field
            label={L("New Password", "Kata Sandi Baru", "新密码")}
            hint={L("Leave blank to keep your current password.", "Kosongkan jika tidak ingin mengubah.", "如不修改请留空。")}
            htmlFor="sandi"
          >
            <Input id="sandi" type="password" placeholder="••••••••" />
          </Field>
        )}
        <Button type="submit" className="rounded-full">{L("Save Changes", "Simpan Perubahan", "保存更改")}</Button>
      </form>

      <div className="glass-card space-y-4 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
        <h2 className="text-base font-bold text-fg">{L("Account Notifications", "Notifikasi Akun", "账户通知")}</h2>
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <p className="text-sm font-semibold text-fg">{notifPromo}</p>
            <p className="text-xs font-normal text-fg-muted">
              {L("News about discounts and app vouchers.", "Kabar diskon dan voucher aplikasi.", "折扣与应用优惠券资讯。")}
            </p>
          </div>
          <Switch checked={notif.promo} onChange={(v) => setNotif((s) => ({ ...s, promo: v }))} label={notifPromo} />
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <p className="text-sm font-semibold text-fg">{notifUpdate}</p>
            <p className="text-xs font-normal text-fg-muted">
              {L("Version update info for apps in your collection.", "Info update versi untuk aplikasi di koleksi Anda.", "收藏中应用的版本更新信息。")}
            </p>
          </div>
          <Switch checked={notif.update} onChange={(v) => setNotif((s) => ({ ...s, update: v }))} label={notifUpdate} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-fg">{notifOrder}</p>
            <p className="text-xs font-normal text-fg-muted">
              {L("Notify me when payment verification succeeds.", "Notifikasi saat verifikasi pembayaran berhasil.", "付款验证成功时通知我。")}
            </p>
          </div>
          <Switch checked={notif.pesanan} onChange={(v) => setNotif((s) => ({ ...s, pesanan: v }))} label={notifOrder} />
        </div>
      </div>

      {!isTelegramMiniApp && (
        <div className="glass-card flex items-center justify-between rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-sm backdrop-blur-md">
          <div>
            <p className="text-sm font-semibold text-fg">{L("Sign Out", "Keluar Akun", "退出账户")}</p>
            <p className="text-xs font-normal text-fg-muted">
              {L("Sign out of your account session in this browser.", "Keluar dari sesi akun Anda di browser ini.", "在此浏览器中退出您的账户。")}
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout} className="rounded-full">
            <LogOut size={14} /> {L("Sign Out", "Keluar", "退出")}
          </Button>
        </div>
      )}
    </div>
  );
}
