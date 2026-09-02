"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Field, Input, Switch } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/storefront/providers";

export default function PengaturanPage() {
  const toast = useToast();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notif, setNotif] = useState({ promo: true, update: true, pesanan: true });

  const handleLogout = () => {
    logout();
    toast.push({ title: "Berhasil keluar", description: "Sampai jumpa lagi di SerbaPremium." });
    router.push("/");
  };

  return (
    <div className="max-w-xl space-y-6">
      <form
        className="glass-card space-y-4 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md"
        onSubmit={(e) => {
          e.preventDefault();
          toast.push({ title: "Profil diperbarui" });
        }}
      >
        <h2 className="text-base font-bold text-fg">Informasi Pribadi</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap" htmlFor="nama">
            <Input id="nama" defaultValue={user?.name ?? ""} />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" defaultValue={user?.email ?? ""} />
          </Field>
        </div>
        <Field label="Kata Sandi Baru" hint="Kosongkan jika tidak ingin mengubah." htmlFor="sandi">
          <Input id="sandi" type="password" placeholder="••••••••" />
        </Field>
        <Button type="submit" className="rounded-full">Simpan Perubahan</Button>
      </form>

      <div className="glass-card space-y-4 rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-sm backdrop-blur-md">
        <h2 className="text-base font-bold text-fg">Notifikasi Akun</h2>
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <p className="text-sm font-semibold text-fg">Promo dan penawaran</p>
            <p className="text-xs font-normal text-fg-muted">Kabar diskon dan voucher aplikasi.</p>
          </div>
          <Switch checked={notif.promo} onChange={(v) => setNotif((s) => ({ ...s, promo: v }))} label="Promo dan penawaran" />
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-3">
          <div>
            <p className="text-sm font-semibold text-fg">Pembaruan lisensi</p>
            <p className="text-xs font-normal text-fg-muted">Info update versi untuk aplikasi di koleksi Anda.</p>
          </div>
          <Switch checked={notif.update} onChange={(v) => setNotif((s) => ({ ...s, update: v }))} label="Pembaruan lisensi" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-fg">Status pesanan</p>
            <p className="text-xs font-normal text-fg-muted">Notifikasi saat verifikasi pembayaran berhasil.</p>
          </div>
          <Switch checked={notif.pesanan} onChange={(v) => setNotif((s) => ({ ...s, pesanan: v }))} label="Status pesanan" />
        </div>
      </div>

      <div className="glass-card flex items-center justify-between rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-sm backdrop-blur-md">
        <div>
          <p className="text-sm font-semibold text-fg">Keluar Akun</p>
          <p className="text-xs font-normal text-fg-muted">Keluar dari sesi akun Anda di browser ini.</p>
        </div>
        <Button variant="danger" size="sm" onClick={handleLogout} className="rounded-full">
          <LogOut size={14} /> Keluar
        </Button>
      </div>
    </div>
  );
}