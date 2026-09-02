import type { Developer } from "@/types";

export const developers: Developer[] = [
  {
    id: "tokono-store",
    slug: "tokono-store",
    name: "SerbaPremium Store",
    logo: { from: "#1b1a17", to: "#0d0d0b", glyph: "box" },
    description:
      "Toko resmi SerbaPremium — lisensi digital premium dengan pengiriman instan dan garansi penggantian.",
    website: "https://tokono.example",
    location: "Jakarta, Indonesia",
    joinDate: "2024-01-01",
  },
  {
    id: "partner-premium",
    slug: "partner-premium",
    name: "Partner Premium",
    logo: { from: "#12694f", to: "#0b4434", glyph: "shield-check" },
    description:
      "Penyedia lisensi streaming dan AI dari partner resmi yang terverifikasi.",
    website: "https://partner.tokono.example",
    location: "Bandung, Indonesia",
    joinDate: "2024-03-15",
  },
  {
    id: "verified-seller",
    slug: "verified-seller",
    name: "Verified Seller",
    logo: { from: "#26465e", to: "#172e3d", glyph: "badge-check" },
    description:
      "Penjual terverifikasi untuk akun, email, dan layanan sosial media.",
    website: "https://verified.tokono.example",
    location: "Surabaya, Indonesia",
    joinDate: "2024-06-01",
  },
  {
    id: "cloud-reseller",
    slug: "cloud-reseller",
    name: "Cloud Reseller",
    logo: { from: "#3a3f45", to: "#22262b", glyph: "server" },
    description:
      "Khusus layanan developer, cloud, dan API token dengan dukungan teknis.",
    website: "https://cloud.tokono.example",
    location: "Yogyakarta, Indonesia",
    joinDate: "2024-09-20",
  },
];
