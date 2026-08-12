import type { App, Category } from "@/types";
import { apps as mockApps } from "@/lib/mock/apps";
import { categories as mockCategories } from "@/lib/mock/categories";
import { supabase, supabaseReady } from "@/lib/supabase";

/**
 * Cache data Tokono. Default: mock lokal.
 * Saat Supabase terkonfigurasi & tersambung, isi cache dari database.
 * Pemanggil api.* tidak perlu tahu sumber datanya.
 */

let products: App[] = mockApps;
let cats: Category[] = mockCategories;

export function getProducts(): App[] {
  return products;
}

export function getCategories(): Category[] {
  return cats;
}

/** Sinkronkan cache dari Supabase. Mengembalikan true jika berhasil. */
export async function syncFromSupabase(): Promise<boolean> {
  if (!supabaseReady) return false;
  try {
    const [pRes, cRes] = await Promise.all([
      supabase.from("products").select("*"),
      supabase.from("categories").select("*"),
    ]);
    if (pRes.error) throw pRes.error;
    if (cRes.data && cRes.data.length > 0) {
      products = (pRes.data as unknown as RawProduct[]).map(toApp);
      cats = (cRes.data as unknown as RawCategory[]).map(toCategory);
      return true;
    }
    return false;
  } catch {
    // Offline / tabel belum ada — biarkan mock.
    return false;
  }
}

interface RawProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  rating: number;
  rating_count: number;
  downloads: number;
  icon: App["icon"];
  platforms: App["platforms"];
  version: string;
  released_at: string;
  updated_at: string;
  features: string[];
  requirements: App["requirements"];
  is_featured: boolean;
  is_new: boolean;
}

function toApp(r: RawProduct): App {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    developerId: "tokono-store",
    categoryId: r.category_id,
    price: r.price,
    stock: r.stock,
    rating: Number(r.rating) || 4,
    ratingCount: r.rating_count,
    downloads: r.downloads,
    icon: r.icon ?? { from: "#333", to: "#111", glyph: "box", logo: "links.svg" },
    platforms: r.platforms ?? ["Web"],
    screenshots: ["dashboard", "form"],
    version: r.version ?? "1.0.0",
    releasedAt: r.released_at ?? "2026-01-01",
    updatedAt: r.updated_at ?? "2026-08-01",
    features: r.features ?? [],
    requirements: r.requirements ?? {},
    isFeatured: r.is_featured,
    isNew: r.is_new,
  };
}

interface RawCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

function toCategory(r: RawCategory): Category {
  const mock = mockCategories.find((c) => c.id === r.id);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    icon: mock?.icon ?? (mockCategories[0]?.icon as Category["icon"]),
  };
}