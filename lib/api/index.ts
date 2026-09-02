/**
 * Batas API Tokono.
 *
 * ponytail: seluruh data berasal dari mock in-memory. Saat backend tersedia,
 * ganti isi fungsi di bawah dengan fetch — kontrak tipe dan pemanggil tidak berubah.
 */
import type {
  App,
  Banner,
  Category,
  ChartPoint,
  Developer,
  Order,
  Platform,
  Promotion,
  Review,
  UserAccount,
} from "@/types";
import { getProducts, getCategories, updateProductInCache } from "@/lib/data-cache";
import { supabase, supabaseReady } from "@/lib/supabase";
import { popularityOf } from "@/lib/mock/apps";
import { developers } from "@/lib/mock/developers";
import { reviews } from "@/lib/mock/reviews";
import { orders as mockOrders } from "@/lib/mock/orders";
import { users as mockUsers } from "@/lib/mock/users";
import { promotions as mockPromotions } from "@/lib/mock/promotions";
import { banners as mockBanners } from "@/lib/mock/promotions";
import { activity as mockActivity } from "@/lib/mock/activity";
import { seededRandom } from "@/lib/utils";
import type { ActivityLog } from "@/types";

export type SortKey = "popularitas" | "terbaru" | "terlaris" | "harga-rendah" | "harga-tinggi" | "rating";

export interface AppFilter {
  q?: string;
  category?: string;
  platform?: Platform;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  promoOnly?: boolean;
  sort?: SortKey;
}

function sortApps(list: App[], sort?: SortKey): App[] {
  const s = sort ?? "popularitas";
  const sorted = [...list];
  switch (s) {
    case "terbaru":
      sorted.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      break;
    case "terlaris":
      sorted.sort((a, b) => b.downloads - a.downloads);
      break;
    case "harga-rendah":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "harga-tinggi":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // Populer = peringkat kurasi (produk yang paling sering dibeli), lalu stok.
      sorted.sort((a, b) => {
        const diff = popularityOf(a.name) - popularityOf(b.name);
        if (diff !== 0) return diff;
        return b.stock - a.stock;
      });
  }
  // Produk stok habis selalu di akhir daftar, apa pun mode urutannya.
  return sorted.sort((a, b) => {
    const aStock = a.stock > 0 ? 1 : 0;
    const bStock = b.stock > 0 ? 1 : 0;
    return bStock - aStock;
  });
}

export const api = {
  apps: {
    list(filter: AppFilter = {}): App[] {
      let result = getProducts();
      if (filter.q) {
        const q = filter.q.toLowerCase();
        result = result.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.tagline.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q),
        );
      }
      if (filter.category) result = result.filter((a) => a.categoryId === filter.category);
      if (filter.platform) result = result.filter((a) => a.platforms.includes(filter.platform!));
      if (filter.minPrice != null) result = result.filter((a) => a.price >= filter.minPrice!);
      if (filter.maxPrice != null) result = result.filter((a) => a.price <= filter.maxPrice!);
      if (filter.minRating != null) result = result.filter((a) => a.rating >= filter.minRating!);
      if (filter.promoOnly) result = result.filter((a) => a.originalPrice != null);
      return sortApps(result, filter.sort);
    },
    getBySlug(slug: string): App | undefined {
      return getProducts().find(
        (a) =>
          a.slug === slug ||
          a.id === slug ||
          (slug === "chatgpt-plus" && a.slug.includes("chatgpt-plus")) ||
          (slug === "chatgpt-plus-apple-pay" && a.slug.includes("chatgpt"))
      );
    },
    getById(id: string): App | undefined {
      return getProducts().find((a) => a.id === id || a.slug === id);
    },
    featured(): App[] {
      // Unggulan dengan stok tersedia di depan, stok habis di belakang.
      return sortApps(getProducts().filter((a) => a.isFeatured), "popularitas");
    },
    /** Produk yang sedang masuk promo aktif (via promotions). */
    promo(): App[] {
      const active = mockPromotions.filter((p) => p.status === "aktif");
      const ids = new Set(active.flatMap((p) => p.appIds));
      return getProducts().filter((a) => ids.has(a.id) && a.stock > 0);
    },
    newArrivals(limit = 6): App[] {
      return sortApps(getProducts().filter((a) => a.isNew || a.isFeatured), "terbaru").slice(0, limit);
    },
    byCategory(categoryId: string): App[] {
      return getProducts().filter((a) => a.categoryId === categoryId);
    },
    byDeveloper(developerId: string): App[] {
      return getProducts().filter((a) => a.developerId === developerId);
    },
    related(app: App, limit = 4): App[] {
      const sameCat = getProducts().filter((a) => a.id !== app.id && a.categoryId === app.categoryId);
      const rest = getProducts().filter((a) => a.id !== app.id && a.categoryId !== app.categoryId);
      return [...sameCat, ...rest].slice(0, limit);
    },
    search(q: string, limit = 8): App[] {
      return this.list({ q, sort: "popularitas" }).slice(0, limit);
    },
    async update(id: string, partial: Partial<App>): Promise<boolean> {
      const existing = getProducts().find((a) => a.id === id || a.slug === id);
      if (!existing) return false;
      const updated: App = { ...existing, ...partial };
      updateProductInCache(updated);

      if (supabaseReady) {
        try {
          await supabase.from("products").upsert({
            id: updated.id,
            slug: updated.slug,
            name: updated.name,
            tagline: updated.tagline,
            description: updated.description,
            price: updated.price,
            stock: updated.stock,
            category_id: updated.categoryId,
            rating: updated.rating,
            rating_count: updated.ratingCount,
            downloads: updated.downloads,
            icon: updated.icon,
            platforms: updated.platforms,
            version: updated.version,
            features: updated.features,
            requirements: updated.requirements,
            variants: updated.variants,
            is_featured: updated.isFeatured,
            is_new: updated.isNew,
          });
        } catch (e) {
          console.error("Supabase app update failed:", e);
        }
      }
      return true;
    },
    async create(newApp: App): Promise<boolean> {
      updateProductInCache(newApp);
      if (supabaseReady) {
        try {
          await supabase.from("products").insert({
            id: newApp.id,
            slug: newApp.slug,
            name: newApp.name,
            tagline: newApp.tagline,
            description: newApp.description,
            price: newApp.price,
            stock: newApp.stock,
            category_id: newApp.categoryId,
            rating: newApp.rating,
            rating_count: newApp.ratingCount,
            downloads: newApp.downloads,
            icon: newApp.icon,
            platforms: newApp.platforms,
            version: newApp.version,
            features: newApp.features,
            requirements: newApp.requirements,
            variants: newApp.variants,
            is_featured: newApp.isFeatured,
            is_new: newApp.isNew,
          });
        } catch (e) {
          console.error("Supabase app insert failed:", e);
        }
      }
      return true;
    },
  },

  categories: {
    list(): Category[] {
      return getCategories();
    },
    getBySlug(slug: string): Category | undefined {
      return getCategories().find((c) => c.slug === slug);
    },
    withCount(): Array<Category & { count: number }> {
      return getCategories().map((c) => ({ ...c, count: getProducts().filter((a) => a.categoryId === c.id).length }));
    },
  },

  developers: {
    list(): Developer[] {
      return developers;
    },
    getBySlug(slug: string): Developer | undefined {
      return developers.find((d) => d.slug === slug);
    },
  },

  reviews: {
    byApp(appId: string): Review[] {
      return reviews.filter((r) => r.appId === appId && r.status === "visible");
    },
    all(): Review[] {
      return reviews;
    },
  },

  orders: {
    list(): Order[] {
      return mockOrders;
    },
  },

  users: {
    list(): UserAccount[] {
      return mockUsers;
    },
  },

  promotions: {
    list(): Promotion[] {
      return mockPromotions;
    },
  },

  banners: {
    list(): Banner[] {
      return mockBanners;
    },
    active(): Banner[] {
      return mockBanners.filter((b) => b.status === "aktif");
    },
  },

  activity: {
    list(): ActivityLog[] {
      return mockActivity;
    },
  },

  stats: {
    revenue(): number {
      return mockOrders
        .filter((o) => o.paymentStatus === "dibayar")
        .reduce((sum, o) => sum + o.total, 0);
    },
    ordersCount(): number {
      return mockOrders.length;
    },
    usersCount(): number {
      return mockUsers.filter((u) => u.role === "pengguna").length;
    },
    appsCount(): number {
      return getProducts().length;
    },
    downloads(): number {
      return getProducts().reduce((sum, a) => sum + a.downloads, 0);
    },
  },

  charts: {
    revenueSeries(): ChartPoint[] {
      const rand = seededRandom(7);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu"];
      let acc = 21_000_000;
      return months.map((label) => {
        acc = Math.round(acc * (1.06 + rand() * 0.22));
        return { label, value: acc };
      });
    },
    ordersSeries(): ChartPoint[] {
      const rand = seededRandom(11);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu"];
      let acc = 110;
      return months.map((label) => {
        acc = Math.round(acc * (1.02 + rand() * 0.3));
        return { label, value: acc };
      });
    },
    usersSeries(): ChartPoint[] {
      const rand = seededRandom(23);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu"];
      let acc = 820;
      return months.map((label) => {
        acc = Math.round(acc * (1.04 + rand() * 0.16));
        return { label, value: acc };
      });
    },
    topApps(limit = 6): Array<{ name: string; value: number }> {
      return [...getProducts()]
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, limit)
        .map((a) => ({ name: a.name, value: a.downloads }));
    },
    topCategories(limit = 6): Array<{ name: string; value: number }> {
      const map = new Map<string, number>();
      for (const a of getProducts()) map.set(a.categoryId, (map.get(a.categoryId) ?? 0) + a.downloads);
      return [...map.entries()]
        .map(([id, value]) => ({
          name: getCategories().find((c) => c.id === id)?.name ?? id,
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
    },
  },
};

export type Api = typeof api;
