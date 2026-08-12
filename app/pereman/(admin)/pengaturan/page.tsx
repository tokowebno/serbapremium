"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-5 text-[15px] font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function SaveRow({ onSave }: { onSave: () => void }) {
  return (
    <div className="mt-5 flex justify-end">
      <Button onClick={onSave}>Simpan</Button>
    </div>
  );
}

export default function AdminPengaturanPage() {
  const [tab, setTab] = useState("info");
  const toast = useToast();
  const save = (label: string) => toast.push({ title: `${label} disimpan` });

  return (
    <div>
      <AdminPageHeader title="Pengaturan" description="Konfigurasi platform Tokono." />
      <Tabs
        className="mb-6 max-w-full"
        active={tab}
        onChange={setTab}
        items={[
          { id: "info", label: "Informasi" },
          { id: "pembayaran", label: "Pembayaran" },
          { id: "email", label: "Email" },
          { id: "keamanan", label: "Keamanan" },
          { id: "notifikasi", label: "Notifikasi" },
          { id: "tampilan", label: "Tampilan" },
          { id: "sistem", label: "Sistem" },
        ]}
      />

      {tab === "info" && (
        <Section title="Informasi Tokono">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama Toko"><Input defaultValue="Tokono" /></Field>
            <Field label="Email Dukungan"><Input defaultValue="dukungan@tokono.example" /></Field>
            <Field label="Alamat" className="sm:col-span-2"><Textarea defaultValue="Jakarta, Indonesia" /></Field>
            <Field label="PPN (%)"><Input type="number" defaultValue="11" /></Field>
          </div>
          <SaveRow onSave={() => save("Informasi")} />
        </Section>
      )}

      {tab === "pembayaran" && (
        <Section title="Pembayaran">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Gateway"><Select defaultValue="xendit"><option value="xendit">Xendit</option><option value="midtrans">Midtrans</option></Select></Field>
            <Field label="Rekening Utama"><Input defaultValue="Bank Nusantara 1234-5678" /></Field>
            <Field label="Mata Uang"><Select defaultValue="idr"><option value="idr">IDR — Rupiah</option></Select></Field>
            <Field label="Status"><Select defaultValue="aktif"><option value="aktif">Aktif</option><option value="nonaktif">Nonaktif</option></Select></Field>
          </div>
          <SaveRow onSave={() => save("Pembayaran")} />
        </Section>
      )}

      {tab === "email" && (
        <Section title="Email">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Host SMTP"><Input defaultValue="smtp.tokono.example" /></Field>
            <Field label="Port"><Input defaultValue="587" /></Field>
            <Field label="Dari Nama"><Input defaultValue="Tokono" /></Field>
            <Field label="Dari Alamat"><Input defaultValue="noreply@tokono.example" /></Field>
          </div>
          <SaveRow onSave={() => save("Email")} />
        </Section>
      )}

      {tab === "keamanan" && (
        <Section title="Keamanan">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Otentikasi dua faktor (admin)</p>
              <p className="text-[13px] text-fg-muted">Wajibkan kode verifikasi untuk semua admin.</p>
            </div>
            <Switch checked label="Otentikasi dua faktor" onChange={() => {}} />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium">Sesi aktif</p>
              <p className="text-[13px] text-fg-muted">3 sesi admin aktif saat ini.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => save("Sesi")}>Putuskan Semua</Button>
          </div>
          <SaveRow onSave={() => save("Keamanan")} />
        </Section>
      )}

      {tab === "notifikasi" && (
        <Section title="Notifikasi">
          {[
            { label: "Pesanan baru", desc: "Kabar saat pengguna menyelesaikan pembayaran." },
            { label: "Ulasan masuk", desc: "Kabar saat ulasan baru ditulis." },
            { label: "Laporan masalah", desc: "Kabar saat pengguna melapor masalah." },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between gap-4 border-b border-border py-3 first:pt-0 last:border-0">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-[13px] text-fg-muted">{n.desc}</p>
              </div>
              <Switch checked label={n.label} onChange={() => {}} />
            </div>
          ))}
          <SaveRow onSave={() => save("Notifikasi")} />
        </Section>
      )}

      {tab === "tampilan" && (
        <Section title="Tampilan">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bahasa Antarmuka"><Select defaultValue="id"><option value="id">Bahasa Indonesia</option></Select></Field>
            <Field label="Zona Waktu"><Select defaultValue="wib"><option value="wib">WIB — Jakarta</option></Select></Field>
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium">Mode gelap sebagai bawaan</p>
              <p className="text-[13px] text-fg-muted">Pengguna baru akan melihat toko dalam mode gelap.</p>
            </div>
            <Switch checked={false} label="Mode gelap" onChange={() => {}} />
          </div>
          <SaveRow onSave={() => save("Tampilan")} />
        </Section>
      )}

      {tab === "sistem" && (
        <Section title="Sistem">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Mode pemeliharaan</p>
              <p className="text-[13px] text-fg-muted">Toko sementara tidak dapat diakses pengguna.</p>
            </div>
            <Switch checked={false} label="Mode pemeliharaan" onChange={() => {}} />
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm text-fg-muted">Versi platform: <span className="font-mono text-fg">1.0.0</span></p>
          </div>
          <SaveRow onSave={() => save("Sistem")} />
        </Section>
      )}
    </div>
  );
}