"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, AdminSelect, AdminToolbar } from "@/components/admin/admin-header";
import { formatDateTime } from "@/lib/utils";
import type { ActivityLog } from "@/types";

export default function AdminAktivitasPage() {
  const all = api.activity.list();
  const [admin, setAdmin] = useState("semua");

  const admins = [...new Set(all.map((a) => a.admin))];

  const filtered = useMemo(
    () => (admin === "semua" ? all : all.filter((a) => a.admin === admin)),
    [all, admin],
  );

  const columns: Column<ActivityLog>[] = [
    { key: "admin", header: "Admin", render: (a) => <span className="text-[13px] font-medium">{a.admin}</span> },
    {
      key: "aktivitas",
      header: "Aktivitas",
      render: (a) => (
        <span className="text-[13px] text-fg-muted">
          {a.action} <span className="font-medium text-fg">{a.target}</span>
        </span>
      ),
    },
    { key: "waktu", header: "Waktu", render: (a) => <span className="text-[13px] text-fg-muted">{formatDateTime(a.date)}</span> },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Aktivitas" description={`${all.length} aktivitas tercatat.`} />
      <AdminToolbar>
        <AdminSelect
          label="Filter admin"
          value={admin}
          onChange={setAdmin}
          options={[{ value: "semua", label: "Semua Admin" }, ...admins.map((a) => ({ value: a, label: a }))]}
        />
      </AdminToolbar>
      <DataTable columns={columns} rows={filtered} />
    </div>
  );
}