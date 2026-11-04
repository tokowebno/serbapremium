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

/* ---------- Telegram WebApp Type ---------- */

interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  colorScheme?: "light" | "dark";
  ready?: () => void;
  expand?: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

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
  telegramId?: number;
  telegramUsername?: string;
  photoUrl?: string;
}

interface AuthValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isTelegramMiniApp: boolean;
  isAuthReady: boolean;
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

function buildTelegramAuthUser(tgUser: TelegramWebAppUser, existing?: AuthUser | null): AuthUser {
  const fullName =
    [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ").trim() ||
    tgUser.username ||
    `Telegram #${tgUser.id}`;
  const defaultEmail = tgUser.username ? `${tgUser.username}@t.me` : `tg${tgUser.id}@t.me`;
  const keepCustomEmail =
    existing &&
    existing.telegramId === tgUser.id &&
    existing.email &&
    existing.email.includes("@") &&
    !existing.email.endsWith("@t.me");

  return {
    name: fullName,
    email: keepCustomEmail ? existing.email : defaultEmail,
    telegramId: tgUser.id,
    telegramUsername: tgUser.username || undefined,
    photoUrl: tgUser.photo_url || existing?.photoUrl || undefined,
  };
}

function parseTelegramUserFromUrlFallback(): TelegramWebAppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const rawHash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
    const hashParams = new URLSearchParams(rawHash);
    const searchParams = new URLSearchParams(window.location.search);
    const tgWebAppData = hashParams.get("tgWebAppData") || searchParams.get("tgWebAppData");
    if (!tgWebAppData) return null;
    const dataParams = new URLSearchParams(tgWebAppData);
    const userJson = dataParams.get("user");
    if (!userJson) return null;
    const parsed = JSON.parse(userJson) as TelegramWebAppUser;
    return parsed?.id ? parsed : null;
  } catch {
    return null;
  }
}

function usePersistedState<T>(key: string, legacyKey: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  useEffect(() => {
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

  const [isTelegramMiniApp, setIsTelegramMiniApp] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

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

  // Auto-connect & Auto-login Telegram Mini App User seamlessly
  useEffect(() => {
    let cancelled = false;

    const connectTelegramSession = (tg: TelegramWebApp | undefined, fallbackUser: TelegramWebAppUser | null) => {
      try {
        tg?.ready?.();
        tg?.expand?.();
      } catch {
        /* ignore */
      }

      const tgUser = tg?.initDataUnsafe?.user || fallbackUser;
      if (!tgUser?.id) {
        if (!cancelled) setIsAuthReady(true);
        return false;
      }

      setIsTelegramMiniApp(true);

      // Isolate wallet/library state per Telegram account if switching accounts on the same device
      try {
        const prevTgId = localStorage.getItem("texasai:active_tg_id");
        const currTgId = String(tgUser.id);
        if (prevTgId && prevTgId !== currTgId) {
          // Snapshot previous TG account data
          localStorage.setItem(`texasai:tg:${prevTgId}:balance`, localStorage.getItem("texasai:balance") || "0");
          localStorage.setItem(`texasai:tg:${prevTgId}:transactions`, localStorage.getItem("texasai:transactions") || "[]");
          localStorage.setItem(`texasai:tg:${prevTgId}:library`, localStorage.getItem("texasai:library") || "[]");
          localStorage.setItem(`texasai:tg:${prevTgId}:cart`, localStorage.getItem("texasai:cart") || "[]");

          // Restore current TG account data (or clean defaults)
          const savedBal = Number(localStorage.getItem(`texasai:tg:${currTgId}:balance`) || "0");
          const savedTx = JSON.parse(localStorage.getItem(`texasai:tg:${currTgId}:transactions`) || "[]");
          const savedLib = JSON.parse(localStorage.getItem(`texasai:tg:${currTgId}:library`) || "[]");
          const savedCart = JSON.parse(localStorage.getItem(`texasai:tg:${currTgId}:cart`) || "[]");
          setUserBalance(Number.isFinite(savedBal) ? savedBal : 0);
          setTransactions(Array.isArray(savedTx) ? savedTx : []);
          setLibrary(Array.isArray(savedLib) ? savedLib : []);
          setCart(Array.isArray(savedCart) ? savedCart : []);
        }
        localStorage.setItem("texasai:active_tg_id", currTgId);
      } catch {
        /* ignore storage error */
      }

      let storedExisting: AuthUser | null = null;
      try {
        const rawUser = localStorage.getItem("texasai:user");
        if (rawUser) storedExisting = JSON.parse(rawUser) as AuthUser;
      } catch {
        /* ignore */
      }

      const immediateUser = buildTelegramAuthUser(tgUser, storedExisting);
      setAuthUser(immediateUser);
      setIsAuthReady(true);

      // Cryptographic HMAC-SHA256 verification via /api/auth/telegram in background
      if (tg?.initData) {
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (!cancelled && data?.ok && data?.user?.id) {
              setAuthUser((prev) => buildTelegramAuthUser(data.user, prev));
            }
          })
          .catch(() => {
            /* keep immediate Telegram WebApp session */
          });
      }

      return true;
    };

    const tgNow = window.Telegram?.WebApp;
    const urlFallbackUser = parseTelegramUserFromUrlFallback();

    if (connectTelegramSession(tgNow, urlFallbackUser)) {
      return () => {
        cancelled = true;
      };
    }

    // If URL hints we are inside Telegram WebView and SDK is still initializing, poll briefly
    const hasTgHint =
      window.location.hash.includes("tgWebApp") ||
      window.location.search.includes("tgWebApp");

    if (!hasTgHint) {
      queueMicrotask(() => {
        if (!cancelled) setIsAuthReady(true);
      });
      return () => {
        cancelled = true;
      };
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const tgRetry = window.Telegram?.WebApp;
      if (connectTelegramSession(tgRetry, parseTelegramUserFromUrlFallback()) || attempts >= 12) {
        window.clearInterval(timer);
        if (!cancelled) setIsAuthReady(true);
      }
    }, 80);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [setAuthUser, setCart, setLibrary, setTransactions, setUserBalance]);

  // Keep per-Telegram-account wallet & library snapshot synced
  useEffect(() => {
    if (!authUser?.telegramId) return;
    try {
      const tid = String(authUser.telegramId);
      localStorage.setItem(`texasai:tg:${tid}:balance`, JSON.stringify(userBalance));
      localStorage.setItem(`texasai:tg:${tid}:transactions`, JSON.stringify(transactions));
      localStorage.setItem(`texasai:tg:${tid}:library`, JSON.stringify(library));
      localStorage.setItem(`texasai:tg:${tid}:cart`, JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [authUser?.telegramId, userBalance, transactions, library, cart]);

  useEffect(() => {
    const stored =
      localStorage.getItem("texasai:theme") ||
      localStorage.getItem("gptluna:theme") ||
      localStorage.getItem("tokono:theme");
    const tgScheme = window.Telegram?.WebApp?.colorScheme;
    const initial = stored ? (stored === "dark" ? "dark" : "light") : tgScheme === "dark" ? "dark" : "light";
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

  const logout = useCallback(() => {
    // Inside Telegram Mini App, keep Telegram identity connected so user never gets locked out
    const tgUser = typeof window !== "undefined" ? window.Telegram?.WebApp?.initDataUnsafe?.user : undefined;
    if (tgUser?.id) {
      setAuthUser(buildTelegramAuthUser(tgUser, null));
      return;
    }
    setAuthUser(null);
  }, [setAuthUser]);

  const authValue = useMemo<AuthValue>(
    () => ({
      user: authUser,
      isAuthenticated: !!authUser,
      isTelegramMiniApp,
      isAuthReady,
      login: (u) => setAuthUser(u),
      logout,
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
    [
      authUser,
      isTelegramMiniApp,
      isAuthReady,
      setAuthUser,
      logout,
      userBalance,
      deposit,
      deduct,
      transactions,
      isTopUpOpen,
      topUpNeeded,
      openTopUp,
      closeTopUp,
    ],
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
