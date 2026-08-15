const MIN = -3;
const MAX = 3;

export function SweetnessGauge({ value }: { value: number }) {
  const clamped = Math.max(MIN, Math.min(MAX, value));
  const pct = ((clamped - MIN) / (MAX - MIN)) * 100;

  let label = "中間";
  if (clamped <= -2) label = "甘口";
  else if (clamped < 0) label = "やや甘口";
  else if (clamped === 0) label = "中間";
  else if (clamped < 2) label = "やや辛口";
  else label = "辛口";

  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
        <span>甘口</span>
        <span className="font-medium text-foreground">{label}</span>
        <span>辛口</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-gradient-to-r from-wishlist/60 via-border to-visited/60">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-surface bg-accent shadow"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
