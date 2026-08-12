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
import { apps } from "@/lib/mock/apps";
import { popularityOf } from "@/lib/mock/apps";
import { categories } from "@/lib/mock/categories";
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
      sorted.sort((a, b) => popularityOf(a.name) - popularityOf(b.name) || b.stock - a.stock);
  }
  // Produk stok habis selalu di akhir daftar, apa pun mode urutannya.
  return sorted.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0));
}

export const api = {
  apps: {
    list(filter: AppFilter = {}): App[] {
      let result = apps;
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
      return apps.find((a) => a.slug === slug);
    },
    featured(): App[] {
      // Unggulan dengan stok tersedia di depan, stok habis di belakang.
      return sortApps(apps.filter((a) => a.isFeatured), "popularitas");
    },
    /** Produk yang sedang masuk promo aktif (via promotions). */
    promo(): App[] {
      const active = mockPromotions.filter((p) => p.status === "aktif");
      const ids = new Set(active.flatMap((p) => p.appIds));
      return apps.filter((a) => ids.has(a.id) && a.stock > 0);
    },
    newArrivals(limit = 6): App[] {
      return sortApps(apps.filter((a) => a.isNew || a.isFeatured), "terbaru").slice(0, limit);
    },
    byCategory(categoryId: string): App[] {
      return apps.filter((a) => a.categoryId === categoryId);
    },
    byDeveloper(developerId: string): App[] {
      return apps.filter((a) => a.developerId === developerId);
    },
    related(app: App, limit = 4): App[] {
      const sameCat = apps.filter((a) => a.id !== app.id && a.categoryId === app.categoryId);
      const rest = apps.filter((a) => a.id !== app.id && a.categoryId !== app.categoryId);
      return [...sameCat, ...rest].slice(0, limit);
    },
    search(q: string, limit = 8): App[] {
      return this.list({ q, sort: "popularitas" }).slice(0, limit);
    },
  },

  categories: {
    list(): Category[] {
      return categories;
    },
    getBySlug(slug: string): Category | undefined {
      return categories.find((c) => c.slug === slug);
    },
    withCount(): Array<Category & { count: number }> {
      return categories.map((c) => ({ ...c, count: apps.filter((a) => a.categoryId === c.id).length }));
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
      return apps.length;
    },
    downloads(): number {
      return apps.reduce((sum, a) => sum + a.downloads, 0);
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
      return [...apps]
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, limit)
        .map((a) => ({ name: a.name, value: a.downloads }));
    },
    topCategories(limit = 6): Array<{ name: string; value: number }> {
      const map = new Map<string, number>();
      for (const a of apps) map.set(a.categoryId, (map.get(a.categoryId) ?? 0) + a.downloads);
      return [...map.entries()]
        .map(([id, value]) => ({
          name: categories.find((c) => c.id === id)?.name ?? id,
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
    },
  },
};

export type Api = typeof api;
