import type { ChartPoint } from "@/types";
import { formatCompact } from "@/lib/utils";

/**
 * Grafik SVG sederhana — tanpa library chart.
 * Ponytail: ganti dengan library chart sungguhan saat data backend kompleks masuk.
 */

function niceMax(values: number[]): number {
  const max = Math.max(...values, 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / magnitude) * magnitude;
}

export function LineChart({
  data,
  height = 220,
  className,
}: {
  data: ChartPoint[];
  height?: number;
  className?: string;
}) {
  const W = 600;
  const H = height;
  const padX = 34;
  const padY = 16;
  const max = niceMax(data.map((d) => d.value));
  const stepX = (W - padX * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padX + i * stepX;
    const y = H - padY - (d.value / max) * (H - padY * 2);
    return { x, y, label: d.label, value: d.value };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${path} L${points[points.length - 1].x},${H - padY} L${points[0].x},${H - padY} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Grafik garis"
      className={className}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={W - padX}
          y1={H - padY - (H - padY * 2) * f}
          y2={H - padY - (H - padY * 2) * f}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#line-fill)" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="var(--accent)" stroke="var(--surface)" strokeWidth="1.5" />
          <text x={p.x} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--fg-faint)">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function BarChart({
  data,
  height = 220,
  highlightLast = true,
  className,
}: {
  data: ChartPoint[];
  height?: number;
  highlightLast?: boolean;
  className?: string;
}) {
  const W = 600;
  const H = height;
  const padX = 40;
  const padY = 16;
  const max = niceMax(data.map((d) => d.value));
  const barW = (W - padX * 2) / data.length * 0.5;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Grafik batang"
      className={className}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="bar-fill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = padX + i * ((W - padX * 2) / data.length);
        const h = (d.value / max) * (H - padY * 2);
        const y = H - padY - h;
        const isLast = highlightLast && i === data.length - 1;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="4"
              fill={isLast ? "url(#bar-fill)" : "var(--surface-3)"}
            />
            <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--fg-faint)">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function HorizontalBars({
  data,
  valueFormatter = formatCompact,
  className,
}: {
  data: Array<{ name: string; value: number }>;
  valueFormatter?: (n: number) => string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={className}>
      {data.map((d) => (
        <div key={d.name} className="mb-3.5 flex items-center gap-3">
          <span className="w-32 truncate text-[13px] text-fg-muted">{d.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-accent/80"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-14 text-right text-[13px] font-medium tabular-nums">{valueFormatter(d.value)}</span>
        </div>
      ))}
    </div>
  );
}