"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Cahaya cair yang mengikuti cursor (spring halus).
 * Mode video: set VIDEO_MODE = true lalu taruh file public/cursor-video.mp4
 * → lingkaran video preview mengikuti cursor.
 * Mode default: spotlight gradient yang berdenyut sangat halus.
 * Hanya aktif di perangkat dengan mouse; mati otomatis saat "kurangi gerakan".
 */
const VIDEO_MODE = false;

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const springX = useSpring(x, { stiffness: 240, damping: 28, mass: 0.7 });
  const springY = useSpring(y, { stiffness: 240, damping: 28, mass: 0.7 });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[5]"
      style={{ x: springX, y: springY }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        {VIDEO_MODE ? (
          <video
            src="/cursor-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-40 w-40 rounded-2xl border border-white/20 object-cover shadow-xl"
          />
        ) : (
          <motion.div
            className="h-80 w-80 rounded-full"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, color-mix(in srgb, var(--star) 6%, transparent) 40%, transparent 65%)",
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
