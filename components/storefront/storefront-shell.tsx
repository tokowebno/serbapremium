"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CursorGlow } from "./cursor-glow";

import { BottomNav } from "./bottom-nav";
import { TelegramFloat } from "./telegram-float";

/**
 * Membungkus storefront dengan navbar + footer + bottom nav mobile,
 * kecuali di area /pereman yang punya layout sendiri.
 * Transisi antar halaman: fade halus + geser tipis (tenang, bukan alay).
 */
export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/pereman");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <CursorGlow />
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <TelegramFloat />
      <BottomNav />
      <Footer />
    </>
  );
}
