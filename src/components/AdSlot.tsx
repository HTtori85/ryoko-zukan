export function AdSlot({ label = "広告" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-surface/60 text-xs text-muted"
      aria-label="広告枠"
    >
      {label}枠(Google AdSense等を設置予定)
    </div>
  );
}
