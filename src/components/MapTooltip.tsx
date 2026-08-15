export function MapTooltip({
  x,
  y,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  x: number;
  y: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs text-background shadow-lg"
      style={{ left: x, top: y }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
      <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-foreground" />
    </div>
  );
}
