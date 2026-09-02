import type { LucideIcon } from "lucide-react";

export type Platform = "Android" | "iOS" | "Windows" | "macOS" | "Linux" | "Web";

export type ScreenshotKey =
  | "editor"
  | "dashboard"
  | "mobile"
  | "audio"
  | "terminal"
  | "grid"
  | "form"
  | "analytics"
  | "video";

export interface AppIconConfig {
  from: string;
  to: string;
  /** Kunci glyph di iconRegistry — string agar serializable lintas RSC. */
  glyph: string;
  /** Nama file logo asli di /public/logos (opsional — fallback ke gradient+glyph). */
  logo?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  stock?: number;
  features?: string[];
  accessType?: string;
  isDefault?: boolean;
  badge?: string;
  description?: string;
}

export interface App {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  developerId: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  /** Stok produk (0 = habis). */
  stock: number;
  rating: number;
  ratingCount: number;
  downloads: number;
  platforms: Platform[];
  icon: AppIconConfig;
  screenshots: ScreenshotKey[];
  version: string;
  releasedAt: string;
  updatedAt: string;
  features: string[];
  requirements: Partial<Record<Platform, string>>;
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface Developer {
  id: string;
  slug: string;
  name: string;
  logo: AppIconConfig;
  description: string;
  website: string;
  location: string;
  joinDate: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface Review {
  id: string;
  appId: string;
  userName: string;
  rating: number;
  date: string;
  title?: string;
  content: string;
  verified: boolean;
  helpfulCount: number;
  status: "visible" | "hidden";
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: "aktif" | "suspend";
  role: "admin" | "pengguna";
  ordersCount: number;
  totalSpent: number;
}

export type PaymentStatus = "menunggu" | "dibayar" | "gagal" | "dibatalkan" | "dikembalikan";
export type OrderStatus = "diproses" | "selesai" | "dibatalkan";

export interface OrderItem {
  appId: string;
  platform: Platform;
  price: number;
}

export interface Order {
  id: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  date: string;
}

export type PromoType = "persen" | "nominal";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: PromoType;
  value: number;
  startDate: string;
  endDate: string;
  appIds: string[];
  categoryIds: string[];
  status: "aktif" | "nonaktif" | "terjadwal";
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  tone: "accent" | "graphite" | "warm";
  startDate: string;
  endDate: string;
  status: "aktif" | "nonaktif";
}

export interface ActivityLog {
  id: string;
  admin: string;
  action: string;
  target: string;
  date: string;
  status: "berhasil" | "gagal" | "pengingat";
}

export interface CartItem {
  appId: string;
  name: string;
  icon: AppIconConfig;
  platform: Platform;
  price: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}
