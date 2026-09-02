-- SerbaPremium: Skema Lengkap Database & Data Awal (Dijalankan di Supabase SQL Editor)

-- 1. TABEL PRODUK (products)
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  tagline text not null default '',
  description text not null default '',
  price integer not null default 0,
  original_price integer,
  stock integer not null default 0,
  category_id text not null default 'lainnya',
  rating numeric(2,1) not null default 4.8,
  rating_count integer not null default 0,
  downloads integer not null default 0,
  icon jsonb not null default '{}'::jsonb,
  platforms jsonb not null default '[]'::jsonb,
  version text not null default '1.0.0',
  released_at date not null default now(),
  updated_at date not null default now(),
  features jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '{}'::jsonb,
  variants jsonb default '[]'::jsonb,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
drop policy if exists "Produk bisa dibaca publik" on public.products;
create policy "Produk bisa dibaca publik" on public.products
  for select using (true);

drop policy if exists "Admin bisa insert/update produk" on public.products;
create policy "Admin bisa insert/update produk" on public.products
  for all using (true) with check (true);

-- 2. TABEL KATEGORI (categories)
create table if not exists public.categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null default ''
);

alter table public.categories enable row level security;
drop policy if exists "Kategori bisa dibaca publik" on public.categories;
create policy "Kategori bisa dibaca publik" on public.categories
  for select using (true);

-- 3. TABEL PESANAN (orders)
create table if not exists public.orders (
  id text primary key,
  user_name text not null,
  customer_email text,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  discount integer not null default 0,
  total integer not null default 0,
  payment_method text default 'qris',
  payment_status text not null default 'menunggu',
  order_status text not null default 'diproses',
  date date not null default now(),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
drop policy if exists "Pesanan bisa dilihat publik" on public.orders;
create policy "Pesanan bisa dilihat publik" on public.orders
  for select using (true);

drop policy if exists "Anon bisa insert pesanan" on public.orders;
create policy "Anon bisa insert pesanan" on public.orders
  for insert with check (true);

-- 4. TABEL ULASAN (reviews)
create table if not exists public.reviews (
  id text primary key,
  app_id text not null,
  user_name text not null,
  rating numeric(2,1) not null default 5.0,
  title text,
  content text not null default '',
  verified boolean not null default true,
  helpful_count integer not null default 0,
  status text not null default 'visible',
  date date not null default now(),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
drop policy if exists "Ulasan bisa dibaca publik" on public.reviews;
create policy "Ulasan bisa dibaca publik" on public.reviews
  for select using (true);

-- 5. SEED DATA KATEGORI
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
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description;
