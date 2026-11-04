"use client";

import Link from "next/link";
import { History, Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { api } from "@/lib/api";
import { AppIcon } from "@/components/ui/app-icon";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth, useLibrary, useWishlist } from "@/components/storefront/providers";
import { useTranslation } from "@/components/storefront/i18n-provider";
import { getLocalizedApp } from "@/lib/i18n/product-translations";
import { formatDate, formatPrice, formatRupiah } from "@/lib/utils";

export default function RingkasanPage() {
  const { user, balance, balanceUsd, transactions, openTopUp } = useAuth();
  const { entries } = useLibrary();
  const { ids } = useWishlist();
  const { lang } = useTranslation();
  const L = (en: string, id: string, zh: string) => (lang === "en" ? en : lang === "zh" ? zh : id);
  const isId = lang === "id";
  const dateLocale = lang === "en" ? "en-US" : lang === "zh" ? "zh-CN" : "id-ID";

  const koleksi = entries.filter((e) => api.apps.getBySlug(e.appId)).length;

  // Bahasa Indonesia -> Rupiah (+ USD kecil). English / Chinese -> USD saja.
  const mainBalance = isId ? formatRupiah(balance) : `$${balanceUsd.toFixed(2)}`;

  const stats = [
    {
      label: L("Wallet Balance", "Saldo Akun", "账户余额"),
      value: mainBalance,
      sub: isId ? `$${balanceUsd.toFixed(2)} USD` : "USD",
    },
    { label: L("Apps in Collection", "Aplikasi di Koleksi", "已收藏应用"), value: koleksi.toString() },
    { label: L("Wishlist", "Daftar Keinginan", "心愿单"), value: ids.length.toString() },
  ];

  const userSubtitle = user?.telegramId
    ? user.telegramUsername
      ? `@${user.telegramUsername} · Telegram ID: ${user.telegramId}`
      : `Telegram ID: ${user.telegramId}`
    : (user?.email ?? "-");

  return (
    <div className="space-y-6">
      {/* Profil & Saldo Card */}
      <div className="liquid-glass-slab flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {user?.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.photoUrl}
              alt={user.name}
              className="apple-squircle h-14 w-14 object-cover shadow-xs ring-1 ring-border"
            />
          ) : (
            <span className="apple-squircle flex h-14 w-14 items-center justify-center text-xl font-black text-fg bg-surface-2 shadow-xs">
              {user?.name?.charAt(0) ?? "U"}
            </span>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black tracking-tight text-fg">{user?.name ?? L("User", "Pengguna", "用户")}</p>
              {user?.telegramId && (
                <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[10.5px] font-bold text-sky-500">
                  {L("Telegram Connected", "Terhubung Telegram", "已连接 Telegram")}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-fg-muted">{userSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ButtonLink href="/isi-saldo" size="sm" className="rounded-full shadow-xs font-bold px-4">
            <PlusCircle size={14} />
            {L("Top Up", "Isi Saldo", "充值")}
          </ButtonLink>
          <ButtonLink href="/akun/pengaturan" variant="secondary" size="sm" className="rounded-full font-semibold px-4">
            {L("Account Settings", "Pengaturan Akun", "账户设置")}
          </ButtonLink>
        </div>
      </div>

      {/* Saldo Banner Widget */}
      <div className="liquid-glass-slab relative overflow-hidden rounded-[28px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 border border-border-strong bg-surface">

        <div className="relative z-10 flex items-center gap-4">
          <div className="apple-squircle flex h-14 w-14 items-center justify-center bg-surface-2 text-fg shadow-sm">
            <Wallet size={26} strokeWidth={2.4} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              {L("Available Wallet Balance", "Saldo Dompet Tersedia", "可用钱包余额")}
            </span>
            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-fg tabular-nums">{mainBalance}</span>
              <span className="text-sm font-bold text-fg-muted">
                {isId ? `≈ $${balanceUsd.toFixed(2)} USD` : "USD"}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => openTopUp()}
          size="lg"
          className="relative z-10 w-full sm:w-auto rounded-full bg-fg hover:bg-fg/90 text-surface font-bold px-7 py-3 shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <PlusCircle size={16} />
          <span>{L("Add Funds Now", "Tambah Dana Sekarang", "立即充值")}</span>
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="liquid-glass-slab rounded-2xl p-4 transition-all">
            <p className="text-[11px] font-bold uppercase tracking-wider text-fg-muted">{s.label}</p>
            <p className="mt-1.5 text-2xl font-black tracking-tight tabular-nums text-fg">{s.value}</p>
            {s.sub && <p className="text-[11px] font-bold text-fg-muted mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Riwayat Transaksi Saldo Terakhir */}
      {transactions && transactions.length > 0 && (
        <div className="liquid-glass-slab rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold tracking-tight text-fg">
              {L("Wallet Transaction History", "Riwayat Transaksi Saldo", "钱包交易记录")}
            </h2>
            <button
              type="button"
              onClick={() => openTopUp()}
              className="text-xs font-semibold text-accent hover:underline cursor-pointer"
            >
              {L("+ Top Up →", "+ Top Up Saldo →", "+ 充值 →")}
            </button>
          </div>
          <div className="mt-4 space-y-2.5">
            {transactions.slice(-5).reverse().map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-surface-2 p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.type === "deposit" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                    {t.type === "deposit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-fg">{t.title}</p>
                    <p className="text-[10.5px] text-fg-muted">{new Date(t.date).toLocaleString(dateLocale)}</p>
                  </div>
                </div>
                <span className={`text-sm font-black tabular-nums ${t.type === "deposit" ? "text-success" : "text-fg"}`}>
                  {t.type === "deposit" ? "+" : "-"}{formatPrice(t.amount, lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Koleksi */}
      {koleksi > 0 ? (
        <div className="liquid-glass-slab rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold tracking-tight text-fg">
              {L("Recent Collection", "Koleksi Terakhir", "最近收藏")}
            </h2>
            <Link href="/akun/koleksi" className="text-xs font-semibold text-accent hover:underline">
              {L("View all →", "Lihat semua →", "查看全部 →")}
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {entries
              .slice(-3)
              .reverse()
              .map((e) => {
                const raw = api.apps.getBySlug(e.appId);
                if (!raw) return null;
                const app = getLocalizedApp(raw, lang);
                return (
                  <div key={e.appId} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
                    <AppIcon icon={app.icon} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{app.name}</p>
                      <p className="text-xs font-normal text-fg-muted">
                        {L("Purchased", "Dibeli", "购买于")} {formatDate(e.purchasedAt, lang)}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-fg">{formatPrice(app.price, lang)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={History}
          title={L("No licenses in your collection yet", "Belum ada lisensi di koleksi", "收藏中暂无授权")}
          description={L(
            "Apps you purchase will appear here instantly, ready to access.",
            "Aplikasi yang Anda beli akan langsung muncul di sini dan siap diunduh.",
            "您购买的应用将立即显示在这里，随时可用。",
          )}
          action={{ label: L("Explore Catalog", "Jelajahi Katalog", "浏览目录"), href: "/aplikasi" }}
        />
      )}
    </div>
  );
}
