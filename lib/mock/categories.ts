import type { Category } from "@/types";
import {
  Bot,
  BookOpen,
  Briefcase,
  Camera,
  Database,
  Film,
  Gift,
  Heart,
  Mail,
  PenTool,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const categories: Category[] = [
  { id: "ai", slug: "ai", name: "AI & Chatbot", icon: Bot, description: "Chatbot, asisten AI, dan alat berbasis AI." },
  { id: "streaming", slug: "streaming", name: "Streaming", icon: Film, description: "Langganan premium platform streaming." },
  { id: "vpn", slug: "vpn", name: "VPN & Keamanan", icon: ShieldCheck, description: "Lindungi koneksi dan privasi Anda." },
  { id: "akun", slug: "akun", name: "Akun & Email", icon: Mail, description: "Akun siap pakai dan layanan email." },
  { id: "sosial", slug: "sosial", name: "Sosial Media", icon: Heart, description: "Tumbuhkan follower dan engagement." },
  { id: "developer", slug: "developer", name: "Developer & Cloud", icon: Database, description: "Tools pengembangan dan layanan cloud." },
  { id: "kreatif", slug: "kreatif", name: "Desain & Kreatif", icon: PenTool, description: "Alat desain, video, dan konten kreatif." },
  { id: "tools", slug: "tools", name: "Produktivitas", icon: Zap, description: "Aplikasi untuk bekerja lebih efisien." },
  { id: "lisensi", slug: "lisensi", name: "Lisensi & Kredit", icon: Gift, description: "Gift card, token, dan lisensi digital." },
  { id: "pendidikan", slug: "pendidikan", name: "Pendidikan", icon: BookOpen, description: "Platform belajar dan kursus online." },
];

export const categoriesByName = (name: string): Category | undefined =>
  categories.find((c) => c.name === name);

export const unusedCategoryIcons = [Briefcase, Camera] as const;
