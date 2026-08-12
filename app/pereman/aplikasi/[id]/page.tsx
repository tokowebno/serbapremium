import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { AppForm } from "./app-form";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const app = api.apps.getBySlug(id);
  if (!app) return { title: "Aplikasi tidak ditemukan" };
  return { title: `Edit ${app.name}` };
}

export default async function AdminEditAppPage({ params }: Props) {
  const { id } = await params;
  const app = id === "baru" ? undefined : api.apps.getBySlug(id);
  if (id !== "baru" && !app) notFound();
  return <AppForm app={app} />;
}