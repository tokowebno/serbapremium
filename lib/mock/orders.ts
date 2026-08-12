import type { Order, OrderItem, Platform } from "@/types";
import { apps } from "./apps";
import { seededRandom } from "@/lib/utils";

const names = [
  "Dimas Pradana", "Sari Wulandari", "Raka Mahendra", "Citra Ramadhani", "Yoga Ardiansyah",
  "Fajar Nugroho", "Maya Dwi", "Eko Prasetyo", "Nadia Fitri", "Hendra Gunawan",
  "Putri Ayu", "Rizky Budiman", "Tasya Maharani", "Agus Triyono", "Bintang Kurnia",
  "Lina Tambunan", "Bayu Saputra", "Intan Permata", "Gilang Ramadhan", "Vina Oktavia",
];

const platforms: Platform[] = ["Android", "iOS", "Windows", "macOS", "Linux", "Web"];

const paymentPool: Order["paymentStatus"][] = ["dibayar", "dibayar", "dibayar", "dibayar", "menunggu", "gagal", "dibatalkan", "dikembalikan"];

function buildOrders(): Order[] {
  const rand = seededRandom(42);
  const orders: Order[] = [];
  let counter = 0;

  for (let i = 0; i < 36; i++) {
    const app = apps[Math.floor(rand() * apps.length)];
    const app2 = rand() > 0.72 ? apps[Math.floor(rand() * apps.length)] : null;
    const items: OrderItem[] = [
      { appId: app.id, platform: platforms[Math.floor(rand() * app.platforms.length)], price: app.price },
    ];
    if (app2) {
      items.push({ appId: app2.id, platform: platforms[Math.floor(rand() * app2.platforms.length)], price: app2.price });
    }
    const subtotal = items.reduce((s, it) => s + it.price, 0);
    const discount = rand() > 0.6 ? Math.round(subtotal * 0.25) : 0;
    const total = subtotal - discount;

    const date = new Date(2026, 0, 5 + Math.floor(rand() * 219));
    const iso = date.toISOString().slice(0, 10);

    counter += 1;
    orders.push({
      id: `TK-${(84200 + counter).toString()}`,
      userName: names[Math.floor(rand() * names.length)],
      items,
      subtotal,
      discount,
      total,
      paymentStatus: paymentPool[Math.floor(rand() * paymentPool.length)],
      orderStatus: "diproses",
      date: iso,
    });
  }

  // Pastikan pesanan terakhir tampil sebagai pesanan baru pengguna demo
  orders.sort((a, b) => (a.date < b.date ? 1 : -1));
  orders[0].id = "TK-84521";
  orders[0].userName = "Raka Mahendra";
  orders[0].items = [{ appId: "chatgpt-plus-1m-vietnamese-trial-nw", platform: "Web", price: 113850 }];
  orders[0].subtotal = 113850;
  orders[0].discount = 0;
  orders[0].total = 113850;
  orders[0].paymentStatus = "dibayar";
  orders[0].date = "2026-08-11";

  return orders;
}

export const orders: Order[] = buildOrders();
