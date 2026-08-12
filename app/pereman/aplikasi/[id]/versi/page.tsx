import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { VersiManager } from "./versi-manager";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const app = api.apps.getBySlug(id);
  return { title: app ? `Versi ${app.name}` : "Versi Aplikasi" };
}

export default async function AdminVersiPage({ params }: Props) {
  const { id } = await params;
  const app = api.apps.getBySlug(id);
  if (!app) notFound();
  return <VersiManager app={app} />;
}