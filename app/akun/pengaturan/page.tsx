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
    toast.push({ title: "Berhasil keluar", description: "Sampai jumpa lagi." });
    router.push("/");
  };

  return (
    <div className="max-w-xl space-y-6">
      <form
        className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          toast.push({ title: "Profil diperbarui" });
        }}
      >
        <h2 className="text-[15px] font-semibold tracking-tight">Informasi Pribadi</h2>
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

      <div className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-[15px] font-semibold tracking-tight">Notifikasi</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Promo dan penawaran</p>
            <p className="text-[13px] text-fg-muted">Kabar promo aplikasi yang Anda keinginkan.</p>
          </div>
          <Switch checked={notif.promo} onChange={(v) => setNotif((s) => ({ ...s, promo: v }))} label="Promo dan penawaran" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Pembaruan aplikasi</p>
            <p className="text-[13px] text-fg-muted">Info versi baru untuk aplikasi di koleksi Anda.</p>
          </div>
          <Switch checked={notif.update} onChange={(v) => setNotif((s) => ({ ...s, update: v }))} label="Pembaruan aplikasi" />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Status pesanan</p>
            <p className="text-[13px] text-fg-muted">Notifikasi saat pesanan diproses dan selesai.</p>
          </div>
          <Switch checked={notif.pesanan} onChange={(v) => setNotif((s) => ({ ...s, pesanan: v }))} label="Status pesanan" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="danger" onClick={handleLogout}>
          <LogOut size={15} />
          Keluar
        </Button>
      </div>
    </div>
  );
}