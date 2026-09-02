import type { App, Category, ProductVariant } from "@/types";
import { apps as mockApps, brandLogo } from "@/lib/mock/apps";
import { categories as mockCategories } from "@/lib/mock/categories";
import { supabase, supabaseReady } from "@/lib/supabase";

/**
 * Cache data SerbaPremium.
 * Default: mock katalog default (seluruh produk & varian lengkap).
 * Saat Supabase tersambung, data dari Supabase di-merge di atas katalog default,
 * sehingga produk yang diedit harga/stoknya akan ter-update, dan produk lainnya tidak hilang.
 */

let products: App[] = [...mockApps];
let cats: Category[] = [...mockCategories];

export function getProducts(): App[] {
  return products;
}

export function getCategories(): Category[] {
  return cats;
}

export function updateProductInCache(updated: App) {
  const idx = products.findIndex((p) => p.id === updated.id || p.slug === updated.slug);
  if (idx >= 0) {
    products[idx] = { ...products[idx], ...updated };
  } else {
    products.unshift(updated);
  }
}

export function getBrandKey(str: string): string {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (s.includes("chatgpt") || s.includes("gpt")) return "chatgpt";
  if (s.includes("gemini")) return "gemini";
  if (s.includes("claude")) return "claude";
  if (s.includes("spotify")) return "spotify";
  if (s.includes("netflix")) return "netflix";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("disney")) return "disney";
  if (s.includes("canva")) return "canva";
  if (s.includes("capcut")) return "capcut";
  if (s.includes("cursor")) return "cursor";
  if (s.includes("notion")) return "notion";
  if (s.includes("nord")) return "nord";
  if (s.includes("surfshark")) return "surfshark";
  if (s.includes("duolingo")) return "duolingo";
  if (s.includes("coursera")) return "coursera";
  if (s.includes("microsoft")) return "microsoft";
  if (s.includes("perplexity")) return "perplexity";
  if (s.includes("elevenlabs")) return "elevenlabs";
  if (s.includes("discord")) return "discord";
  if (s.includes("robux") || s.includes("roblox")) return "robux";
  if (s.includes("steam")) return "steam";
  if (s.includes("instagram")) return "instagram";
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("supabase")) return "supabase";
  if (s.includes("replit")) return "replit";
  if (s.includes("railway")) return "railway";
  if (s.includes("n8n")) return "n8n";
  if (s.includes("linear")) return "linear";
  if (s.includes("posthog")) return "posthog";
  return s;
}

/** Sinkronkan cache dari Supabase. Menggabungkan data Supabase dengan katalog default dan deduplikasi ketat. */
export async function syncFromSupabase(): Promise<boolean> {
  if (!supabaseReady) return false;
  try {
    const fetchPromise = Promise.all([
      supabase.from("products").select("*"),
      supabase.from("categories").select("*"),
    ]);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    if (!result) return false;

    const [pRes, cRes] = result;

    let synced = false;

    if (!pRes.error && pRes.data && pRes.data.length > 0) {
      const dbProducts = (pRes.data as unknown as RawProduct[]).map(toApp);

      // Merge: Ambil semua produk default dari mockApps, timpa dengan data database jika ada
      const merged: App[] = mockApps.map((mock) => {
        const mockKey = getBrandKey(mock.name + " " + mock.slug);
        const dbMatch = dbProducts.find((p) => {
          if (p.id === mock.id || p.slug === mock.slug) return true;
          return getBrandKey(p.name + " " + p.slug) === mockKey;
        });
        if (!dbMatch) return mock;
        return {
          ...mock,
          ...dbMatch,
          id: mock.id,
          slug: mock.slug,
          variants: (dbMatch.variants && dbMatch.variants.length > 0) ? dbMatch.variants : (mock.variants && mock.variants.length > 0) ? mock.variants : undefined,
          icon: {
            ...mock.icon,
            ...dbMatch.icon,
            logo: brandLogo(mock.name),
            from: mock.icon.from || dbMatch.icon.from,
            to: mock.icon.to || dbMatch.icon.to,
          },
          rating: dbMatch.rating > 4.0 && dbMatch.rating <= 5.0 ? dbMatch.rating : mock.rating,
        };
      });

      // Tambahkan produk baru yang benar-benar independen (bukan varian brand yang sudah ada)
      for (const dbProd of dbProducts) {
        const dbKey = getBrandKey(dbProd.name + " " + dbProd.slug);
        const exists = merged.some((m) => {
          if (m.id === dbProd.id || m.slug === dbProd.slug) return true;
          return getBrandKey(m.name + " " + m.slug) === dbKey;
        });
        if (!exists) {
          merged.push({
            ...dbProd,
            icon: {
              ...dbProd.icon,
              logo: brandLogo(dbProd.name),
            },
            rating: dbProd.rating > 4.0 && dbProd.rating <= 5.0 ? dbProd.rating : 4.8,
          });
        }
      }

      products = merged;
      synced = true;
    }

    if (!cRes.error && cRes.data && cRes.data.length > 0) {
      cats = (cRes.data as unknown as RawCategory[]).map(toCategory);
      synced = true;
    }

    return synced;
  } catch {
    // Offline / tabel belum ada — biarkan mock lengkap.
    return false;
  }
}

export interface RawProduct {
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
  variants?: ProductVariant[];
}

export function toApp(r: RawProduct): App {
  const canonicalLogo = brandLogo(r.name);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    developerId: "serbapremium-store",
    categoryId: r.category_id,
    price: r.price,
    stock: r.stock,
    rating: Number(r.rating) || 4.8,
    ratingCount: r.rating_count,
    downloads: r.downloads,
    icon: {
      from: r.icon?.from || "#333",
      to: r.icon?.to || "#111",
      glyph: r.icon?.glyph || "box",
      logo: canonicalLogo || r.icon?.logo || "links.svg",
    },
    platforms: r.platforms ?? ["Web"],
    screenshots: ["dashboard", "form"],
    version: r.version ?? "1.0.0",
    releasedAt: r.released_at ?? "2026-01-01",
    updatedAt: r.updated_at ?? "2026-08-01",
    features: r.features ?? [],
    requirements: r.requirements ?? {},
    isFeatured: r.is_featured,
    isNew: r.is_new,
    variants: r.variants,
  };
}

export interface RawCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export function toCategory(r: RawCategory): Category {
  const mock = mockCategories.find((c) => c.id === r.id);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    icon: mock?.icon ?? (mockCategories[0]?.icon as Category["icon"]),
  };
}