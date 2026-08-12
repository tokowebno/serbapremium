"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Select, Textarea } from "@/components/ui/form";
import { useLibrary } from "@/components/storefront/providers";
import { useToast } from "@/components/ui/toast";

export default function UlasanPage() {
  const { entries } = useLibrary();
  const toast = useToast();
  const [appId, setAppId] = useState("");

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="Belum ada ulasan."
        description="Setelah membeli aplikasi, bagikan pengalaman Anda untuk membantu pembeli lain."
        action={{ label: "Jelajahi Aplikasi", href: "/aplikasi" }}
      />
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!appId) return;
    toast.push({ title: "Ulasan terkirim", description: "Terima kasih atas ulasan Anda." });
  };

  const owned = entries
    .map((entry) => api.apps.getBySlug(entry.appId))
    .filter((a) => a !== undefined);

  return (
    <div className="space-y-4">
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm"
      >
        <h2 className="text-[15px] font-semibold tracking-tight">Tulis Ulasan</h2>
        <Field label="Aplikasi">
          <Select value={appId} onChange={(e) => setAppId(e.target.value)}>
            <option value="">Pilih aplikasi dari koleksi…</option>
            {owned.map((a) => (
              <option key={a!.id} value={a!.id}>
                {a!.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Isi Ulasan">
          <Textarea rows={4} placeholder="Bagaimana pengalaman Anda dengan aplikasi ini?" required />
        </Field>
        <Button type="submit">Kirim Ulasan</Button>
      </form>

      {entries.length > 0 && (
        <EmptyState
          icon={Star}
          title="Belum ada ulasan dari Anda."
          description="Ulasan yang Anda kirim akan tampil di sini."
        />
      )}
    </div>
  );
}