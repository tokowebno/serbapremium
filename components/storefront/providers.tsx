"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import type { Platform } from "@/types";
import type { App } from "@/types";
import { ToastProvider } from "@/components/ui/toast";
import { USDT_RATE } from "@/lib/utils";

/* ---------- Tema ---------- */

interface ThemeValue {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam Providers");
  return ctx;
}

/* ---------- Keranjang ---------- */

export interface CartEntry {
  appId: string;
  name: string;
  icon: App["icon"];
  platform: Platform;
  price: number;
}

interface CartValue {
  items: CartEntry[];
  count: number;
  subtotal: number;
  add: (app: App, platform: Platform) => void;
  remove: (appId: string, platform: Platform) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam Providers");
  return ctx;
}

/* ---------- Daftar keinginan ---------- */

interface WishlistValue {
  ids: string[];
  has: (appId: string) => boolean;
  toggle: (appId: string) => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist harus dipakai di dalam Providers");
  return ctx;
}

/* ---------- Autentikasi & Dompet Saldo ---------- */

export interface WalletTransaction {
  id: string;
  type: "deposit" | "purchase";
  amount: number; // in IDR
  amountUsd: number; // in USD
  title: string;
  date: string;
  orderCode?: string;
  status: "success" | "pending";
}

export interface AuthUser {
  name: string;
  email: string;
  balance?: number;
}

interface AuthValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  balance: number;
  balanceUsd: number;
  deposit: (amountIdr: number, title?: string, orderCode?: string) => void;
  deduct: (amountIdr: number, title?: string, orderCode?: string) => boolean;
  transactions: WalletTransaction[];
  isTopUpOpen: boolean;
  topUpNeeded: number | null;
  openTopUp: (neededIdr?: number) => void;
  closeTopUp: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam Providers");
  return ctx;
}

/* ---------- Koleksi (setelah pembelian) ---------- */

interface LibraryEntry {
  appId: string;
  purchasedAt: string;
  licenseKey?: string;
  accountEmail?: string;
  accountPassword?: string;
}

interface LibraryValue {
  entries: LibraryEntry[];
  has: (appId: string) => boolean;
  add: (appId: string, extra?: Partial<LibraryEntry>) => void;
}

const LibraryContext = createContext<LibraryValue | null>(null);

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary harus dipakai di dalam Providers");
  return ctx;
}

function usePersistedState<T>(key: string, legacyKey: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    // Hidrasi dari localStorage — ditunda ke microtask agar tidak setState sinkron dalam effect.
    const raw = localStorage.getItem(key) || localStorage.getItem(legacyKey);
    if (raw) {
      queueMicrotask(() => {
        try {
          setState(JSON.parse(raw));
        } catch {
          /* data korup — biarkan state awal */
        }
      });
    }
  }, [key, legacyKey]);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage penuh — abaikan */
    }
  }, [key, state]);
  return [state, setState];
}

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [cart, setCart] = usePersistedState<CartEntry[]>("texasai:cart", "gptluna:cart", []);
  const [wishlist, setWishlist] = usePersistedState<string[]>("texasai:wishlist", "gptluna:wishlist", []);
  const [library, setLibrary] = usePersistedState<LibraryEntry[]>("texasai:library", "gptluna:library", []);
  const [authUser, setAuthUser] = usePersistedState<AuthUser | null>("texasai:user", "gptluna:user", null);
  const [userBalance, setUserBalance] = usePersistedState<number>("texasai:balance", "gptluna:balance", 0);
  const [transactions, setTransactions] = usePersistedState<WalletTransaction[]>("texasai:transactions", "gptluna:transactions", []);

  // Top Up Modal State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpNeeded, setTopUpNeeded] = useState<number | null>(null);

  const openTopUp = useCallback((neededIdr?: number) => {
    setTopUpNeeded(neededIdr || null);
    setIsTopUpOpen(true);
  }, []);

  const closeTopUp = useCallback(() => {
    setIsTopUpOpen(false);
    setTopUpNeeded(null);
  }, []);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const custom = e as CustomEvent<{ needed?: number }>;
      openTopUp(custom.detail?.needed);
    };
    window.addEventListener("open-topup-modal", handleOpen);
    return () => window.removeEventListener("open-topup-modal", handleOpen);
  }, [openTopUp]);

  useEffect(() => {
    const stored = localStorage.getItem("texasai:theme") || localStorage.getItem("gptluna:theme") || localStorage.getItem("tokono:theme");
    // Default terang; gelap hanya jika pengguna pernah memilih gelap secara eksplisit.
    const initial = stored === "dark" ? "dark" : "light";
    // Ditunda agar tidak setState sinkron dalam effect.
    queueMicrotask(() => setTheme(initial));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("texasai:theme", theme);
    } catch {
      /* abaikan */
    }
  }, [theme]);

  const themeValue = useMemo<ThemeValue>(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  const addToCart = useCallback((app: App, platform: Platform) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.appId === app.id && i.platform === platform);
      if (existing) return prev;
      return [...prev, { appId: app.id, name: app.name, icon: app.icon, platform, price: app.price }];
    });
  }, [setCart]);

  const cartValue = useMemo<CartValue>(() => {
    const subtotal = cart.reduce((s, i) => s + i.price, 0);
    return {
      items: cart,
      count: cart.length,
      subtotal,
      add: addToCart,
      remove: (appId, platform) =>
        setCart((prev) => prev.filter((i) => !(i.appId === appId && i.platform === platform))),
      clear: () => setCart([]),
    };
  }, [cart, addToCart, setCart]);

  const wishlistValue = useMemo<WishlistValue>(
    () => ({
      ids: wishlist,
      has: (appId) => wishlist.includes(appId),
      toggle: (appId) =>
        setWishlist((prev) => (prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId])),
    }),
    [wishlist, setWishlist],
  );

  const libraryValue = useMemo<LibraryValue>(
    () => ({
      entries: library,
      has: (appId) => library.some((e) => e.appId === appId),
      add: (appId, extra) => {
        setLibrary((prev) => [
          ...prev.filter((e) => e.appId !== appId),
          { appId, purchasedAt: new Date().toISOString().slice(0, 10), ...extra },
        ]);
      },
    }),
    [library, setLibrary],
  );

  const deposit = useCallback(
    (amountIdr: number, title?: string, orderCode?: string) => {
      setUserBalance((prev) => prev + amountIdr);
      setTransactions((prev) => [
        {
          id: `tx-dep-${Date.now()}`,
          type: "deposit",
          amount: amountIdr,
          amountUsd: Number((amountIdr / USDT_RATE).toFixed(2)),
          title: title || "Top Up Saldo Akun",
          date: new Date().toISOString(),
          orderCode,
          status: "success",
        },
        ...prev,
      ]);
    },
    [setUserBalance, setTransactions],
  );

  const deduct = useCallback(
    (amountIdr: number, title?: string, orderCode?: string): boolean => {
      if (userBalance < amountIdr) {
        return false;
      }
      setUserBalance((prev) => Math.max(0, prev - amountIdr));
      setTransactions((prev) => [
        {
          id: `tx-buy-${Date.now()}`,
          type: "purchase",
          amount: amountIdr,
          amountUsd: Number((amountIdr / USDT_RATE).toFixed(2)),
          title: title || "Pembelian Produk",
          date: new Date().toISOString(),
          orderCode,
          status: "success",
        },
        ...prev,
      ]);
      return true;
    },
    [userBalance, setUserBalance, setTransactions],
  );

  const authValue = useMemo<AuthValue>(
    () => ({
      user: authUser,
      isAuthenticated: !!authUser,
      login: (u) => setAuthUser(u),
      logout: () => setAuthUser(null),
      balance: userBalance,
      balanceUsd: Number((userBalance / USDT_RATE).toFixed(2)),
      deposit,
      deduct,
      transactions,
      isTopUpOpen,
      topUpNeeded,
      openTopUp,
      closeTopUp,
    }),
    [authUser, setAuthUser, userBalance, deposit, deduct, transactions, isTopUpOpen, topUpNeeded, openTopUp, closeTopUp],
  );

  return (
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        <CartContext.Provider value={cartValue}>
          <WishlistContext.Provider value={wishlistValue}>
            <LibraryContext.Provider value={libraryValue}>
              <MotionConfig reducedMotion="user">
                <ToastProvider>{children}</ToastProvider>
              </MotionConfig>
            </LibraryContext.Provider>
          </WishlistContext.Provider>
        </CartContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
