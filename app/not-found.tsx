import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="tk-container flex flex-col items-center pt-40 pb-24 text-center">
      <p className="text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Halaman tidak ditemukan.</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-6 text-fg-muted">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <ButtonLink href="/" className="mt-8">
        Kembali ke Beranda
      </ButtonLink>
    </div>
  );
}
