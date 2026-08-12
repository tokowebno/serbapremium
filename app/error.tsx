"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="tk-container flex flex-col items-center pt-40 pb-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Terjadi kesalahan.</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-6 text-fg-muted">
        Ada masalah saat memuat halaman ini. Silakan coba lagi.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={retry}>Coba Lagi</Button>
        <ButtonLink href="/" variant="secondary">
          Kembali ke Beranda
        </ButtonLink>
      </div>
    </div>
  );
}
