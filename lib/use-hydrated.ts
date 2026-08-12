import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/**
 * Bernilai `false` saat render server/hidrasi, lalu `true` setelah hidrasi
 * selesai di klien. Dipakai untuk menunda render sampai state dari
 * localStorage (keranjang, sessionStorage) terbaca, tanpa setState di effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, getTrue, getFalse);
}
