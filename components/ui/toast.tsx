"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: "success" | "error" | "info";
}

interface ToastContextValue {
  push: (t: Omit<ToastItem, "id" | "tone"> & { tone?: ToastItem["tone"] }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback<ToastContextValue["push"]>((t) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-2), { ...t, tone: t.tone ?? "success", id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3600);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5"
        role="region"
        aria-label="Notifikasi"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.tone];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto flex items-start gap-3 rounded-md border-2 border-border bg-surface p-4 shadow-[4px_4px_0px_var(--shadow-color)]"
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border-2 border-border ${
                    t.tone === "error"
                      ? "bg-discount text-white shadow-[1px_1px_0px_var(--shadow-color)]"
                      : t.tone === "info"
                        ? "bg-accent-blue text-white shadow-[1px_1px_0px_var(--shadow-color)]"
                        : "bg-accent text-black shadow-[1px_1px_0px_var(--shadow-color)]"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-5 text-fg">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-[13px] font-medium leading-5 text-fg-muted">{t.description}</p>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
