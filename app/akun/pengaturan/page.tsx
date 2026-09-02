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
        className="space-y-4 rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]"
        onSubmit={(e) => {
          e.preventDefault();
          toast.push({ title: "Profil diperbarui" });
        }}
      >
        <h2 className="text-sm font-black uppercase text-fg">Informasi Pribadi</h2>
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
        <Button type="submit">Simpan Perubahan</Button>
      </form>

      <div className="space-y-4 rounded-lg border-2 border-border bg-surface p-6 shadow-[4px_4px_0px_var(--shadow-color)]">
        <h2 className="text-sm font-black uppercase text-fg">Notifikasi Akun</h2>
        <div className="flex items-center justify-between gap-4 border-b-2 border-border pb-3">
          <div>
            <p className="text-sm font-bold text-fg">Promo dan penawaran</p>
            <p className="text-xs font-medium text-fg-muted">Kabar diskon dan voucher aplikasi.</p>
          </div>
          <Switch checked={notif.promo} onChange={(v) => setNotif((s) => ({ ...s, promo: v }))} label="Promo dan penawaran" />
        </div>
        <div className="flex items-center justify-between gap-4 border-b-2 border-border pb-3">
          <div>
            <p className="text-sm font-bold text-fg">Pembaruan lisensi</p>
            <p className="text-xs font-medium text-fg-muted">Info update versi untuk aplikasi di koleksi Anda.</p>
          </div>
          <Switch checked={notif.update} onChange={(v) => setNotif((s) => ({ ...s, update: v }))} label="Pembaruan aplikasi" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-fg">Status pesanan</p>
            <p className="text-xs font-medium text-fg-muted">Notifikasi saat pesanan diproses dan selesai.</p>
          </div>
          <Switch checked={notif.pesanan} onChange={(v) => setNotif((s) => ({ ...s, pesanan: v }))} label="Status pesanan" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleLogout}>
          <LogOut size={15} strokeWidth={2.5} />
          Keluar dari Akun
        </Button>
      </div>
    </div>
  );
}