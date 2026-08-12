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
import type { Platform } from "@/types";
import type { App } from "@/types";
import { ToastProvider } from "@/components/ui/toast";

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

/* ---------- Autentikasi ---------- */

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
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
}

interface LibraryValue {
  entries: LibraryEntry[];
  has: (appId: string) => boolean;
  add: (appId: string) => void;
}

const LibraryContext = createContext<LibraryValue | null>(null);

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary harus dipakai di dalam Providers");
  return ctx;
}

function usePersistedState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
    // Hidrasi dari localStorage — ditunda ke microtask agar tidak setState sinkron dalam effect.
    const raw = localStorage.getItem(key);
    if (raw) {
      queueMicrotask(() => {
        try {
          setState(JSON.parse(raw));
        } catch {
          /* data korup — biarkan state awal */
        }
      });
    }
  }, [key]);
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
  const [cart, setCart] = usePersistedState<CartEntry[]>("tokono:cart", []);
  const [wishlist, setWishlist] = usePersistedState<string[]>("tokono:wishlist", []);
  const [library, setLibrary] = usePersistedState<LibraryEntry[]>("tokono:library", []);
  const [authUser, setAuthUser] = usePersistedState<AuthUser | null>("tokono:user", null);

  useEffect(() => {
    const stored = localStorage.getItem("tokono:theme");
    // Default terang; gelap hanya jika pengguna pernah memilih gelap secara eksplisit.
    const initial = stored === "dark" ? "dark" : "light";
    // Ditunda agar tidak setState sinkron dalam effect.
    queueMicrotask(() => setTheme(initial));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
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
      add: (appId) => {
        if (library.some((e) => e.appId === appId)) return;
        setLibrary((prev) => [...prev, { appId, purchasedAt: new Date().toISOString().slice(0, 10) }]);
      },
    }),
    [library, setLibrary],
  );

  const authValue = useMemo<AuthValue>(
    () => ({
      user: authUser,
      login: (u) => setAuthUser(u),
      logout: () => setAuthUser(null),
    }),
    [authUser, setAuthUser],
  );

  return (
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>
        <CartContext.Provider value={cartValue}>
          <WishlistContext.Provider value={wishlistValue}>
            <LibraryContext.Provider value={libraryValue}>
              <ToastProvider>{children}</ToastProvider>
            </LibraryContext.Provider>
          </WishlistContext.Provider>
        </CartContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
