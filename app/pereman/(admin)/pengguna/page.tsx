"use client";

import { useMemo, useState } from "react";
import { ShieldOff } from "lucide-react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, AdminSearchInput, AdminSelect, AdminToolbar } from "@/components/admin/admin-header";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatRupiah } from "@/lib/utils";
import type { UserAccount } from "@/types";

export default function AdminPenggunaPage() {
  const users = api.users.list();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("semua");
  const [list, setList] = useState(users);
  const toast = useToast();

  const filtered = useMemo(
    () =>
      list.filter(
        (u) =>
          (role === "semua" || u.role === role) &&
          (q === "" || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())),
      ),
    [list, q, role],
  );

  const toggleStatus = (u: UserAccount) => {
    setList((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: x.status === "aktif" ? "suspend" : "aktif" } : x)));
    toast.push({
      title: u.status === "aktif" ? "Akun disuspend" : "Akun diaktifkan kembali",
      description: u.name,
      tone: u.status === "aktif" ? "error" : "success",
    });
  };

  const columns: Column<UserAccount>[] = [
    {
      key: "pengguna",
      header: "Pengguna",
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[13px] font-semibold">
            {u.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium">{u.name}</p>
            <p className="truncate font-mono text-xs text-fg-faint">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "peran",
      header: "Peran",
      render: (u) => (u.role === "admin" ? <Badge tone="accent">Admin</Badge> : <Badge>Pengguna</Badge>),
    },
    { key: "pesanan", header: "Pesanan", render: (u) => <span className="tabular-nums">{u.ordersCount}</span> },
    { key: "belanja", header: "Total Belanja", render: (u) => <span className="font-medium tabular-nums">{formatRupiah(u.totalSpent)}</span> },
    { key: "bergabung", header: "Bergabung", render: (u) => <span className="text-[13px] text-fg-muted">{formatDate(u.joinDate)}</span> },
    {
      key: "status",
      header: "Status",
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "aksi",
      header: "Aksi",
      className: "text-right",
      render: (u) =>
        u.role === "admin" ? (
          <span className="text-xs text-fg-faint">-</span>
        ) : u.status === "aktif" ? (
          <Button variant="ghost" size="sm" onClick={() => toggleStatus(u)}>
            <ShieldOff size={14} />
            Suspend
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => toggleStatus(u)}>
            Aktifkan
          </Button>
        ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Pengguna" description={`${users.length} akun terdaftar.`} />
      <AdminToolbar>
        <AdminSearchInput value={q} onChange={setQ} placeholder="Cari nama atau email…" />
        <AdminSelect
          label="Filter peran"
          value={role}
          onChange={setRole}
          options={[
            { value: "semua", label: "Semua Peran" },
            { value: "pengguna", label: "Pengguna" },
            { value: "admin", label: "Admin" },
          ]}
        />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} />
    </div>
  );
}