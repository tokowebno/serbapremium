"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, AdminSearchInput, AdminSelect, AdminToolbar } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export default function AdminUlasanPage() {
  const all = api.reviews.all();
  const [list, setList] = useState(all);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("semua");
  const [appId, setAppId] = useState("semua");
  const toast = useToast();

  const apps = api.apps.list();
  const appOptions = [
    { value: "semua", label: "Semua Aplikasi" },
    ...apps.map((a) => ({ value: a.id, label: a.name })),
  ];

  const filtered = useMemo(
    () =>
      list.filter(
        (r) =>
          (status === "semua" || r.status === status) &&
          (appId === "semua" || r.appId === appId) &&
          (q === "" || r.userName.toLowerCase().includes(q.toLowerCase()) || r.content.toLowerCase().includes(q.toLowerCase())),
      ),
    [list, q, status, appId],
  );

  const toggle = (r: Review) => {
    setList((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: x.status === "visible" ? "hidden" : "visible" } : x)));
    toast.push({
      title: r.status === "visible" ? "Ulasan disembunyikan" : "Ulasan dipulihkan",
      tone: r.status === "visible" ? "info" : "success",
    });
  };

  const columns: Column<Review>[] = [
    {
      key: "aplikasi",
      header: "Aplikasi",
      render: (r) => <span className="text-[13px] font-medium">{api.apps.getBySlug(r.appId)?.name ?? r.appId}</span>,
    },
    { key: "pengguna", header: "Pengguna", render: (r) => <span className="text-[13px]">{r.userName}</span> },
    {
      key: "rating",
      header: "Rating",
      render: (r) => <Rating value={r.rating} showValue={false} size={13} />,
    },
    {
      key: "isi",
      header: "Isi",
      render: (r) => (
        <span className="block max-w-md truncate text-[13px] text-fg-muted" title={r.content}>
          {r.content}
        </span>
      ),
    },
    { key: "tanggal", header: "Tanggal", render: (r) => <span className="text-[13px] text-fg-muted">{formatDate(r.date)}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "aksi",
      header: "Aksi",
      className: "text-right",
      render: (r) =>
        r.status === "visible" ? (
          <Button variant="ghost" size="sm" onClick={() => toggle(r)}>
            <EyeOff size={14} />
            Sembunyikan
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => toggle(r)}>
            <Eye size={14} />
            Pulihkan
          </Button>
        ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Ulasan" description={`${all.length} ulasan tercatat, ${all.filter((r) => r.status === "visible").length} tampil di toko.`} />
      <AdminToolbar>
        <AdminSearchInput value={q} onChange={setQ} placeholder="Cari pengguna atau isi…" />
        <AdminSelect label="Filter aplikasi" value={appId} onChange={setAppId} options={appOptions} />
        <AdminSelect
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "semua", label: "Semua Status" },
            { value: "visible", label: "Terlihat" },
            { value: "hidden", label: "Tersembunyi" },
          ]}
        />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} />
    </div>
  );
}