#!/usr/bin/env node
/* Generate SQL seed Supabase dari mock data Tokono.
   Jalankan: node scripts/generate-sql.mjs > scripts/seed-supabase.sql */
import { readFileSync } from "fs";

const src = readFileSync(new URL("../lib/mock/apps.ts", import.meta.url), "utf8");

// Ekstrak row: nama, harga final dihitung dari tier di apps.ts (import langsung lebih akurat)
const { apps } = await import(new URL("../lib/mock/apps.ts", import.meta.url).href);

const esc = (s) => s.replace(/'/g, "''");

const rows = apps
  .map(
    (a) => `('${esc(a.id)}','${esc(a.slug)}','${esc(a.name)}','${esc(a.tagline)}','${esc(a.description)}','${a.price}','${a.stock}','${esc(a.categoryId)}','${a.rating}','${a.ratingCount}','${a.downloads}','${esc(JSON.stringify(a.icon))}'::jsonb,'${esc(JSON.stringify(a.platforms))}'::jsonb,'${esc(a.version)}','${esc(a.releasedAt)}','${esc(a.updatedAt)}','${esc(JSON.stringify(a.features))}'::jsonb,'${esc(JSON.stringify(a.requirements))}'::jsonb,${a.isFeatured ? "true" : "false"},${a.isNew ? "true" : "false"})`,
  )
  .join(",\n  ");

const sql = `-- Tokono: skema + seed produk (dijalankan di Supabase SQL Editor)
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  price integer not null default 0,
  stock integer not null default 0,
  category_id text not null default 'lainnya',
  rating numeric(2,1) not null default 4.0,
  rating_count integer not null default 0,
  downloads integer not null default 0,
  icon jsonb not null default '{}'::jsonb,
  platforms jsonb not null default '[]'::jsonb,
  version text not null default '1.0.0',
  released_at date not null default now(),
  updated_at date not null default now(),
  features jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Baca publik: anon & authenticated boleh SELECT (toko frontend)
create policy "Produk bisa dibaca publik" on public.products
  for select using (true);

insert into public.products (id, slug, name, tagline, description, price, stock, category_id, rating, rating_count, downloads, icon, platforms, version, released_at, updated_at, features, requirements, is_featured, is_new)
values
  ${rows}
on conflict (id) do nothing;

-- Kategori
create table if not exists public.categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null default ''
);

alter table public.categories enable row level security;
create policy "Kategori bisa dibaca publik" on public.categories
  for select using (true);

insert into public.categories (id, slug, name, description)
values
  ('ai','ai','AI & Chatbot','Chatbot, asisten AI, dan alat berbasis AI.'),
  ('streaming','streaming','Streaming','Langganan premium platform streaming.'),
  ('vpn','vpn','VPN & Keamanan','Lindungi koneksi dan privasi Anda.'),
  ('akun','akun','Akun & Email','Akun siap pakai dan layanan email.'),
  ('sosial','sosial','Sosial Media','Tumbuhkan follower dan engagement.'),
  ('developer','developer','Developer & Cloud','Tools pengembangan dan layanan cloud.'),
  ('kreatif','kreatif','Desain & Kreatif','Alat desain, video, dan konten kreatif.'),
  ('tools','tools','Produktivitas','Aplikasi untuk bekerja lebih efisien.'),
  ('lisensi','lisensi','Lisensi & Kredit','Gift card, token, dan lisensi digital.'),
  ('pendidikan','pendidikan','Pendidikan','Platform belajar dan kursus online.')
on conflict (id) do nothing;

-- Pesanan (struktur awal — siap dipakai backend)
create table if not exists public.orders (
  id text primary key,
  user_name text not null,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  discount integer not null default 0,
  total integer not null default 0,
  payment_status text not null default 'menunggu',
  order_status text not null default 'diproses',
  date date not null default now(),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Pesanan bisa dilihat publik (demo)" on public.orders
  for select using (true);
`;

process.stdout.write(sql);