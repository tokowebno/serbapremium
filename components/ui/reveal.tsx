"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Muncul halus saat elemen masuk viewport — dipakai untuk section & kartu. */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-48px" }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/** Teks muncul per-kata (fade + naik halus) — untuk headline utama. */
export function StaggerWords({
  text,
  className,
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
          }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
