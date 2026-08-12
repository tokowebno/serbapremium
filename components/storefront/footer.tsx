import Link from "next/link";
import { api } from "@/lib/api";

export function Footer() {
  const year = new Date().getFullYear();
  const categoriesWithCount = api.categories.withCount();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="tk-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="Tokono — Beranda">
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-fg">
              <span className="block h-3 w-3 rounded-[3px] border-[1.5px] border-bg" />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">Tokono</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-fg-muted">
            Marketplace aplikasi premium untuk semua perangkat. Pembelian satu kali, tanpa langganan.
          </p>
        </div>

        <nav aria-label="Jelajahi">
          <h3 className="text-[13px] font-semibold tracking-wide text-fg">Jelajahi</h3>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/aplikasi">Semua Aplikasi</Link></li>
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/promo">Promo</Link></li>
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/aplikasi">Aplikasi Pilihan</Link></li>
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/akun/koleksi">Koleksi Saya</Link></li>
          </ul>
        </nav>

        <nav aria-label="Kategori">
          <h3 className="text-[13px] font-semibold tracking-wide text-fg">Kategori</h3>
          <ul className="mt-3 space-y-2">
            {categoriesWithCount
              .filter((c) => c.count > 0)
              .slice(0, 6)
              .map((c) => (
                <li key={c.id}>
                  <Link className="text-sm text-fg-muted transition-colors hover:text-fg" href={`/kategori/${c.slug}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-[13px] font-semibold tracking-wide text-fg">Bantuan</h3>
          <ul className="mt-3 space-y-2">
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/keranjang">Keranjang</Link></li>
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/cek-pesanan">Cek Pesanan</Link></li>
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/akun/koleksi">Koleksi Saya</Link></li>
            <li><Link className="text-sm text-fg-muted transition-colors hover:text-fg" href="/promo">Promo</Link></li>
          </ul>
          <p className="mt-6 text-xs leading-5 text-fg-faint">
            Seluruh aplikasi adalah contoh fiktif untuk keperluan demo.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="tk-container flex flex-wrap items-center justify-between gap-2 py-5">
          <p className="text-[13px] text-fg-muted">© {year} Tokono. Semua hak dilindungi.</p>
          <p className="text-[13px] text-fg-faint">Dibuat dengan hati di Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
