import type { ScreenshotKey } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Pratinjau antarmuka aplikasi — pengganti screenshot asli untuk mock.
 * ponytail: saat backend punya gambar sungguhan, ganti dengan <Image>.
 */
export function MockScreenshot({
  variant,
  accent,
  className,
}: {
  variant: ScreenshotKey;
  accent: string;
  className?: string;
}) {
  const windowFrame = (
    <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <div className="ml-3 h-4 flex-1 rounded bg-white/10" />
    </div>
  );

  const bar = (w: string, i: number, light = false) => (
    <div
      key={i}
      className={cn("h-2 rounded", light ? "bg-white/25" : "bg-white/15")}
      style={{ width: w }}
    />
  );

  return (
    <div
      className={cn("overflow-hidden rounded-lg border border-white/10 shadow-md", className)}
      style={{ background: `linear-gradient(150deg, ${accent}cc, ${accent}66)` }}
    >
      {windowFrame}
      <div className="flex flex-col gap-2.5 p-4">
        {variant === "editor" && (
          <>
            <div className="grid grid-cols-[1fr_2fr] gap-2.5">
              <div className="flex flex-col gap-1.5 rounded bg-black/15 p-2.5">
                {bar("90%", 1)}
                {bar("70%", 2)}
                {bar("80%", 3)}
                {bar("50%", 4)}
              </div>
              <div className="flex flex-col gap-1.5 rounded bg-white/10 p-2.5">
                {bar("60%", 5, true)}
                {bar("85%", 6, true)}
                {bar("40%", 7, true)}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded bg-white/15" />
              <div className="h-10 w-24 rounded bg-white/25" />
            </div>
          </>
        )}

        {variant === "dashboard" && (
          <>
            <div className="flex gap-1.5">
              {[24, 18, 30, 15].map((w, i) => (
                <div key={i} className="h-14 flex-1 rounded bg-white/12" style={{ maxWidth: `${w + 8}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-1.5 rounded bg-white/10 p-2">
                  {bar("80%", i * 3 + 1)}
                  {bar("55%", i * 3 + 2)}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-9 flex-1 rounded bg-white/12" />
              <div className="h-9 w-28 rounded bg-white/22" />
            </div>
          </>
        )}

        {variant === "mobile" && (
          <div className="mx-auto flex w-40 flex-col gap-2">
            <div className="mx-auto h-14 w-14 rounded-xl bg-white/20" />
            {bar("70%", 1, true)}
            {bar("90%", 2, true)}
            <div className="mt-1 flex gap-2">
              <div className="h-8 flex-1 rounded bg-white/15" />
              <div className="h-8 w-16 rounded bg-white/28" />
            </div>
            {bar("80%", 3, true)}
            {bar("60%", 4, true)}
          </div>
        )}

        {variant === "audio" && (
          <>
            <div className="flex h-24 items-end gap-1.5">
              {[40, 65, 30, 80, 50, 90, 35, 60, 45, 75, 55, 85, 40, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-white/25" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-full bg-white/20" />
              <div className="h-9 flex-1 rounded bg-white/12" />
              <div className="h-9 w-9 rounded-full bg-white/25" />
            </div>
          </>
        )}

        {variant === "terminal" && (
          <div className="flex flex-col gap-1.5 rounded bg-black/25 p-3 font-mono text-[10px] leading-4 text-white/80">
            <span>$ tokomo build --release</span>
            <span className="text-white/50">▸ compiling 128 modul</span>
            <span className="text-white/50">▸ optimisasi selesai dalam 1.2 detik</span>
            <span>$ tokomo test</span>
            <span className="text-white/80">✓ 42 pengujian lulus</span>
          </div>
        )}

        {variant === "grid" && (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex h-12 items-center justify-center rounded bg-white/12">
                <div className="h-4 w-4 rounded bg-white/25" />
              </div>
            ))}
          </div>
        )}

        {variant === "form" && (
          <div className="flex flex-col gap-2">
            <div className="h-8 rounded bg-white/15" />
            <div className="h-8 rounded bg-white/15" />
            <div className="h-16 rounded bg-white/12" />
            <div className="mt-1 h-9 w-28 rounded bg-white/25" />
          </div>
        )}

        {variant === "analytics" && (
          <>
            <div className="flex items-end gap-1.5">
              {[55, 70, 40, 85, 65, 95, 50].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-white/22" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-9 flex-1 rounded bg-white/12" />
              <div className="h-9 w-20 rounded bg-white/22" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
